from flask import Blueprint, jsonify, request
import mysql.connector
import config

scholarship_bp = Blueprint('scholarship_bp', __name__)

def get_db():
    return mysql.connector.connect(
        host=config.MYSQL_HOST,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DB
    )

# GET /scholarships?year=2024 
@scholarship_bp.route('/', methods=['GET'])
def get_scholarships():
    year = request.args.get('year', type=int)
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        if year:
            cursor.execute("SELECT * FROM scholarships WHERE year=%s ORDER BY scheme", (year,))
        else:
            cursor.execute("SELECT * FROM scholarships ORDER BY year DESC, scheme")
        rows = cursor.fetchall()
        return jsonify(rows), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

# POST /scholarships
@scholarship_bp.route('/', methods=['POST'])
def add_scholarship():
    if not request.is_json:
        return jsonify({'error': 'Request body must be JSON'}), 400

    data = request.get_json()

    required_fields = [
        "year", "scheme",
        "general_male", "general_female", "general_trans",
        "ews_male", "ews_female", "ews_trans",
        "sc_male", "sc_female", "sc_trans",
        "st_male", "st_female", "st_trans",
        "obc_male", "obc_female", "obc_trans",
        "total_male", "total_female", "total_trans"
    ]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    # Light validation: ensure integers and non-negative
    int_fields = required_fields
    try:
        for f in int_fields:
            if f != "scheme":
                if int(data[f]) < 0:
                    return jsonify({'error': f'{f} must be >= 0'}), 400
        # Normalize scheme
        scheme = str(data['scheme']).upper()
        if scheme not in {"TOTAL", "PWD", "MUSLIM_MINORITY", "OTHER_MINORITY"}:
            return jsonify({'error': "scheme must be one of: TOTAL, PWD, MUSLIM_MINORITY, OTHER_MINORITY"}), 400
    except (ValueError, TypeError) as _:
        return jsonify({'error': 'All count fields and year must be integers'}), 400

    # Optional consistency check: totals should be the sum of category columns
    computed_total_male = sum(int(data[k]) for k in ["general_male","ews_male","sc_male","st_male","obc_male"])
    computed_total_female = sum(int(data[k]) for k in ["general_female","ews_female","sc_female","st_female","obc_female"])
    computed_total_trans = sum(int(data[k]) for k in ["general_trans","ews_trans","sc_trans","st_trans","obc_trans"])
    if (computed_total_male != int(data["total_male"]) or
        computed_total_female != int(data["total_female"]) or
        computed_total_trans != int(data["total_trans"])):
        return jsonify({
            'error': 'TOTAL columns must equal the sum of General+EWS+SC+ST+OBC',
            'expected': {
                'total_male': computed_total_male,
                'total_female': computed_total_female,
                'total_trans': computed_total_trans
            }
        }), 400

    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            INSERT INTO scholarships
              (year, scheme,
               general_male, general_female, general_trans,
               ews_male, ews_female, ews_trans,
               sc_male, sc_female, sc_trans,
               st_male, st_female, st_trans,
               obc_male, obc_female, obc_trans,
               total_male, total_female, total_trans)
            VALUES
              (%s,%s,
               %s,%s,%s,
               %s,%s,%s,
               %s,%s,%s,
               %s,%s,%s,
               %s,%s,%s,
               %s,%s,%s)
        """, (
            data['year'], scheme,
            data['general_male'], data['general_female'], data['general_trans'],
            data['ews_male'], data['ews_female'], data['ews_trans'],
            data['sc_male'], data['sc_female'], data['sc_trans'],
            data['st_male'], data['st_female'], data['st_trans'],
            data['obc_male'], data['obc_female'], data['obc_trans'],
            data['total_male'], data['total_female'], data['total_trans']
        ))
        db.commit()
        scholarship_id = cursor.lastrowid
        return jsonify({'message': 'Scholarship row added successfully', 'id': scholarship_id}), 201
    except mysql.connector.Error as err:
        db.rollback()
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()