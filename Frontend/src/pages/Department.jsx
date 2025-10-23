import React, { useState } from "react";

export default function Department() {
  const [departments, setDepartments] = useState([
    { id: 1, name: "BTech" },
    { id: 2, name: "Business Studies" },
  ]);

  const [courses, setCourses] = useState([
    { id: 1, deptId: 1, name: "CSE", intake: 120, gen: 50, obc: 40, sc: 20, st: 10, duration: "4 Years", examSystem: "Semester", yearStart: 2015 },
    { id: 2, deptId: 1, name: "ECE", intake: 100, gen: 40, obc: 30, sc: 20, st: 10, duration: "4 Years", examSystem: "Semester", yearStart: 2015 },
    { id: 3, deptId: 2, name: "IMBA", intake: 60, gen: 30, obc: 20, sc: 5, st: 5, duration: "2 Years", examSystem: "Semester", yearStart: 2018 },
  ]);

  const [deptForm, setDeptForm] = useState({ name: "" });
  const [courseForm, setCourseForm] = useState({
    deptId: "",
    name: "",
    intake: "",
    gen: "",
    obc: "",
    sc: "",
    st: "",
    duration: "",
    examSystem: "",
    yearStart: "",
  });

  const [deptFilter, setDeptFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  // Handlers
  const addDepartment = (e) => {
    e.preventDefault();
    const newDept = { id: Date.now(), ...deptForm };
    setDepartments([...departments, newDept]);
    setDeptForm({ name: "" });
  };

  const addCourse = (e) => {
    e.preventDefault();
    const newCourse = { id: Date.now(), ...courseForm };
    setCourses([...courses, newCourse]);
    setCourseForm({
      deptId: "",
      name: "",
      intake: "",
      gen: "",
      obc: "",
      sc: "",
      st: "",
      duration: "",
      examSystem: "",
      yearStart: "",
    });
  };

  // Filters
  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(deptFilter.toLowerCase())
  );

  const filteredCourses = courses.filter((c) =>
    c.name.toLowerCase().includes(courseFilter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Departments & Courses</h1>

      {/* Add Department Form */}
      <form
        onSubmit={addDepartment}
        className="bg-white p-6 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Department Name"
          value={deptForm.name}
          onChange={(e) => setDeptForm({ name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-700 text-white p-2 rounded hover:bg-blue-800 transition"
        >
          Add Department
        </button>
      </form>

      {/* Add Course Form */}
      <form
        onSubmit={addCourse}
        className="bg-white p-6 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <select
          name="deptId"
          value={courseForm.deptId}
          onChange={(e) => setCourseForm({ ...courseForm, deptId: e.target.value })}
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
        <input
          type="text"
          name="name"
          value={courseForm.name}
          onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
          placeholder="Course Name"
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="intake"
          value={courseForm.intake}
          onChange={(e) => setCourseForm({ ...courseForm, intake: e.target.value })}
          placeholder="Intake"
          className="border p-2 rounded"
        />
        <input type="number" name="gen" value={courseForm.gen} onChange={(e) => setCourseForm({ ...courseForm, gen: e.target.value })} placeholder="Gen" className="border p-2 rounded" />
        <input type="number" name="obc" value={courseForm.obc} onChange={(e) => setCourseForm({ ...courseForm, obc: e.target.value })} placeholder="OBC" className="border p-2 rounded" />
        <input type="number" name="sc" value={courseForm.sc} onChange={(e) => setCourseForm({ ...courseForm, sc: e.target.value })} placeholder="SC" className="border p-2 rounded" />
        <input type="number" name="st" value={courseForm.st} onChange={(e) => setCourseForm({ ...courseForm, st: e.target.value })} placeholder="ST" className="border p-2 rounded" />
        <input type="text" name="duration" value={courseForm.duration} onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })} placeholder="Duration" className="border p-2 rounded" />
        <input type="text" name="examSystem" value={courseForm.examSystem} onChange={(e) => setCourseForm({ ...courseForm, examSystem: e.target.value })} placeholder="Exam System" className="border p-2 rounded" />
        <input type="number" name="yearStart" value={courseForm.yearStart} onChange={(e) => setCourseForm({ ...courseForm, yearStart: e.target.value })} placeholder="Year Start" className="border p-2 rounded" />
        <button type="submit" className="md:col-span-3 bg-green-600 text-white p-2 rounded hover:bg-green-700 transition">
          Add Course
        </button>
      </form>

      {/* Department Filter */}
      <input
        type="text"
        placeholder="Filter Departments..."
        value={deptFilter}
        onChange={(e) => setDeptFilter(e.target.value)}
        className="border p-2 rounded mb-4 w-full md:w-1/3"
      />

      {/* Departments Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl mb-6">
        <h2 className="text-xl font-bold p-4 border-b">Departments</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Department Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.map((dept) => (
              <tr key={dept.id} className="border-b hover:bg-gray-100 transition">
                <td className="p-2">{dept.id}</td>
                <td className="p-2">{dept.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Course Filter */}
      <input
        type="text"
        placeholder="Filter Courses..."
        value={courseFilter}
        onChange={(e) => setCourseFilter(e.target.value)}
        className="border p-2 rounded mb-4 w-full md:w-1/3"
      />

      {/* Courses Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <h2 className="text-xl font-bold p-4 border-b">Courses</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2">Department</th>
              <th className="p-2">Course Name</th>
              <th className="p-2">Intake</th>
              <th className="p-2">Gen</th>
              <th className="p-2">OBC</th>
              <th className="p-2">SC</th>
              <th className="p-2">ST</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Exam System</th>
              <th className="p-2">Year Start</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => {
              const dept = departments.find((d) => d.id === Number(course.deptId));
              return (
                <tr key={course.id} className="border-b hover:bg-gray-100 transition">
                  <td className="p-2">{dept ? dept.name : "Unknown"}</td>
                  <td className="p-2">{course.name}</td>
                  <td className="p-2">{course.intake}</td>
                  <td className="p-2">{course.gen}</td>
                  <td className="p-2">{course.obc}</td>
                  <td className="p-2">{course.sc}</td>
                  <td className="p-2">{course.st}</td>
                  <td className="p-2">{course.duration}</td>
                  <td className="p-2">{course.examSystem}</td>
                  <td className="p-2">{course.yearStart}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
