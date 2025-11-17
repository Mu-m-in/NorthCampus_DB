import React, { useState, useEffect } from "react";
import axios from "axios";
import { GraduationCap, UserPlus, IdCard, BookOpen, Users } from "lucide-react";

const AddStudents = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    roll_number: "",
    department_id: "",
    course_id: "",
    category: "GEN",
    gender: "Male",
    handicapped: 0,
    religion: "",
    year_of_admission: "",
    residence_type: "",
  });

  // Fetch departments & courses
  useEffect(() => {
    axios.get("http://localhost:5000/api/departments")
      .then((res) => setDepartments(res.data));

    axios.get("http://localhost:5000/api/courses")
      .then((res) => setCourses(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/students/", formData);
      alert(res.data.message);

      setFormData({
        name: "",
        roll_number: "",
        department_id: "",
        course_id: "",
        category: "GEN",
        gender: "Male",
        handicapped: 0,
        religion: "",
        year_of_admission: "",
        residence_type: "",
      });
    } catch (err) {
      alert(err.response?.data?.error || "Error adding student");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 rounded-xl">
          <GraduationCap className="text-blue-600" size={28} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">
          Add New Student
        </h1>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 shadow-lg rounded-2xl p-8 space-y-10"
      >
        {/* SECTION 1: BASIC DETAILS */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <UserPlus size={20} /> Basic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Roll Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Roll Number</label>
              <input
                type="text"
                name="roll_number"
                value={formData.roll_number}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter roll number"
                required
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Year of Admission</label>
              <input
                type="number"
                name="year_of_admission"
                value={formData.year_of_admission}
                onChange={handleChange}
                placeholder="2023"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ACADEMIC DETAILS */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <BookOpen size={20} /> Academic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Department */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Department</label>
              <select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Course */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Course</label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Course</option>
                {courses
                  .filter((c) => c.department_id === Number(formData.department_id))
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
              </select>
            </div>

            {/* Residence */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Residence Type</label>
              <select
                name="residence_type"
                value={formData.residence_type}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select</option>
                <option value="Hosteller">Hosteller</option>
                <option value="Day Scholar">Day Scholar</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: CATEGORY DETAILS */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Users size={20} /> Category Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="GEN">GEN</option>
                <option value="EWS">EWS</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Religion */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">Religion</label>
              <select
                name="religion"
                value={formData.religion}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Religion</option>
                <option value="Islam">Islam</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Sikhism">Sikhism</option>
                <option value="Christianity">Christianity</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Jainism">Jainism</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Handicapped */}
            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                name="handicapped"
                checked={formData.handicapped === 1}
                onChange={handleChange}
                className="w-5 h-5 accent-blue-600"
              />
              <label className="text-gray-700 font-medium">Handicapped</label>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          className="
            w-full bg-blue-600 hover:bg-blue-700
            text-white py-3 rounded-lg text-lg font-medium
            transition shadow-md
          "
        >
          Add Student
        </button>

      </form>
    </div>
  );
};

export default AddStudents;
