from flask import Blueprint, jsonify
import mysql.connector
import config

stats_bp = Blueprint('stats_bp', __name__)

def get_db():
    return mysql.connector.connect(
        host=config.MYSQL_HOST,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DB
    )

@stats_bp.route('/', methods=['GET'])
def get_stats():
    
    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT COUNT(*) AS count FROM departments")
    departments = cursor.fetchone()['count']

    cursor.execute("SELECT COUNT(*) AS count FROM students")
    students = cursor.fetchone()['count']

    cursor.execute("SELECT SUM(total_students_passed) AS count FROM exam_results")
    exams = cursor.fetchone()['count']


    cursor.execute("SELECT SUM(total_placed) AS count FROM placements")
    placements = cursor.fetchone()['count']

    cursor.execute("""
        SELECT SUM(total_male + total_female + total_trans) AS count 
        FROM scholarships
    """)
    scholarships = cursor.fetchone()['count']

    cursor.execute("SELECT COUNT(*) AS count FROM employees")
    staff = cursor.fetchone()['count']

    cursor.execute("SELECT COUNT(*) AS count FROM hostels")
    hostels = cursor.fetchone()['count']

    db.close()

    return jsonify({
        "departments": departments,
        "students": students,
        "exams": exams,
        "placements": placements,
        "staff": staff,
        "scholarships": scholarships,
        "hostels": hostels,
    })
