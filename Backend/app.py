from flask import Flask
from flask_cors import CORS
from routes.department_routes import department_bp
from routes.courses_routes import courses_bp
from routes.student_routes import students_bp
from routes.stats_routes import stats_bp
from routes.placement_routes import placement_bp
from routes.scholarship_routes import scholarship_bp
from routes.hostels_routes import hostel_bp
from routes.library_routes import library_bp
from routes.examination_routes import examination_bp
from routes.employee_routes import employee_bp
import os

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register Blueprints
app.register_blueprint(department_bp, url_prefix="/api/departments")
app.register_blueprint(courses_bp, url_prefix="/api/courses")
app.register_blueprint(students_bp, url_prefix="/api/students")
app.register_blueprint(stats_bp, url_prefix="/api/stats")
app.register_blueprint(placement_bp, url_prefix="/api/placements")
app.register_blueprint(scholarship_bp, url_prefix="/api/scholarships")
app.register_blueprint(hostel_bp, url_prefix="/api/hostels")
app.register_blueprint(library_bp, url_prefix="/api/library")
app.register_blueprint(examination_bp, url_prefix="/api/examinations")
app.register_blueprint(employee_bp, url_prefix="/api/employees")

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
