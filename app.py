from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Book, WritingLog
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///litmate.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

@app.route('/api/books', methods=['GET'])
def get_books():
    books = Book.query.all()
    return jsonify([{
        'id': book.id,
        'title': book.title,
        'author': book.author,
        'cover_url': book.cover_url,
        'description': book.description,
        'rating': book.rating,
        'annotation': book.annotation
    } for book in books])

@app.route('/api/books', methods=['POST'])
def add_book():
    data = request.json
    new_book = Book(
        title=data['title'],
        author=data['author'],
        cover_url=data.get('cover_url', ''),
        description=data.get('description', ''),
        rating=data.get('rating', 0),
        annotation=data.get('annotation', '')
    )
    db.session.add(new_book)
    db.session.commit()
    return jsonify({'message': 'Book added successfully'}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)