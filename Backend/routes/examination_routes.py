from flask import Blueprint, jsonify ,request
import mysql.connector
import config

examination_bp = Blueprint('examination_bp', __name__)


def get_db():
    return mysql.connector.connect(
        host=config.MYSQL_HOST,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DB
    )

@examination_bp.route("/", methods=["POST"])
def add_final_year_student():
    data = request.get_json()
    print(data)

    # REQUIRED FIELDS
    required_fields = ["program", "total_students_appeared" , "total_students_passed" , "general" , "sc" , "st" , "obc" , "ews" , "male", "female", "other", "year" ]
    missing = [field for field in required_fields if field not in data]
    if missing:
        return jsonify({"error": "Missing fields: " + ", ".join(missing)}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        cursor.execute("""
            INSERT INTO exam_results
            (course_id, total_students_appeared , total_students_passed , general , sc , st , obc , ews , male, female, other, year )
            VALUES (%s, %s, %s, %s, %s, %s , %s, %s, %s, %s ,%s ,%s)
        """, (
            data["program"],
            data["total_students_appeared"],
            data["total_students_passed"],
            data["general"],
            data["sc"],
            data["st"],
            data["obc"],
            data["ews"],
            data["male"],
            data["female"],
            data["other"],
            data["year"]
        ))

        db.commit()
        inserted_id = cursor.lastrowid

        return jsonify({
            "success": True,
            "message": "Final year record added successfully",
            "record": {"id": inserted_id, **data}
        }), 201

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        db.close()

@examination_bp.route("/report", methods=["GET"])
def final_year_report():
    year = request.args.get("year")
    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        query = """
            SELECT 
                id,
                course_id,
                total_students_appeared,
                total_students_passed,
                general,
                sc,
                st,
                obc,
                ews,
                male,
                female,
                other,
                year    
            FROM exam_results
            WHERE year = %s
            ORDER BY id DESC
        """

        cursor.execute(query, (year,))
        rows = cursor.fetchall()

        return jsonify(rows), 200

    except mysql.connector.Error as err:
        print(err)
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        db.close()
