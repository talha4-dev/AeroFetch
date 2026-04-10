import re
from urllib.parse import urlparse

ALLOWED_DOMAINS = [
    'youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com',
    'facebook.com', 'www.facebook.com', 'fb.watch', 'm.facebook.com',
    'tiktok.com', 'www.tiktok.com', 'vm.tiktok.com', 'm.tiktok.com',
    'instagram.com', 'www.instagram.com',
    'twitter.com', 'www.twitter.com', 'x.com', 'www.x.com',
    'vimeo.com', 'www.vimeo.com',
    'dailymotion.com', 'www.dailymotion.com',
]

def sanitize_url(url: str) -> dict:
    """
    Validates and sanitizes a URL for downloading.
    Returns: {'valid': bool, 'url': str, 'platform': str, 'error': str}
    """
    if not url or not isinstance(url, str):
        return {'valid': False, 'error': 'URL is required', 'url': None, 'platform': None}

    url = url.strip()

    # Basic XSS/injection strip
    dangerous_patterns = [
        r'<[^>]+>', r'javascript:', r'data:', r'vbscript:',
        r'on\w+\s*=', r'eval\s*\(', r'<script', r'</script'
    ]
    for pattern in dangerous_patterns:
        if re.search(pattern, url, re.IGNORECASE):
            return {'valid': False, 'error': 'Invalid URL: potentially dangerous content detected', 'url': None, 'platform': None}

    # Check scheme
    try:
        parsed = urlparse(url)
    except Exception:
        return {'valid': False, 'error': 'Malformed URL', 'url': None, 'platform': None}

    if parsed.scheme not in ('http', 'https'):
        if not url.startswith('http'):
            url = 'https://' + url
            try:
                parsed = urlparse(url)
            except Exception:
                return {'valid': False, 'error': 'Malformed URL', 'url': None, 'platform': None}
        else:
            return {'valid': False, 'error': 'Only HTTP/HTTPS URLs are allowed', 'url': None, 'platform': None}

    domain = parsed.netloc.lower()
    if domain not in ALLOWED_DOMAINS:
        return {
            'valid': False,
            'error': f'Platform not supported. Supported: YouTube, Facebook, TikTok, Instagram, Twitter, Vimeo, Dailymotion',
            'url': None,
            'platform': None
        }

    platform = detect_platform(domain)
    return {'valid': True, 'url': url, 'platform': platform, 'error': None}


def detect_platform(domain: str) -> str:
    domain = domain.lower()
    if 'youtube' in domain or 'youtu.be' in domain:
        return 'YouTube'
    elif 'facebook' in domain or 'fb.watch' in domain:
        return 'Facebook'
    elif 'tiktok' in domain:
        return 'TikTok'
    elif 'instagram' in domain:
        return 'Instagram'
    elif 'twitter' in domain or 'x.com' in domain:
        return 'Twitter/X'
    elif 'vimeo' in domain:
        return 'Vimeo'
    elif 'dailymotion' in domain:
        return 'Dailymotion'
    return 'Unknown'
