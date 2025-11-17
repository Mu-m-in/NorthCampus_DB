import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [deptFilter, setDeptFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, courseRes] = await Promise.all([
          axios.get("http://127.0.0.1:5000/api/departments"),
          axios.get("http://127.0.0.1:5000/api/courses"),
        ]);

        setDepartments(deptRes.data);
        setCourses(courseRes.data);
      } catch (err) {
        console.error("Error fetching:", err);
        alert("Failed to load departments or courses");
      }
    };
    fetchData();
  }, []);

  // Filters
  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(deptFilter.toLowerCase())
  );

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(courseFilter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Departments & Courses
      </h1>

      {/* ---- DEPARTMENTS SECTION ---- */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Departments</h2>

          <input
            type="text"
            placeholder="Search departments..."
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg mt-4 md:mt-0 w-full md:w-64 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Department Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((dept) => (
                <tr
                  key={dept.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3">{dept.id}</td>
                  <td className="p-3">{dept.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- COURSES SECTION ---- */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Courses</h2>

          <input
            type="text"
            placeholder="Search courses..."
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg mt-4 md:mt-0 w-full md:w-64 focus:ring-2 focus:ring-green-600"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Course Name</th>
                <th className="p-3 text-center">Intake</th>
                <th className="p-3 text-center">Gen</th>
                <th className="p-3 text-center">OBC</th>
                <th className="p-3 text-center">SC</th>
                <th className="p-3 text-center">ST</th>
                <th className="p-3 text-center">Duration</th>
                <th className="p-3 text-center">Exam System</th>
                <th className="p-3 text-center">Year Start</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourses.map((course) => {
                const dept = departments.find(
                  (d) => d.id === Number(course.department_id)
                );

                return (
                  <tr
                    key={course.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-3">{dept ? dept.name : "Unknown"}</td>
                    <td className="p-3">{course.name}</td>
                    <td className="p-3 text-center">{course.intake}</td>
                    <td className="p-3 text-center">{course.gen_seats}</td>
                    <td className="p-3 text-center">{course.obc_seats}</td>
                    <td className="p-3 text-center">{course.sc_seats}</td>
                    <td className="p-3 text-center">{course.st_seats}</td>
                    <td className="p-3 text-center">{course.duration_years}</td>
                    <td className="p-3 text-center">{course.exam_system}</td>
                    <td className="p-3 text-center">{course.year_start ? course.year_start : "2003"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ViewDepartments;
