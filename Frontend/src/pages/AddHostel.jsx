import axios from "axios";
import React, { useState } from "react";

const AddHostel = () => {
  const types = [
    { id: 1, name: "BOYS" },
    { id: 2, name: "GIRLS" },
    { id: 3, name: "MIXED" },
    { id: 4, name: "OTHER" },
  ];

  const [hostlForm, sethostlForm] = useState({
    name: "",
    type: "",
    capacity: "",
    students_residing: "",
  });

  const addHostel = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/hostels/", hostlForm);
      alert(`✅ ${res.data.message || "Hostel added successfully!"}`);
      sethostlForm({
        name: "",
        type: "",
        capacity: "",
        students_residing: "",
      });
    } catch (err) {
      if (err.response?.data?.error) {
        alert(`⚠️ ${err.response.data.error}`);
      } else {
        alert("❌ Something went wrong while adding hostel");
      }
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Add Hostel</h1>

      <form
        onSubmit={addHostel}
        className="bg-white p-6 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Hostel Name"
          value={hostlForm.name}
          onChange={(e) => sethostlForm({ ...hostlForm, name: e.target.value })}
          className="border p-2 rounded"
          required
        />

        <select
          value={hostlForm.type}
          onChange={(e) => sethostlForm({ ...hostlForm, type: e.target.value })}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Hostel Type</option>
          {types.map((t) => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Hostel Capacity"
          value={hostlForm.capacity}
          onChange={(e) =>
            sethostlForm({ ...hostlForm, capacity: e.target.value })
          }
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          placeholder="Students Residing"
          value={hostlForm.students_residing}
          onChange={(e) =>
            sethostlForm({ ...hostlForm, students_residing: e.target.value })
          }
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-700 text-white p-2 rounded hover:bg-blue-800 transition col-span-full"
        >
          Add Hostel
        </button>
      </form>
    </div>
  );
};

export default AddHostel;
