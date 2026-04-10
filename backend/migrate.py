#!/usr/bin/env python3
"""
AeroFetch - Database Migration Script
Adds google_id and picture columns to the users table.
Run this once: python3 migrate.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text # Fix for SQLAlchemy 2.0
from app import create_app
from models.user import db

app = create_app()

with app.app_context():
    with db.engine.begin() as conn: # Automatically starts and commits/rolls back transaction
        # Get existing columns using text() for SQLAlchemy 2.0 compatibility
        result = conn.execute(text("PRAGMA table_info(users)"))
        cols = [row[1] for row in result]
        print(f"Existing columns: {cols}")

        if 'google_id' not in cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN google_id VARCHAR(120)"))
            print("[SUCCESS] Added google_id column")
        else:
            print("[INFO] google_id already exists")

        if 'picture' not in cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN picture TEXT"))
            print("[SUCCESS] Added picture column")
        else:
            print("[INFO] picture already exists")

    print("\n[SUCCESS] Migration complete! Restart the backend server.")
