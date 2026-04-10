from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, jwt_required, get_jwt_identity
)
from models.user import db, User
from google.oauth2 import id_token
from google.auth.transport import requests as grequests
import re

auth_bp = Blueprint('auth', __name__)


def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    if len(password) < 8:
        return False, 'Password must be at least 8 characters'
    if not re.search(r'[A-Za-z]', password):
        return False, 'Password must contain at least one letter'
    if not re.search(r'\d', password):
        return False, 'Password must contain at least one number'
    return True, None

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    name = (data.get('name') or '').strip()

    if not email or not validate_email(email):
        return jsonify({'success': False, 'error': 'Invalid email address'}), 400

    valid_pw, pw_error = validate_password(password)
    if not valid_pw:
        return jsonify({'success': False, 'error': pw_error}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'success': False, 'error': 'An account with this email already exists'}), 409

    user = User(email=email, name=name)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'success': True,
        'message': 'Account created successfully',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'success': False, 'error': 'No data provided'}), 400

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'success': False, 'error': 'Email and password are required'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({'success': False, 'error': 'Invalid email or password'}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'success': True,
        'message': 'Logged in successfully',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))
    if not user:
        return jsonify({'success': False, 'error': 'User not found'}), 404
    return jsonify({'success': True, 'user': user.to_dict()}), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # JWT is stateless; client removes the token
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200


@auth_bp.route('/google', methods=['POST'])
def google_auth():
    """Verify a Google ID token and return an AeroFetch JWT."""
    data = request.get_json()
    credential = data.get('credential') if data else None

    if not credential:
        return jsonify({'success': False, 'error': 'Google credential is required'}), 400

    client_id = current_app.config.get('GOOGLE_CLIENT_ID', '')
    if not client_id or 'YOUR_GOOGLE_CLIENT_ID' in client_id:
        return jsonify({'success': False, 'error': 'Google OAuth is not configured on this server'}), 503

    try:
        # Verify the token with Google's public keys
        idinfo = id_token.verify_oauth2_token(
            credential,
            grequests.Request(),
            client_id
        )
    except ValueError as e:
        return jsonify({'success': False, 'error': f'Invalid Google token: {str(e)}'}), 401

    google_sub = idinfo.get('sub')        # stable Google user ID
    email      = idinfo.get('email', '').lower()
    name       = idinfo.get('name', '')
    picture    = idinfo.get('picture', '')

    if not email:
        return jsonify({'success': False, 'error': 'Google account has no email'}), 400

    # --- Find or create user ---
    user = User.query.filter_by(google_id=google_sub).first()

    if not user:
        # Check if email is already registered (link accounts)
        user = User.query.filter_by(email=email).first()
        if user:
            # Link Google to existing email account
            user.google_id = google_sub
            if not user.picture:
                user.picture = picture
        else:
            # Brand-new user via Google — create without password
            user = User(
                email=email,
                name=name,
                google_id=google_sub,
                picture=picture
            )
            db.session.add(user)

    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        'success': True,
        'message': 'Logged in with Google',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200
