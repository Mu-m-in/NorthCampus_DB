import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react"; // dropdown icon

export default function Navbar() {
  const links = [
    { name: "Dashboard", path: "/" },
    {
      name: "Departments",
      path: "/departments",
      dropdown: true,
      dropdownItems: [
        { name: "Add Department Data", path: "/departments/add" },
        { name: "View Department Stats", path: "/departments/view" },
      ],
    },
    { name: "Students", path: "/students", dropdown: true, dropdownItems: [{ name: "Add Student Data", path: "/students/add" }, { name: "View Student Stats", path: "/students/view"}] },
    { name: "Examination", path: "/examination" },
    { name: "Placement", path: "/placement", dropdown:true , dropdownItems: [{name: "Add Placement Data", path:"/placement/add"},{ name: "View Placement Data" , path :"/placement/view"}] },
    { name: "Staff", path: "/staff", dropdown: true, dropdownItems: [{ name: "Add Staff Member", path: "/staff/add" }, { name: "View Staff Details", path: "/staff/view"}] },
    { name: "Scholarship", dropdown: true, dropdownItems: [{ name: "Add Scholarship Data", path: "/scholarship/add" }, { name: "View Scholarship Stats", path: "/scholarship/view"}] },
    { name: "Hostel", dropdown: true, dropdownItems: [{ name: "Add Hostel Data", path: "/hostel/add" }, { name: "View Hostel Stats", path: "/hostel/view"}] },
    { name: "Library", path: "/library" },
  ];

  return (
    <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-2xl font-bold">North Campus UOK</div>

          <div className="hidden md:flex space-x-4">
            {links.map((link) =>
              link.dropdown ? (
                <div key={link.path} className="relative group">
                  <Link to={link.path} className="flex items-center gap-1 px-3 py-2 rounded hover:bg-blue-800 transition">
                    {link.name}
                    <ChevronDown size={16} className="mt-0.5 transition-transform duration-200 group-hover:rotate-180" />
                  </Link>

                  <div
                    className="absolute hidden group-hover:block top-full left-0 mt-2 w-56 bg-blue-700 rounded-lg shadow-lg 
                    before:content-[''] before:absolute before:-top-2 before:left-0 before:w-full before:h-2"
                  >
                    {link.dropdownItems.map((item) => (
                      <Link
                        key={`${link.path}-${item.name}`}
                        to={item.path}
                        className="block px-4 py-2 hover:bg-blue-800 transition text-sm"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="px-3 py-2 rounded hover:bg-blue-800 transition"
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
