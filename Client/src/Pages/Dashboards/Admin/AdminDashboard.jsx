// src/Pages/Dashboards/Admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Install lucide-react if not installed

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Mock Users
    setUsers([
      { _id: "u1", name: "Alice", role: "client" },
      { _id: "u2", name: "Bob", role: "serviceman" },
      { _id: "u3", name: "Charlie", role: "client" },
    ]);

    // Mock Boards
    setBoards([
      { _id: "b1", location: "Downtown", status: "held" },
      { _id: "b2", location: "Highway", status: "free" },
      { _id: "b3", location: "Mall", status: "held" },
    ]);
  }, []);

  const clientCount = users.filter(u => u.role === "client").length;
  const servicemanCount = users.filter(u => u.role === "serviceman").length;
  const heldBoards = boards.filter(b => b.status === "held").length;
  const freeBoards = boards.filter(b => b.status === "free").length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white p-6 shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:z-auto`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-600">Admin Panel</h2>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <nav className="flex flex-col space-y-4 text-sm font-medium text-gray-700">
          <Link to="/admin/users" className="hover:text-blue-600">Manage Users</Link>
          <Link to="/admin/campaigns" className="hover:text-blue-600">Manage Campaigns</Link>
          <Link to="/admin/boards" className="hover:text-blue-600">Manage Boards</Link>
          <Link to="/admin/boards/stats" className="hover:text-blue-600">View Board Status</Link>
          <Link to="/admin/assign" className="hover:text-blue-600">Assign Campaigns</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full overflow-y-auto">
        {/* Topbar for mobile */}
        <div className="p-4 bg-white shadow-md md:hidden flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 hidden md:block">Admin Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-sm text-gray-500">Clients</p>
              <p className="text-2xl font-semibold text-blue-600">{clientCount}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-sm text-gray-500">Servicemen</p>
              <p className="text-2xl font-semibold text-green-600">{servicemanCount}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-sm text-gray-500">Held Boards</p>
              <p className="text-2xl font-semibold text-red-600">{heldBoards}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-sm text-gray-500">Free Boards</p>
              <p className="text-2xl font-semibold text-indigo-600">{freeBoards}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
