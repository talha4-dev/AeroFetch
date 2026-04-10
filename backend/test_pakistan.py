#!/usr/bin/env python3
"""
Test YouTube access from Pakistan perspective
"""
import yt_dlp

def test_pakistan_access():
    print("🧪 Testing YouTube access from Pakistan perspective...")
    
    ydl_opts = {
        'quiet': True,
        'geo_bypass_country': 'PK',
        'http_headers': {
            'Accept-Language': 'en-PK,en;q=0.9,ur;q=0.8',
        }
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            # Test with a popular Pakistan-available video
            info = ydl.extract_info('https://www.youtube.com/watch?v=JGwWNGJdvx8', download=False)
            print("✅ Pakistan access test PASSED")
            print(f"Title: {info.get('title')}")
            return True
    except Exception as e:
        print(f"❌ Pakistan access test FAILED: {e}")
        return False

if __name__ == "__main__":
    test_pakistan_access()
