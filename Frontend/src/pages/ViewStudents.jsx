import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewStudents = () => {
  const [students, setStudents] = useState([]);
  const [filterText, setFilterText] = useState("");

  const [filters, setFilters] = useState({
    gender: "",
    category: "",
    religion: "",
    handicapped: "",
  });

  const [editData, setEditData] = useState(null);

  // Fetch Students
  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/students");
      setStudents(res.data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter Students
  const filtered = students.filter((s) => {
    const searchMatch =
      s.name.toLowerCase().includes(filterText.toLowerCase()) ||
      s.department_name.toLowerCase().includes(filterText.toLowerCase()) ||
      s.course_name.toLowerCase().includes(filterText.toLowerCase());

    const genderMatch = filters.gender ? s.gender === filters.gender : true;
    const categoryMatch = filters.category ? s.category === filters.category : true;
    const religionMatch = filters.religion ? s.religion === filters.religion : true;

    const handicapMatch =
      filters.handicapped !== ""
        ? String(s.handicapped) === filters.handicapped
        : true;

    return searchMatch && genderMatch && categoryMatch && religionMatch && handicapMatch;
  });

  // Summary Counts
  const totalMale = filtered.filter((s) => s.gender === "Male").length;
  const totalFemale = filtered.filter((s) => s.gender === "Female").length;
  const totalOther = filtered.filter((s) => s.gender === "Other").length;
  const totalHandicapped = filtered.filter((s) => s.handicapped).length;

  // Category totals
  const totalGeneral = filtered.filter((s) => s.category === "GEN").length;
  const totalOBC = filtered.filter((s) => s.category === "OBC").length;
  const totalSC = filtered.filter((s) => s.category === "SC").length;
  const totalST = filtered.filter((s) => s.category === "ST").length;
  const totalEWS = filtered.filter((s) => s.category === "EWS").length;

  // Update student
  const updateStudent = async () => {
    try {
      await axios.put(
        `http://127.0.0.1:5000/api/students/`,
        editData
      );
      alert("Student updated successfully!");
      setEditData(null);
      fetchStudents();
    } catch (err) {
      alert("Failed to update");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        View Students
      </h1>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <input
          type="text"
          placeholder="Search by name, department, or course..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="border p-3 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <select
          className="border p-2 rounded-lg shadow-sm"
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <select
          className="border p-2 rounded-lg shadow-sm"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">Category</option>
          <option>GEN</option>
          <option>OBC</option>
          <option>SC</option>
          <option>ST</option>
          <option>EWS</option>
        </select>

        <select
          className="border p-2 rounded-lg shadow-sm"
          value={filters.religion}
          onChange={(e) => setFilters({ ...filters, religion: e.target.value })}
        >
          <option value="">Religion</option>
          <option>Muslim</option>
          <option>Hindu</option>
          <option>Sikhism</option>
          <option>Christian</option>
          <option>Other</option>
        </select>

        <select
          className="border p-2 rounded-lg shadow-sm"
          value={filters.handicapped}
          onChange={(e) =>
            setFilters({ ...filters, handicapped: e.target.value })
          }
        >
          <option value="">Handicapped</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

      </div>

      {/* Summary Cards */}
      <h2 className="text-xl font-bold mb-2 text-gray-700">Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md font-semibold">Male: {totalMale}</div>
        <div className="bg-white p-4 rounded-lg shadow-md font-semibold">Female: {totalFemale}</div>
        <div className="bg-white p-4 rounded-lg shadow-md font-semibold">Other: {totalOther}</div>
        <div className="bg-white p-4 rounded-lg shadow-md font-semibold">Handicapped: {totalHandicapped}</div>
        <div className="bg-white p-4 rounded-lg shadow-md font-semibold">Total: {filtered.length}</div>
      </div>

      {/* Category Breakdown */}
      <h2 className="text-xl font-bold mb-2 text-gray-700">Category Breakdown</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md font-semibold">GEN: {totalGeneral}</div>
        <div className="bg-white p-4 rounded-lg shadow-md font-semibold">OBC: {totalOBC}</div>
        <div className="bg-white p-4 rounded-lg shadow-md font-semibold">SC: {totalSC}</div>
        <div className="bg-white p-4 rounded-lg shadow-md font-semibold">ST: {totalST}</div>
        <div className="bg-white p-4 rounded-lg shadow-md font-semibold">EWS: {totalEWS}</div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-xl">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2">Roll No</th>
              <th className="p-2">Name</th>
              <th className="p-2">Department</th>
              <th className="p-2">Course</th>
              <th className="p-2">Category</th>
              <th className="p-2">Gender</th>
              <th className="p-2">Religion</th>
              <th className="p-2">Handicapped</th>
              <th className="p-2">Year</th>
              <th className="p-2">Edit</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b hover:bg-gray-100 transition">
                <td className="p-2 text-center">{s.roll_number}</td>
                <td className="p-2 text-center">{s.name}</td>
                <td className="p-2 text-center">{s.department_name}</td>
                <td className="p-2 text-center">{s.course_name}</td>
                <td className="p-2 text-center">{s.category}</td>
                <td className="p-2 text-center">{s.gender}</td>
                <td className="p-2 text-center">{s.religion}</td>
                <td className="p-2 text-center">{s.handicapped ? "Yes" : "No"}</td>
                <td className="p-2 text-center">{s.year_of_admission}</td>
                <td className="p-2 text-center">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-700"
                    onClick={() => setEditData(s)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* EDIT MODAL */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[420px] p-6">

            <h2 className="text-xl font-bold text-blue-700 mb-4">Edit Student</h2>

            <div className="space-y-4">

              <input
                type="text"
                className="border p-2 rounded-lg w-full"
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                placeholder="Name"
              />

              <input
                type="text"
                className="border p-2 rounded-lg w-full"
                value={editData.roll_number}
                onChange={(e) =>
                  setEditData({ ...editData, roll_number: e.target.value })
                }
                placeholder="Roll Number"
              />

              <select
                className="border p-2 rounded-lg w-full"
                value={editData.gender}
                onChange={(e) =>
                  setEditData({ ...editData, gender: e.target.value })
                }
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

              <select
                className="border p-2 rounded-lg w-full"
                value={editData.category}
                onChange={(e) =>
                  setEditData({ ...editData, category: e.target.value })
                }
              >
                <option>GEN</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
                <option>EWS</option>
              </select>

              <select
                className="border p-2 rounded-lg w-full"
                value={editData.religion}
                onChange={(e) =>
                  setEditData({ ...editData, religion: e.target.value })
                }
              >
                <option>Muslim</option>
                <option>Hindu</option>
                <option>Sikhism</option>
                <option>Christian</option>
                <option>Other</option>
              </select>

              <select
                className="border p-2 rounded-lg w-full"
                value={editData.handicapped ? "true" : "false"}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    handicapped: e.target.value === "true",
                  })
                }
              >
                <option value="false">Not Handicapped</option>
                <option value="true">Handicapped</option>
              </select>

            </div>

            <div className="flex gap-3 mt-6">
              <button
                className="bg-blue-600 text-white p-2 w-full rounded-lg hover:bg-blue-700"
                onClick={updateStudent}
              >
                Save
              </button>

              <button
                className="bg-gray-400 p-2 w-full rounded-lg hover:bg-gray-500"
                onClick={() => setEditData(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ViewStudents;
