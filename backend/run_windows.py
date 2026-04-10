from app import create_app
import waitress
import os
import sys

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting AeroFetch backend server on http://localhost:{port}")
    print("   Using Waitress WSGI server (Windows optimized)")
    waitress.serve(app, host='0.0.0.0', port=port)
