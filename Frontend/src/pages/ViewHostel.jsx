import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewHostels = () => {
  const [hostels, setHostels] = useState([]);
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Fetch hostels
  const fetchHostels = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/api/hostels/");
      setHostels(res.data);
    } catch (err) {
      console.error("Error fetching hostels:", err);
      alert("❌ Failed to fetch hostel data.");
    }
  };

  useEffect(() => {
    fetchHostels();
  }, []);

  // Filter logic
  const filteredHostels = hostels.filter((h) => {
    const matchesName = h.name.toLowerCase().includes(filter.toLowerCase());
    const matchesType =
      typeFilter === "" || h.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesName && matchesType;
  });

  const hostelTypes = ["BOYS", "GIRLS", "MIXED", "OTHER"];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Hostels</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by hostel name..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="">All Types</option>
          {hostelTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="min-w-full table-auto">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Hostel Name</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Capacity</th>
              <th className="p-2 text-left">Students Residing</th>
              <th className="p-2 text-left">Vacant Seats</th>
            </tr>
          </thead>
          <tbody>
            {filteredHostels.map((h, index) => (
              <tr
                key={h.id}
                className="border-b hover:bg-gray-100 transition text-gray-800"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2 font-medium">{h.name}</td>
                <td className="p-2">{h.type}</td>
                <td className="p-2">{h.capacity}</td>
                <td className="p-2">{h.students_residing}</td>
                <td className="p-2">
                  {h.capacity - h.students_residing >= 0
                    ? h.capacity - h.students_residing
                    : 0}
                </td>
              </tr>
            ))}
            {filteredHostels.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No hostels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewHostels;
