from flask import Blueprint, jsonify ,request
import mysql.connector
import config

students_bp = Blueprint('students_bp', __name__)


def get_db():
    return mysql.connector.connect(
        host=config.MYSQL_HOST,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DB
    )


@students_bp.route("/", methods=["GET"])
def get_students():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    query = """
        SELECT 
            s.id, s.name, s.roll_number, 
            s.category, s.gender, s.handicapped, s.religion, s.year_of_admission,
            d.name AS department_name, 
            c.name AS course_name
        FROM students s
        JOIN departments d ON s.department_id = d.id
        JOIN courses c ON s.course_id = c.id
        ORDER BY s.id DESC
    """
    cursor.execute(query)
    students = cursor.fetchall()
    cursor.close()
    return jsonify(students), 200




@students_bp.route('/', methods=['POST'])
def add_student():
    data = request.get_json()

    required_fields = ["name", "roll_number", "department_id", "course_id", "category", "gender", "handicapped", "religion", "year_of_admission"]
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            INSERT INTO students 
            (name, roll_number, department_id, course_id, category, gender, handicapped, religion, year_of_admission)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            data['name'], data['roll_number'], data['department_id'], data['course_id'],
            data['category'], data['gender'], data['handicapped'], data['religion'], data['year_of_admission']
        ))
        db.commit()
        student_id = cursor.lastrowid
        return jsonify({
            "success": True,
            "message": "Student added successfully",
            "student": {"id": student_id, **data}
        }), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        db.close()

@students_bp.route('/', methods=['PUT'])
def update_student():
    data = request.get_json()

    required_fields = ["id", "name", "roll_number", "category", "gender", "handicapped", "religion", "year_of_admission"]
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            UPDATE students
            SET name = %s, roll_number = %s, category = %s, gender = %s, handicapped = %s, religion = %s, year_of_admission = %s
            WHERE id = %s
        """, (
            data['name'], data['roll_number'],
            data['category'], data['gender'], data['handicapped'], data['religion'], data['year_of_admission'], data['id']
        ))
        db.commit()
        return jsonify({
            "success": True,
            "message": "Student updated successfully",
            "student": data
        }), 200
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        db.close()