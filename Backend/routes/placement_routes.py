from flask import Blueprint, jsonify, request
import mysql.connector
import config

placement_bp = Blueprint('placement_bp', __name__)

def get_db():
    return mysql.connector.connect(
        host=config.MYSQL_HOST,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DB
    )

@placement_bp.route('/', methods=['GET'])
def get_placement():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM placements Join courses on placements.course_id = courses.id")
        data = cursor.fetchall()
        if not data:
            return jsonify({'error': 'No data found'}), 404
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()
    return jsonify(data)

@placement_bp.route('/', methods=['POST'])
def add_placement():
    data = request.get_json()
    # Validate required fields
    required_fields = ["course_id","total_students","total_placed","median_salary","average_salary","male","female","other","year"]
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            INSERT INTO placements 
            (course_id,total_students,total_placed,median_salary,average_salary,male,female,other,year)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            data['course_id'],data['total_students'],data['total_placed'],data['median_salary'],data['average_salary'],data['male'],data['female'],data['other'],data['year']
        ))
        db.commit()
        course_id = cursor.lastrowid
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()
    return jsonify({'message': 'Placement added successfully'}), 201