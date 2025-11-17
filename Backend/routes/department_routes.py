from flask import Blueprint, jsonify, request
import mysql.connector
import config

department_bp = Blueprint('department_bp', __name__)

def get_db():
    return mysql.connector.connect(
        host=config.MYSQL_HOST,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DB
    )

@department_bp.route('/', methods=['GET'])
def get_departments():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM departments")
        data = cursor.fetchall()
        if not data:
            return jsonify({'error': 'No data found'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()
    return jsonify(data)

@department_bp.route('/', methods=['POST'])
def add_department():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['name']
    missing = [field for field in required_fields if field not in data or not data[field]]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            INSERT INTO departments 
            (name)
            VALUES (%s)
        """, (
            data['name'],
        ))
        db.commit()
        department_id = cursor.lastrowid
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

    return jsonify({'message': 'Department added successfully', 'id': department_id , 'name': data['name']}), 201

@department_bp.route('/', methods=['PUT'])
def update_department():
    data = request.get_json()
    print(data)
    # Validate required fields
    required_fields = ['name']
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM departments WHERE id = %s", (data['id'],))
        department = cursor.fetchone()
        if not department:
            return jsonify({'error': 'Department not found'}), 404
        cursor.execute("""
            UPDATE departments
            SET name = %s
            WHERE id = %s
        """, (
            data['name'],data['id']
        ))
        db.commit()
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

    return jsonify({'message': 'Department updated successfully'}), 200

@department_bp.route('/', methods=['DELETE'])
def delete_department():
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['id']
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("SELECT * FROM departments WHERE id = %s", (data['id'],))
        department = cursor.fetchone()
        if not department:
            return jsonify({'error': 'Department not found'}), 404
        cursor.execute("DELETE FROM departments WHERE id = %s", (data['id'],))
        db.commit()
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

    return jsonify({'message': 'Department deleted successfully'}), 200