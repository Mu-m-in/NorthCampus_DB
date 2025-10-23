import { Link } from "react-router-dom";

export default function Navbar() {
  const links = [
    { name: "Dashboard", path: "/" },
    { name: "Departments", path: "/departments" },
    { name: "Students", path: "/students" },
    { name: "Examination", path: "/examination" },
    { name: "Placement", path: "/placement" },
    { name: "Staff", path: "/staff" },
    { name: "Scholarship", path: "/scholarship" },
    { name: "Hostel", path: "/hostel" },
    { name: "Library", path: "/library" },
  ];

  return (
    <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-2xl font-bold">University DB</div>
          <div className="hidden md:flex space-x-4">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-3 py-2 rounded hover:bg-blue-800 transition"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
