from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Book(db.Model):
    __tablename__ = 'books'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    cover_url = db.Column(db.String(300))
    description = db.Column(db.Text)
    rating = db.Column(db.Integer)
    annotation = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())

class WritingLog(db.Model):
    __tablename__ = 'writing_logs'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(50), nullable=False)
    content = db.Column(db.Text, nullable=False)
    prompt = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())