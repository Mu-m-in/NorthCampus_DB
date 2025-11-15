from flask import Blueprint, jsonify, request
import mysql.connector
import config

library_bp = Blueprint('library_bp', __name__)
def get_db():
    return mysql.connector.connect(
        host=config.MYSQL_HOST,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DB
    )

#GET
@library_bp.route('/', methods=['GET'])
def get_library():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM library")
        data = cursor.fetchall()
        return jsonify(data), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()


# POST 
@library_bp.route('/', methods=['POST'])
def add_library():
    data = request.get_json()

    # REQUIRED FIELDS
    required = ['library_name', 'total_books', 'students_registered', 'issued_books']
    missing = [field for field in required if field not in data]

    if missing:
        return jsonify({'error': f"Missing fields: {', '.join(missing)}"}), 400

    # EXTRACT FIELDS
    library_name = data['library_name']
    total_books = data['total_books']
    students_registered = data['students_registered']
    issued_books = data['issued_books']

    # available books
    available_books = total_books - issued_books

    db = get_db()
    cursor = db.cursor()

    try:
        cursor.execute("""
            INSERT INTO library 
            (library_name, total_books, students_registered, issued_books, available_books)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            library_name,
            total_books,
            students_registered,
            issued_books,
            available_books
        ))
        db.commit()
        new_id = cursor.lastrowid
        return jsonify({'message': 'Library data added', 'id': new_id}), 201
    
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    
    finally:
        cursor.close()
        db.close()