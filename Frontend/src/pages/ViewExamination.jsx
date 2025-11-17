import axios from 'axios';
import React, { useEffect, useState } from 'react'

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Final Year Examination Report</h1>

      {/* FILTER SECTION */}
      <div className="mb-6 flex items-center gap-4">
        <label className="font-medium">Select Year:</label>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Years</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Course ID</th>
              <th className="border px-3 py-2">Total Appeared</th>
              <th className="border px-3 py-2">Total Passed</th>
              <th className="border px-3 py-2">General</th>
              <th className="border px-3 py-2">SC</th>
              <th className="border px-3 py-2">ST</th>
              <th className="border px-3 py-2">OBC</th>
              <th className="border px-3 py-2">EWS</th>
              <th className="border px-3 py-2">Male</th>
              <th className="border px-3 py-2">Female</th>
              <th className="border px-3 py-2">Other</th>
              <th className="border px-3 py-2">Year</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="13" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center py-4">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{row.id}</td>
                  <td className="border px-3 py-2">{row.course_id}</td>
                  <td className="border px-3 py-2">{row.total_students_appeared}</td>
                  <td className="border px-3 py-2">{row.total_students_passed}</td>
                  <td className="border px-3 py-2">{row.general}</td>
                  <td className="border px-3 py-2">{row.sc}</td>
                  <td className="border px-3 py-2">{row.st}</td>
                  <td className="border px-3 py-2">{row.obc}</td>
                  <td className="border px-3 py-2">{row.ews}</td>
                  <td className="border px-3 py-2">{row.male}</td>
                  <td className="border px-3 py-2">{row.female}</td>
                  <td className="border px-3 py-2">{row.other}</td>
                  <td className="border px-3 py-2">{row.year}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewExamination