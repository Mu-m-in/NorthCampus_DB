import React, { useState } from "react";

export default function Students({ departments = [], courses = [] }) {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      departmentId: 1,
      courseId: 1,
      rollNumber: "BTech-CS-001",
      category: "GEN",
      yearOfAdmission: 2022,
    },
    {
      id: 2,
      name: "Bob Smith",
      departmentId: 1,
      courseId: 2,
      rollNumber: "BTech-ECE-002",
      category: "OBC",
      yearOfAdmission: 2021,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    departmentId: "",
    courseId: "",
    rollNumber: "",
    category: "GEN",
    yearOfAdmission: "",
  });

  const [filter, setFilter] = useState("");

  // Form change handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add student
  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.departmentId || !formData.courseId) return; // Safety check

    setStudents([
      ...students,
      {
        id: Date.now(),
        name: formData.name,
        rollNumber: formData.rollNumber,
        departmentId: Number(formData.departmentId),
        courseId: Number(formData.courseId),
        category: formData.category,
        yearOfAdmission: Number(formData.yearOfAdmission),
      },
    ]);

    setFormData({
      name: "",
      departmentId: "",
      courseId: "",
      rollNumber: "",
      category: "GEN",
      yearOfAdmission: "",
    });
  };

  // Filtered students
  const filteredStudents = students.filter((s) => {
    const deptName =
      departments.find((d) => d.id === Number(s.departmentId))?.name || "";
    const courseName =
      courses.find((c) => c.id === Number(s.courseId))?.name || "";
    return (
      s.name.toLowerCase().includes(filter.toLowerCase()) ||
      deptName.toLowerCase().includes(filter.toLowerCase()) ||
      courseName.toLowerCase().includes(filter.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Students</h1>

      {/* Form */}
      <form
        onSubmit={handleAdd}
        className="bg-white p-6 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Student Name"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="rollNumber"
          value={formData.rollNumber}
          onChange={handleChange}
          placeholder="Roll Number"
          className="border p-2 rounded"
          required
        />
        <select
          name="departmentId"
          value={formData.departmentId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
        <select
          name="courseId"
          value={formData.courseId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Course</option>
          {courses
            .filter((c) => c.deptId === Number(formData.departmentId))
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="GEN">GEN</option>
          <option value="OBC">OBC</option>
          <option value="SC">SC</option>
          <option value="ST">ST</option>
        </select>
        <input
          type="number"
          name="yearOfAdmission"
          value={formData.yearOfAdmission}
          onChange={handleChange}
          placeholder="Year of Admission"
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="md:col-span-3 bg-green-600 text-white p-2 rounded hover:bg-green-700 transition"
        >
          Add Student
        </button>
      </form>

      {/* Filter */}
      <input
        type="text"
        placeholder="Filter by name, department, or course..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border p-2 rounded mb-4 w-full md:w-1/3"
      />

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2">Roll Number</th>
              <th className="p-2">Name</th>
              <th className="p-2">Department</th>
              <th className="p-2">Course</th>
              <th className="p-2">Category</th>
              <th className="p-2">Year of Admission</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s) => {
              const dept =
                departments.find((d) => d.id === Number(s.departmentId)) || {};
              const course =
                courses.find((c) => c.id === Number(s.courseId)) || {};
              return (
                <tr key={s.id} className="border-b hover:bg-gray-100 transition">
                  <td className="p-2">{s.rollNumber}</td>
                  <td className="p-2">{s.name}</td>
                  <td className="p-2">{dept.name || "Unknown"}</td>
                  <td className="p-2">{course.name || "Unknown"}</td>
                  <td className="p-2">{s.category}</td>
                  <td className="p-2">{s.yearOfAdmission}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
