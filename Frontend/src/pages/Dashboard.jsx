import React from "react";

export default function Dashboard() {
  const cards = [
    { title: "Departments", value: "12", color: "bg-blue-500", link: "/departments" },
    { title: "Students", value: "1240", color: "bg-green-500", link: "/students" },
    { title: "Exams", value: "5", color: "bg-yellow-500", link: "/examination" },
    { title: "Placements", value: "300", color: "bg-purple-500", link: "/placement" },
    { title: "Staff", value: "120", color: "bg-red-500", link: "/staff" },
    { title: "Scholarships", value: "45", color: "bg-teal-500", link: "/scholarship" },
    { title: "Hostel", value: "4 Blocks", color: "bg-indigo-500", link: "/hostel" },
    { title: "Library", value: "50k Books", color: "bg-pink-500", link: "/library" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <a
            href={card.link}
            key={card.title}
            className={`p-5 rounded-xl shadow-lg text-white ${card.color} hover:scale-105 transition transform`}
          >
            <div className="text-sm">{card.title}</div>
            <div className="text-2xl font-bold mt-2">{card.value}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
