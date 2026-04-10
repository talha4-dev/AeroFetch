#!/usr/bin/env python3
"""
Quick test to verify YouTube cookies are working
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.downloader import validate_cookies, get_cookies_path
import requests

def check_cookie_validity(cookie_path):
    """Perform a live check to see if cookies are accepted by YouTube"""
    try:
        cookies = {}
        with open(cookie_path, 'r') as f:
            for line in f:
                if not line.strip() or line.startswith('#'):
                    continue
                parts = line.strip().split('\t')
                # Netscape cookie format has 7 columns
                if len(parts) >= 7:
                    cookies[parts[5]] = parts[6]
        
        # Test request to YouTube
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        response = requests.get('https://www.youtube.com', cookies=cookies, headers=headers, timeout=10)
        
        # If 'CONSENT' or 'LOGIN_INFO' is present in our request's effects or if we get a valid page
        return response.status_code == 200 and ('LOGIN_INFO' in str(response.request._cookies) or 'SID' in str(response.request._cookies))
    except Exception as e:
        print(f"[ERROR] Live check error: {e}")
        return False

def test_cookies():
    print("[TEST] Testing YouTube cookies configuration...")
    
    cookie_path = get_cookies_path()
    if not cookie_path:
        print("[FAILED] No cookies file found at Config.COOKIES_FILE")
        return False
        
    print(f"[INFO] Cookies file: {cookie_path}")
    
    # 1. Structural Check
    if validate_cookies(cookie_path):
        print("[SUCCESS] Structural check PASSED - essential cookies found in file")
        
        # 2. Live Validity Check
        print("[PROGRESS] Performing live validity check...")
        if check_cookie_validity(cookie_path):
            print("[SUCCESS] Live check PASSED - YouTube accepted these cookies!")
            print("[READY] You are ready for high-quality authenticated downloads.")
            return True
        else:
            print("[FAILED] Live check FAILED - cookies might be expired or blocked")
            return False
    else:
        print("[FAILED] Structural check FAILED - check your cookies file content")
        return False

if __name__ == "__main__":
    test_cookies()
