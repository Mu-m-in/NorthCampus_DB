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

  // Fetch course list
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
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Add Final Year Examination Record
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white shadow p-6 rounded-lg"
      >
        {/* PROGRAM DROPDOWN */}
        <select
          name="program"
          value={form.program}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
        >
          <option value="">Select Program</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* OTHER INPUT FIELDS */}
        {Object.keys(form)
          .filter((key) => key !== "program")
          .map((key) => (
            <input
              key={key}
              name={key}
              value={form[key] || ""}
              onChange={handleChange}
              placeholder={key.replace(/_/g, " ").toUpperCase()}
              className="border p-2 rounded"
            />
          ))}

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Save Record
        </button>
      </form>
    </div>
  );
};

export default AddExamination;
