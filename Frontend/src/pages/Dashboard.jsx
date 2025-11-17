import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  BookOpen,
  Building2,
  Bell,
  GraduationCap,
  UserCog,
  School,
  FileCheck,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  if (!stats)
    return (
      <div className="p-6 text-gray-600 text-xl font-semibold animate-pulse">
        Loading dashboard...
      </div>
    );

  const cards = [
    { title: "Departments", value: stats.departments, icon: Building2, link: "/departments/view" },
    { title: "Students", value: stats.students, icon: Users, link: "/students/view" },
    { title: "Total Students Graduated", value: stats.exams, icon: BarChart3, link: "/examination/view" },
    { title: "Placements", value: stats.placements, icon: GraduationCap, link: "/placement/view" },
    { title: "Scholarships", value: stats.scholarships, icon: FileCheck, link: "/scholarship/view" },
    { title: "Staff", value: stats.staff, icon: UserCog, link: "/staff/view" },
    { title: "Hostel Blocks", value: stats.hostels, icon: School, link: "/hostel/view" },
  ];

  const quickLinks = [
    { name: "Add Department", link: "/departments/add" },
    { name: "Add Student", link: "/students/add" },
    { name: "View Students", link: "/students/view" },
    { name: "Results Report", link: "/examination/view" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>

        <button className="relative p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <Bell className="w-6 h-6 text-gray-700" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
            3
          </span>
        </button>
      </div>

      {/* TOP GRID — ALL ORIGINAL CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card) => (
          <a
            key={card.title}
            href={card.link}
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <card.icon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-sm text-gray-600 mt-4">{card.title}</div>
            <div className="text-3xl font-bold text-gray-900 mt-1">
              {card.value.toLocaleString()}
            </div>
          </a>
        ))}
      </div>

      {/* INSIGHTS + QUICK LINKS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SIDE — RECENT ACTIVITY */}
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="border-l-4 border-blue-500 pl-4">New student data added</li>
            <li className="border-l-4 border-green-500 pl-4">Exam schedule updated</li>
            <li className="border-l-4 border-purple-500 pl-4">Staff details reviewed</li>
          </ul>
        </div>

        {/* RIGHT SIDE — NEW QUICK LINKS */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Links</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((item) => (
              <a
                key={item.name}
                href={item.link}
                className="p-4 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm font-medium transition text-center"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
