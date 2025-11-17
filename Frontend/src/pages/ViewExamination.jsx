import axios from "axios";
import React, { useEffect, useState } from "react";

const ViewExamination = () => {
  const [year, setYear] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/examinations/report${year ? `?year=${year}` : ""}`
      );
      setData(res.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReport();
  }, [year]);

  // Summary
  const totalAppeared = data.reduce((a, b) => a + (b.total_students_appeared || 0), 0);
  const totalPassed = data.reduce((a, b) => a + (b.total_students_passed || 0), 0);
  const totalMale = data.reduce((a, b) => a + (b.male || 0), 0);
  const totalFemale = data.reduce((a, b) => a + (b.female || 0), 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Final Year Examination Report
      </h1>

      {/* FILTER + SUMMARY SECTION */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">

        {/* FILTERS */}
        <div className="flex items-center gap-4 mb-6">
          <label className="font-medium text-gray-700">Filter by Year:</label>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg shadow-sm"
          >
            <option value="">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>

          <button
            onClick={() => setYear("")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Reset
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Appeared</p>
            <p className="text-2xl font-bold text-blue-700">{totalAppeared}</p>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Passed</p>
            <p className="text-2xl font-bold text-green-700">{totalPassed}</p>
          </div>

          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Male</p>
            <p className="text-2xl font-bold text-purple-700">{totalMale}</p>
          </div>

          <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Female</p>
            <p className="text-2xl font-bold text-pink-700">{totalFemale}</p>
          </div>

        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">

        <table className="min-w-full table-auto">
          <thead className="bg-blue-600 text-white text-sm">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Course</th>
              <th className="p-3">Appeared</th>
              <th className="p-3">Passed</th>
              <th className="p-3">GEN</th>
              <th className="p-3">SC</th>
              <th className="p-3">ST</th>
              <th className="p-3">OBC</th>
              <th className="p-3">EWS</th>
              <th className="p-3">Male</th>
              <th className="p-3">Female</th>
              <th className="p-3">Other</th>
              <th className="p-3">Year</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center py-6">
                  No Records Found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b hover:bg-gray-100 transition">
                  <td className="p-3 text-center">{row.id}</td>
                  <td className="p-3 text-center">{row.name}</td>
                  <td className="p-3 text-center">{row.total_students_appeared}</td>
                  <td className="p-3 text-center">{row.total_students_passed}</td>
                  <td className="p-3 text-center">{row.general}</td>
                  <td className="p-3 text-center">{row.sc}</td>
                  <td className="p-3 text-center">{row.st}</td>
                  <td className="p-3 text-center">{row.obc}</td>
                  <td className="p-3 text-center">{row.ews}</td>
                  <td className="p-3 text-center">{row.male}</td>
                  <td className="p-3 text-center">{row.female}</td>
                  <td className="p-3 text-center">{row.other}</td>
                  <td className="p-3 text-center">{row.year}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default ViewExamination;
