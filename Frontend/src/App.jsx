import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Department from "./pages/Department";
import Students from "./pages/Students";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/departments" element={<Department />} />
        <Route path="/students" element={<Students />} />
        {/* Add other routes later */}
      </Routes>
    </div>
  );
}

export default App;
