import { useEffect, useState } from "react";

export default function ViewEmployee() {
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [filters, setFilters] = useState({
    employee_type: "",
    gender: "",
    category_minority: "",
    category_other: "",
    group_type: "",
    employment_type: "",
  });

  const [editData, setEditData] = useState(null);

  // Fetch employees
  const fetchEmployees = async () => {
    const res = await fetch("http://localhost:5000/api/employees");
    const data = await res.json();
    setEmployees(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...employees];

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== "") {
        result = result.filter((e) => e[key] === filters[key]);
      }
    });

    setFiltered(result);
  }, [filters, employees]);

  const teaching = filtered.filter((e) => e.employee_type === "teaching");
  const nonTeaching = filtered.filter((e) => e.employee_type === "non-teaching");

  const totalMale = filtered.filter((e) => e.gender === "Male").length;
  const totalFemale = filtered.filter((e) => e.gender === "Female").length;
  const totalOther = filtered.filter((e) => e.gender === "Other").length;

  const updateEmployee = async () => {
    const res = await fetch(
      `http://localhost:5000/api/employees/${editData.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      }
    );

    if (res.ok) {
      alert("Employee Updated Successfully");
      setEditData(null);
      fetchEmployees();
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">Employee Records</h1>

      {/* FILTERS */}
      <div className="bg-white shadow p-5 rounded mb-8">
        <h2 className="text-lg font-semibold mb-3">Filters</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          <select name="employee_type" className="p-2 border rounded" onChange={handleFilterChange}>
            <option value="">Employee Type</option>
            <option value="Teaching">Teaching</option>
            <option value="Non-Teaching">Non-Teaching</option>
          </select>

          <select name="gender" className="p-2 border rounded" onChange={handleFilterChange}>
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select name="category_minority" className="p-2 border rounded" onChange={handleFilterChange}>
            <option value="">Minority Category</option>
            <option value="PWD">PWD</option>
            <option value="Muslim Minority">Muslim Minority</option>
            <option value="Other Minority">Other Minority</option>
          </select>

          <select name="category_other" className="p-2 border rounded" onChange={handleFilterChange}>
            <option value="">Other Category</option>
            <option value="General">General</option>
            <option value="EWS">EWS</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
          </select>

          <select name="group_type" className="p-2 border rounded" onChange={handleFilterChange}>
            <option value="">Group</option>
            <option value="A">Group A</option>
            <option value="B">Group B</option>
            <option value="C">Group C</option>
          </select>

          <select name="employment_type" className="p-2 border rounded" onChange={handleFilterChange}>
            <option value="">Employment Type</option>
            <option value="Contractual">Contractual</option>
            <option value="Permanent">Permanent</option>
          </select>

        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow font-semibold">Teaching: {teaching.length}</div>
        <div className="bg-yellow-100 p-4 rounded shadow font-semibold">Non-Teaching: {nonTeaching.length}</div>
        <div className="bg-gray-100 p-4 rounded shadow font-semibold">Male: {totalMale}</div>
        <div className="bg-gray-100 p-4 rounded shadow font-semibold">Female: {totalFemale}</div>
        <div className="bg-gray-100 p-4 rounded shadow font-semibold">Other: {totalOther}</div>
        <div className="bg-green-100 p-4 rounded shadow font-semibold">Total: {filtered.length}</div>
      </div>

      {/* TEACHING TABLE */}
      <h2 className="text-xl font-bold mb-2">Teaching Employees</h2>
      <table className="w-full border mb-10">
        <thead className="bg-blue-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Employment</th>
            <th className="border p-2">Group</th>
            <th className="border p-2">Minority</th>
            <th className="border p-2">Other Category</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2 text-center">Edit</th>
          </tr>
        </thead>
        <tbody>
          {teaching.map((e) => (
            <tr key={e.id}>
              <td className="border p-2">{e.name}</td>
              <td className="border p-2">{e.employment_type}</td>
              <td className="border p-2">{e.group_type}</td>
              <td className="border p-2">{e.category_minority}</td>
              <td className="border p-2">{e.category_other}</td>
              <td className="border p-2">{e.gender}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => setEditData(e)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* NON-TEACHING TABLE */}
      <h2 className="text-xl font-bold mb-2">Non-Teaching Employees</h2>
      <table className="w-full border">
        <thead className="bg-yellow-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Employment</th>
            <th className="border p-2">Group</th>
            <th className="border p-2">Minority</th>
            <th className="border p-2">Other Category</th>
            <th className="border p-2">Gender</th>
            <th className="border p-2 text-center">Edit</th>
          </tr>
        </thead>
        <tbody>
          {nonTeaching.map((e) => (
            <tr key={e.id}>
              <td className="border p-2">{e.name}</td>
              <td className="border p-2">{e.employment_type}</td>
              <td className="border p-2">{e.group_type}</td>
              <td className="border p-2">{e.category_minority}</td>
              <td className="border p-2">{e.category_other}</td>
              <td className="border p-2">{e.gender}</td>
              <td className="border p-2 text-center">
                <button
                  onClick={() => setEditData(e)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT MODAL */}
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 w-96 rounded shadow-lg">

            <h2 className="text-xl font-bold mb-4">Edit Employee</h2>

            <div className="space-y-3">

              <input
                className="w-full p-2 border rounded"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />

              <select
                className="w-full p-2 border rounded"
                value={editData.employee_type}
                onChange={(e) => setEditData({ ...editData, employee_type: e.target.value })}
              >
                <option value="">Employee Type</option>
                <option value="Teaching">Teaching</option>
                <option value="Non-Teaching">Non-Teaching</option>
              </select>

              <select
                className="w-full p-2 border rounded"
                value={editData.employment_type}
                onChange={(e) => setEditData({ ...editData, employment_type: e.target.value })}
              >
                <option value="">Employment Type</option>
                <option value="Contractual">Contractual</option>
                <option value="Permanent">Permanent</option>
              </select>

              <select
                className="w-full p-2 border rounded"
                value={editData.group_type}
                onChange={(e) => setEditData({ ...editData, group_type: e.target.value })}
              >
                <option value="">Group</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>

              <select
                className="w-full p-2 border rounded"
                value={editData.category_minority}
                onChange={(e) => setEditData({ ...editData, category_minority: e.target.value })}
              >
                <option value="">Minority</option>
                <option value="PWD">PWD</option>
                <option value="Muslim Minority">Muslim Minority</option>
                <option value="Other Minority">Other Minority</option>
              </select>

              <select
                className="w-full p-2 border rounded"
                value={editData.category_other}
                onChange={(e) => setEditData({ ...editData, category_other: e.target.value })}
              >
                <option value="">Category</option>
                <option value="General">General</option>
                <option value="EWS">EWS</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
              </select>

              <select
                className="w-full p-2 border rounded"
                value={editData.gender}
                onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
              >
                <option value="">Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={updateEmployee} className="bg-blue-600 text-white p-2 w-full rounded">Save</button>
              <button onClick={() => setEditData(null)} className="bg-gray-400 p-2 w-full rounded">Close</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
