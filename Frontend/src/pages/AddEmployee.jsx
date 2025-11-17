import { useState } from "react";
import axios from "axios";

export default function AddEmployee() {
  const [formData, setFormData] = useState({
    name: "",
    employee_type: "",        // Teaching / Non-Teaching
    employment_type: "",      // Contractual / Permanent
    group_type: "",
    category_minority: "",
    category_other: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/employees/",
        formData
      );

      if (res.status === 201 || res.status === 200) {
        alert("Employee added successfully!");

        // RESET FORM CORRECTLY
        setFormData({
          name: "",
          employee_type: "",
          employment_type: "",
          group_type: "",
          category_minority: "",
          category_other: "",
          gender: "",
        });
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save employee.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-5 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-6">Add Employee</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div>
          <label className="font-semibold">Employee Name</label>
          <input
            type="text"
            name="name"
            className="w-full border p-2 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Teaching / Non-Teaching */}
        <div>
          <label className="font-semibold">Employee Type</label>
          <select
            name="employee_type"
            className="w-full border p-2 rounded"
            value={formData.employee_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="Teaching">Teaching</option>
            <option value="Non-Teaching">Non-Teaching</option>
          </select>
        </div>

        {/* Employment Type */}
        <div>
          <label className="font-semibold">Employment Type</label>
          <select
            name="employment_type"
            className="w-full border p-2 rounded"
            value={formData.employment_type}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Contractual">Contractual</option>
            <option value="Permanent">Permanent</option>
          </select>
        </div>

        {/* Group */}
        <div>
          <label className="font-semibold">Group</label>
          <select
            name="group_type"
            className="w-full border p-2 rounded"
            value={formData.group_type}
            onChange={handleChange}
          >
            <option value="">Select Group</option>
            <option value="A">Group A</option>
            <option value="B">Group B</option>
            <option value="C">Group C</option>
          </select>
        </div>

        {/* Minority Category */}
        <div>
          <label className="font-semibold">Minority Category</label>
          <select
            name="category_minority"
            className="w-full border p-2 rounded"
            value={formData.category_minority}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="PWD">PWD</option>
            <option value="Muslim Minority">Muslim Minority</option>
            <option value="Other Minority">Other Minority</option>
          </select>
        </div>

        {/* Other Category */}
        <div>
          <label className="font-semibold">Other Category</label>
          <select
            name="category_other"
            className="w-full border p-2 rounded"
            value={formData.category_other}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="General">General</option>
            <option value="EWS">EWS</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OBC">OBC</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="font-semibold">Gender</label>
          <select
            name="gender"
            className="w-full border p-2 rounded"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Submit */}
        <button className="bg-blue-600 text-white p-2 rounded w-full">
          Save Employee
        </button>

      </form>
    </div>
  );
}
