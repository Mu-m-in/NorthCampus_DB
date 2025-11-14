import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewPlacement = () => {
  const [placements, setPlacements] = useState([]);
  const [courseFilter, setCourseFilter] = useState("");

  // Fetch Placements on load
  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/api/placements/");
        setPlacements(res.data);
      } catch (err) {
        console.error("Error fetching placements:", err);
        if(err.response && err.response.data && err.response.data.error) {
          console.error(err.response.data.error);
          alert(`⚠️ ${err.response.data.error}`);
        }
      }
    };
    fetchPlacements();
  }, []);

  // Filter placements by course name (case-insensitive)
  const filteredPlacements = placements.filter((p) =>
    (p.course_name || "").toLowerCase().includes(courseFilter.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Course Filter */}
      <input
        type="text"
        placeholder="Filter Placements..."
        value={courseFilter}
        onChange={(e) => setCourseFilter(e.target.value)}
        className="border p-2 rounded mb-4 w-full md:w-1/3"
      />

      {/* Placements Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <h2 className="text-xl font-bold p-4 border-b">Placements</h2>
        <table className="min-w-full table-auto">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-2">Course Name</th>
              <th className="p-2">Total Students Appeared</th>
              <th className="p-2">Total Students Placed</th>
              <th className="p-2">Median Salary</th>
              <th className="p-2">Average Salary</th>
              <th className="p-2">Male</th>
              <th className="p-2">Female</th>
              <th className="p-2">Other</th>
              <th className="p-2">Year of Placement</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlacements.length > 0 ? (
              filteredPlacements.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-100 transition">
                  <td className="p-2 text-center">{p.name || "Unknown"}</td>
                  <td className="p-2 text-center">{p.total_students}</td>
                  <td className="p-2 text-center">{p.total_placed}</td>
                  <td className="p-2 text-center">{p.median_salary}</td>
                  <td className="p-2 text-center">{p.average_salary}</td>
                  <td className="p-2 text-center">{p.male}</td>
                  <td className="p-2 text-center">{p.female}</td>
                  <td className="p-2 text-center">{p.other}</td>
                  <td className="p-2 text-center">{p.year}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="p-4 text-center text-gray-500">
                  No placements found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPlacement;
