
from flask import Blueprint, request, jsonify
import mysql.connector
import config

employee_bp = Blueprint("employee_bp", __name__)

def get_db():
    return mysql.connector.connect(
        host=config.MYSQL_HOST,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DB
    )
# -----------------------------------------
# ADD A NEW EMPLOYEE (POST)
# -----------------------------------------
@employee_bp.route("/", methods=["POST"])
def add_employee():
    data = request.json

    required_fields = [
        "name", "employee_type", "employment_type",
        "group_type", "category_minority", "category_other", "gender"
    ]
    print(data)
    # Validate missing fields
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    db = get_db()
    cursor = db.cursor()

    try:
        query = """
            INSERT INTO employees
                (name, employee_type, employment_type, group_type,
                 category_minority, category_other, gender)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(query, (
            data["name"],
            data["employee_type"],         # teaching / non-teaching
            data["employment_type"],       # contractual / permanent
            data["group_type"],            # A/B/C
            data["category_minority"],     # PWD / Muslim Minority / Other Minority
            data["category_other"],        # General / EWS / SC / ST / OBC
            data["gender"]                 # Male / Female / Other
        ))

        db.commit()
        return jsonify({"message": "Employee added successfully"}), 201

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        db.close()


# -----------------------------------------
# GET EMPLOYEES (All or filter by employee_type)
# Example: /employees?employee_type=non-teaching
# -----------------------------------------
@employee_bp.route("/", methods=["GET"])
def get_employees():
    employee_type = request.args.get("employee_type")  # teaching / non-teaching

    db = get_db()
    cursor = db.cursor(dictionary=True)

    try:
        query = "SELECT * FROM employees"
        params = ()

        if employee_type:
            query += " WHERE employee_type = %s"
            params = (employee_type,)

        cursor.execute(query, params)
        rows = cursor.fetchall()

        return jsonify(rows), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        db.close()


# -----------------------------------------
# UPDATE EMPLOYEE (PUT)
# -----------------------------------------
@employee_bp.route("/<int:id>", methods=["PUT"])
def update_employee(id):
    data = request.json

    db = get_db()
    cursor = db.cursor()

    try:
        query = """
            UPDATE employees SET
                name = %s,
                employee_type = %s,
                employment_type = %s,
                group_type = %s,
                category_minority = %s,
                category_other = %s,
                gender = %s
            WHERE id = %s
        """

        cursor.execute(query, (
            data.get("name"),
            data.get("employee_type"),
            data.get("employment_type"),
            data.get("group_type"),
            data.get("category_minority"),
            data.get("category_other"),
            data.get("gender"),
            id
        ))

        db.commit()
        return jsonify({"message": "Employee updated"}), 200

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

    finally:
        cursor.close()
        db.close()
