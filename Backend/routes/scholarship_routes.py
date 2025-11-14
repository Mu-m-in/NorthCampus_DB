from flask import Blueprint, jsonify, request
import mysql.connector
import config

# Blueprint
scholarship_bp = Blueprint('scholarship_bp', __name__, url_prefix='/api/scholarships')

def get_db():
    return mysql.connector.connect(
        host=config.MYSQL_HOST,
        user=config.MYSQL_USER,
        password=config.MYSQL_PASSWORD,
        database=config.MYSQL_DB
    )

# ------------------ GET ALL SCHOLARSHIPS ------------------
@scholarship_bp.route('/', methods=['GET'])
def get_scholarships():
    scheme = request.args.get('scheme')
    year = request.args.get('year')
    print(scheme, year)
    db = get_db()
    cursor = db.cursor(dictionary=True)
    try:
        if scheme and year:
            cursor.execute("""
            SELECT 
                id, year, scheme_name, category,
                general_male, general_female, general_trans,
                ews_male, ews_female, ews_trans,
                sc_male, sc_female, sc_trans,
                st_male, st_female, st_trans,
                obc_male, obc_female, obc_trans,
                total_male, total_female, total_trans
            FROM scholarships 
            WHERE scheme_name = %s AND year = %s
            ORDER BY year DESC, scheme_name ASC, category ASC
        """, (scheme, year))
        else:          
            cursor.execute("""
                SELECT 
                    id, year, scheme_name, category,
                    general_male, general_female, general_trans,
                    ews_male, ews_female, ews_trans,
                    sc_male, sc_female, sc_trans,
                    st_male, st_female, st_trans,
                    obc_male, obc_female, obc_trans,
                    total_male, total_female, total_trans
                FROM scholarships
                ORDER BY year DESC, scheme_name ASC, category ASC
            """)
        data = cursor.fetchall()
        return jsonify(data), 200
    except mysql.connector.Error as err:
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

# ------------------ ADD SCHOLARSHIP MATRIX ROW ------------------
@scholarship_bp.route('/', methods=['POST'])
def add_scholarship():
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
    data = request.get_json()
    print(data)
    required = [
        'year', 'scheme_name', 'scheme',
        'genMale', 'genFemale', 'genOther',
        'ewsMale', 'ewsFemale', 'ewsOther',
        'scMale', 'scFemale', 'scOther',
        'stMale', 'stFemale', 'stOther',
        'obcMale', 'obcFemale', 'obcOther',
        'total_male', 'total_female', 'total_trans'
    ]
    # missing = [f for f in required if f not in data]
    # if missing:
    #     # print(missing)
    #     return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400
    db = get_db()
    cursor = db.cursor()
    try:
        cursor.execute("""
            INSERT INTO scholarships (
                year, scheme_name, category,
                general_male, general_female, general_trans,
                ews_male, ews_female, ews_trans,
                sc_male, sc_female, sc_trans,
                st_male, st_female, st_trans,
                obc_male, obc_female, obc_trans,
                total_male, total_female, total_trans
            ) VALUES (
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s,
                %s, %s, %s
            )
        """, (
            data['year'], data['scheme_name'], data['category'],
            data['general_male'], data['general_female'], data['general_trans'],
            data['ews_male'], data['ews_female'], data['ews_trans'],
            data['sc_male'], data['sc_female'], data['sc_trans'],
            data['st_male'], data['st_female'], data['st_trans'],
            data['obc_male'], data['obc_female'], data['obc_trans'],
            data['total_male'], data['total_female'], data['total_trans']
        ))
        db.commit()
        return jsonify({'message': f"✅ Row ({data['scheme_name']}) saved successfully"}), 201
    except mysql.connector.Error as err:
        db.rollback()
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()

@scholarship_bp.route('/', methods=['PUT'])
def update_scholarship():
    if not request.is_json:
        return jsonify({'error': 'Request must be JSON'}), 400
    data = request.get_json()

    required = [
        'year', 'scheme_name', 'category',
        'general_male', 'general_female', 'general_trans',
        'ews_male', 'ews_female', 'ews_trans',
        'sc_male', 'sc_female', 'sc_trans',
        'st_male', 'st_female', 'st_trans',
        'obc_male', 'obc_female', 'obc_trans',
        'total_male', 'total_female', 'total_trans'
    ]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    db = get_db()
    cursor = db.cursor()

    try:
        # Check if row exists first
        cursor.execute("""
            SELECT id FROM scholarships 
            WHERE year=%s AND scheme_name=%s AND category=%s
        """, (data['year'], data['scheme_name'], data['category']))
        row = cursor.fetchone()

        if row:
            # Update existing row
            cursor.execute("""
                UPDATE scholarships
                SET
                    general_male=%s, general_female=%s, general_trans=%s,
                    ews_male=%s, ews_female=%s, ews_trans=%s,
                    sc_male=%s, sc_female=%s, sc_trans=%s,
                    st_male=%s, st_female=%s, st_trans=%s,
                    obc_male=%s, obc_female=%s, obc_trans=%s,
                    total_male=%s, total_female=%s, total_trans=%s
                WHERE year=%s AND scheme_name=%s AND category=%s
            """, (
                data['general_male'], data['general_female'], data['general_trans'],
                data['ews_male'], data['ews_female'], data['ews_trans'],
                data['sc_male'], data['sc_female'], data['sc_trans'],
                data['st_male'], data['st_female'], data['st_trans'],
                data['obc_male'], data['obc_female'], data['obc_trans'],
                data['total_male'], data['total_female'], data['total_trans'],
                data['year'], data['scheme_name'], data['category']
            ))
        else:
            # Insert if not exists
            cursor.execute("""
                INSERT INTO scholarships (
                    year, scheme_name, category,
                    general_male, general_female, general_trans,
                    ews_male, ews_female, ews_trans,
                    sc_male, sc_female, sc_trans,
                    st_male, st_female, st_trans,
                    obc_male, obc_female, obc_trans,
                    total_male, total_female, total_trans
                ) VALUES (
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s,
                    %s, %s, %s
                )
            """, (
                data['year'], data['scheme_name'], data['category'],
                data['general_male'], data['general_female'], data['general_trans'],
                data['ews_male'], data['ews_female'], data['ews_trans'],
                data['sc_male'], data['sc_female'], data['sc_trans'],
                data['st_male'], data['st_female'], data['st_trans'],
                data['obc_male'], data['obc_female'], data['obc_trans'],
                data['total_male'], data['total_female'], data['total_trans']
            ))

        db.commit()
        return jsonify({'message': f"✅ Row ({data['category']}) updated successfully"}), 200
    except mysql.connector.Error as err:
        db.rollback()
        return jsonify({'error': str(err)}), 500
    finally:
        cursor.close()
        db.close()