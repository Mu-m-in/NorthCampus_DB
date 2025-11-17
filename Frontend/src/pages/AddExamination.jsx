import axios from "axios";
import React, { useState, useEffect } from "react";

const AddExamination = () => {
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    program: "",
    total_students_appeared: "",
    total_students_passed: "",
    general: "",
    sc: "",
    st: "",
    obc: "",
    ews: "",
    male: "",
    female: "",
    other: "",
    year: "",
  });

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses/");
        setCourses(res.data);
      } catch (error) {
        console.error("Error loading courses", error);
      }
    };
    loadCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/examinations/",
        form
      );
      alert(res.data.message);
    } catch (err) {
      alert("Error: " + err.response?.data?.error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Add Final Year Examination Record
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-6 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Program Dropdown */}
        <div className="col-span-2">
          <label className="font-semibold text-gray-700">Program</label>
          <select
            name="program"
            value={form.program}
            onChange={handleChange}
            className="border p-2 rounded w-full mt-1"
          >
            <option value="">Select Program</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Two-column balanced fields */}
        {[
          "total_students_appeared",
          "total_students_passed",
          "general",
          "sc",
          "st",
          "obc",
          "ews",
          "male",
          "female",
          "other",
          "year",
        ].map((key) => (
          <div className="flex flex-col" key={key}>
            <label className="font-semibold text-gray-700">
              {key.replace(/_/g, " ").toUpperCase()}
            </label>
            <input
              name={key}
              value={form[key]}
              onChange={handleChange}
              className="border p-2 rounded mt-1"
              placeholder={`Enter ${key.replace(/_/g, " ")}`}
            />
          </div>
        ))}

        <div className="col-span-2">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded-lg w-full hover:bg-blue-700 transition"
          >
            Save Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddExamination;
