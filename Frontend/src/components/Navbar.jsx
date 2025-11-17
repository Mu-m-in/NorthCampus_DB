import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const links = [
    { name: "Dashboard", path: "/" },
    {
      name: "Departments",
      dropdown: true,
      dropdownItems: [
        { name: "Add Department Data", path: "/departments/add" },
        { name: "View Department Stats", path: "/departments/view" },
      ],
    },
    {
      name: "Students",
      dropdown: true,
      dropdownItems: [
        { name: "Add Student Data", path: "/students/add" },
        { name: "View Student Stats", path: "/students/view" },
      ],
    },
    {
      name: "Examination",
      dropdown: true,
      dropdownItems: [
        { name: "Add Examination Data", path: "/examination/add" },
        { name: "View Examination Stats", path: "/examination/view" },
      ],
    },
    {
      name: "Placement",
      dropdown: true,
      dropdownItems: [
        { name: "Add Placement Data", path: "/placement/add" },
        { name: "View Placement Data", path: "/placement/view" },
      ],
    },
    {
      name: "Staff",
      dropdown: true,
      dropdownItems: [
        { name: "Add Staff Member", path: "/staff/add" },
        { name: "View Staff Details", path: "/staff/view" },
      ],
    },
    {
      name: "Scholarship",
      dropdown: true,
      dropdownItems: [
        { name: "Add Scholarship Data", path: "/scholarship/add" },
        { name: "View Scholarship Stats", path: "/scholarship/view" },
      ],
    },
    {
      name: "Hostel",
      dropdown: true,
      dropdownItems: [
        { name: "Add Hostel Data", path: "/hostel/add" },
        { name: "View Hostel Stats", path: "/hostel/view" },
      ],
    }
  ];

  return (
    <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-full mx-auto px-10">
        
        <div className="flex justify-between h-20 items-center">
          {/* RIGHT — LOGO */}
          <div className="flex-shrink-0">
            <img
              src="/logo.png"
              alt="North Campus"
              className="h-14 w-auto object-contain"  // bigger logo
            />
          </div>
          {/* LEFT — NAV LINKS */}
          <div className="hidden md:flex gap-0">
            {links.map((link, index) =>
              link.dropdown ? (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(index)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-2 px-4 py-3 rounded hover:bg-blue-800 transition text-[16px] font-medium">
                    {link.name}
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-200 ${
                        openDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* DROPDOWN MENU */}
                  {openDropdown === index && (
                    <div className="absolute left-0 mt-1 w-60 bg-blue-700 rounded-xl shadow-xl py-2 transition-all duration-200">
                      {link.dropdownItems.map((item, i) => (
                        <Link
                          key={i}
                          to={item.path}
                          className="block px-4 py-2 hover:bg-blue-800 transition text-sm"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={index}
                  to={link.path}
                  className="px-4 py-3 rounded hover:bg-blue-800 transition text-[16px] font-medium"
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
