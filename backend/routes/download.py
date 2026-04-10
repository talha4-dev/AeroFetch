from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from models.user import db, User, DownloadHistory
from utils.sanitizer import sanitize_url
from utils.downloader import get_video_info, download_video
import os
import threading

download_bp = Blueprint('download', __name__)


@download_bp.route('/info', methods=['POST'])
def get_info():
    data = request.get_json()
    if not data or not data.get('url'):
        return jsonify({'success': False, 'error': 'URL is required'}), 400

    sanity = sanitize_url(data['url'])
    if not sanity['valid']:
        return jsonify({'success': False, 'error': sanity['error']}), 400

    info = get_video_info(sanity['url'])
    if not info['success']:
        return jsonify({'success': False, 'error': info['error']}), 422

    info['platform'] = sanity['platform']
    return jsonify({'success': True, 'data': info}), 200


@download_bp.route('/file', methods=['POST'])
def download_file():
    data = request.get_json()
    if not data or not data.get('url'):
        return jsonify({'success': False, 'error': 'URL is required'}), 400

    url = data.get('url')
    format_id = data.get('format_id', 'bestvideo+bestaudio')
    output_format = data.get('output_format', 'mp4')
    quality = data.get('quality', 'best')

    sanity = sanitize_url(url)
    if not sanity['valid']:
        return jsonify({'success': False, 'error': sanity['error']}), 400

    # Quality and format are now determined strictly by user selection
    # (Previously forced guests to 360p/no-audio)

    result = download_video(sanity['url'], format_id, output_format, quality)
    if not result['success']:
        return jsonify({'success': False, 'error': result['error']}), 422

    # Try to save to history if user is authenticated
    try:
        verify_jwt_in_request(optional=True)
        user_id = get_jwt_identity()
        if user_id:
            history = DownloadHistory(
                user_id=int(user_id),
                url=url,
                title=result.get('title'),
                thumbnail=result.get('thumbnail'),
                platform=sanity['platform'],
                quality=quality,
                format=output_format,
                file_size=result.get('file_size'),
                duration=result.get('duration'),
                status='completed'
            )
            db.session.add(history)
            db.session.commit()
    except Exception:
        pass  # History saving is optional

    file_path = result['file_path']
    file_name = result['file_name']

    if not os.path.exists(file_path):
        return jsonify({'success': False, 'error': 'Downloaded file not found. Please try again.'}), 500

    def cleanup(path):
        try:
            os.remove(path)
        except Exception:
            pass

    response = send_file(
        file_path,
        as_attachment=True,
        download_name=file_name,
    )

    # Schedule cleanup after 10 minutes to support slow connections
    threading.Timer(600, cleanup, args=[file_path]).start()
    return response


@download_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    history = DownloadHistory.query.filter_by(user_id=int(user_id))\
        .order_by(DownloadHistory.created_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'success': True,
        'history': [h.to_dict() for h in history.items],
        'total': history.total,
        'pages': history.pages,
        'current_page': page
    }), 200


@download_bp.route('/history/<int:history_id>', methods=['DELETE'])
@jwt_required()
def delete_history(history_id):
    user_id = get_jwt_identity()
    entry = DownloadHistory.query.filter_by(id=history_id, user_id=int(user_id)).first()
    if not entry:
        return jsonify({'success': False, 'error': 'History entry not found'}), 404
    db.session.delete(entry)
    db.session.commit()
    return jsonify({'success': True, 'message': 'Entry deleted'}), 200
