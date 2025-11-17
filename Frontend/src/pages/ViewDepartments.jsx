import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [deptFilter, setDeptFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  // Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(""); // department | course
  const [editData, setEditData] = useState({});

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

  // Open Modal
  const openEditModal = (data, type) => {
    setEditData(data);
    setEditingType(type);
    setEditModalOpen(true);
  };

  // Save Edited Data
  const handleSave = async () => {
    try {
      if (editingType === "department") {
        await axios.put(
          `http://127.0.0.1:5000/api/departments/`,
          editData
        );
      } else {
        await axios.put(
          `http://127.0.0.1:5000/api/courses/`,
          editData
        );
      }

      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to update!");
    }
  };

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
                <th className="p-3 text-center">Action</th>
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
                  <td className="p-3 text-center">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      onClick={() => openEditModal(dept, "department")}
                    >
                      Edit
                    </button>
                  </td>
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
                <th className="p-3 text-center">Action</th>
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
                    <td className="p-3 text-center">
                      {course.year_start ? course.year_start : "2003"}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        onClick={() => openEditModal(course, "course")}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== EDIT MODAL ===== */}
      {editModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-lg">

            <h2 className="text-xl font-semibold mb-4">
              Edit {editingType === "department" ? "Department" : "Course"}
            </h2>

            {/* Department Simple Form */}
            {editingType === "department" && (
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full border p-2 rounded-lg"
                />
              </div>
            )}

            {/* Course Multi-Column Form */}
            {editingType === "course" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                {Object.keys(editData).map((key) => (
                  key !== "id" &&
                  key !== "department_id" && (
                    <div key={key}>
                      <label className="block text-gray-700 text-sm capitalize mb-1">
                        {key.replace("_", " ")}
                      </label>
                      <input
                        type="text"
                        value={editData[key]}
                        onChange={(e) =>
                          setEditData({ ...editData, [key]: e.target.value })
                        }
                        className="border p-2 rounded-lg w-full"
                      />
                    </div>
                  )
                ))}

              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={handleSave}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ViewDepartments;
