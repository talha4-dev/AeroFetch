from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import bcrypt

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=True)   # nullable: Google users have no password
    google_id = db.Column(db.String(120), unique=True, nullable=True)  # Google sub ID
    name = db.Column(db.String(100), nullable=True)
    picture = db.Column(db.Text, nullable=True)               # Google profile picture URL
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    downloads = db.relationship('DownloadHistory', backref='user', lazy=True, cascade='all, delete-orphan')


    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name or self.email.split('@')[0],
            'created_at': self.created_at.isoformat(),
            'download_count': len(self.downloads)
        }


class DownloadHistory(db.Model):
    __tablename__ = 'download_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    url = db.Column(db.Text, nullable=False)
    title = db.Column(db.String(500), nullable=True)
    thumbnail = db.Column(db.Text, nullable=True)
    platform = db.Column(db.String(50), nullable=True)
    quality = db.Column(db.String(50), nullable=True)
    format = db.Column(db.String(20), nullable=True)
    file_size = db.Column(db.String(50), nullable=True)
    duration = db.Column(db.String(50), nullable=True)
    status = db.Column(db.String(20), default='completed')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'url': self.url,
            'title': self.title,
            'thumbnail': self.thumbnail,
            'platform': self.platform,
            'quality': self.quality,
            'format': self.format,
            'file_size': self.file_size,
            'duration': self.duration,
            'status': self.status,
            'created_at': self.created_at.isoformat()
        }
