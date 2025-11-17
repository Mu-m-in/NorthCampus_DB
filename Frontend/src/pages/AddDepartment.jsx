import React, { useState, useEffect } from "react";
import axios from "axios";
import { Building2, BookOpen } from "lucide-react";

const AddDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [deptForm, setDeptForm] = useState({ name: "" });

  const [courseForm, setCourseForm] = useState({
    department_id: "",
    name: "",
    intake: "",
    gen_seats: "",
    obc_seats: "",
    sc_seats: "",
    st_seats: "",
    ews_seats: "",
    duration_years: "",
    exam_system: "",
    yearStart: "",
  });

  // Fetch departments
  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  // Add Department
  const addDepartment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/departments/", deptForm);
      setDepartments([...departments, res.data]);
      setDeptForm({ name: "" });
      alert("Department added successfully!");
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    }
  };

  // Add Course
  const addCourse = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/api/courses/", courseForm);
      setCourseForm({
        department_id: "",
        name: "",
        intake: "",
        gen_seats: "",
        obc_seats: "",
        sc_seats: "",
        st_seats: "",
        ews_seats: "",
        duration_years: "",
        exam_system: "",
        yearStart: "",
      });
      alert("Course added successfully!");
    } catch (err) {
      alert("Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* PAGE TITLE */}
      <div className="flex items-center gap-3 mb-8">
        <Building2 className="w-10 h-10 text-blue-700" />
        <h1 className="text-4xl font-bold text-gray-800">Departments & Courses</h1>
      </div>

      {/* ADD DEPARTMENT CARD */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Department</h2>

        <form onSubmit={addDepartment} className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Department Name</label>
            <input
              type="text"
              value={deptForm.name}
              onChange={(e) => setDeptForm({ name: e.target.value })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Add Department
            </button>
          </div>

        </form>
      </div>

      {/* ADD COURSE CARD */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-7 h-7 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">Add New Course</h2>
        </div>

        <form onSubmit={addCourse} className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* SELECT DEPARTMENT */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Department</label>
            <select
              value={courseForm.department_id}
              onChange={(e) =>
                setCourseForm({ ...courseForm, department_id: e.target.value })
              }
              className="border p-2 rounded-lg w-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* COURSE NAME */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Course Name</label>
            <input
              type="text"
              value={courseForm.name}
              onChange={(e) =>
                setCourseForm({ ...courseForm, name: e.target.value })
              }
              className="border p-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* INTAKE */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Intake</label>
            <input
              type="number"
              value={courseForm.intake}
              onChange={(e) =>
                setCourseForm({ ...courseForm, intake: e.target.value })
              }
              className="border p-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* SEAT FIELDS */}
          {[
            ["Gen Seats", "gen_seats"],
            ["OBC Seats", "obc_seats"],
            ["SC Seats", "sc_seats"],
            ["ST Seats", "st_seats"],
            ["EWS Seats", "ews_seats"],
            ["Duration (Years)", "duration_years"],
            ["Exam System", "exam_system"],
            ["Year Start", "yearStart"],
          ].map(([label, key]) => (
            <div key={key}>
              <label className="block text-gray-700 mb-1 font-medium">{label}</label>
              <input
                type={key === "exam_system" ? "text" : "number"}
                value={courseForm[key]}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, [key]: e.target.value })
                }
                className="border p-2 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}

          <div className="md:col-span-3">
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-lg"
            >
              Add Course
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
