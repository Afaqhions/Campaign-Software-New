import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage.");
        return;
      }

      const [usersRes, boardsRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL_SEE_USERS, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(import.meta.env.VITE_API_URL_SEE_BOARD, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const userList = Array.isArray(usersRes.data)
        ? usersRes.data
        : usersRes.data.users || [];

      const boardList = Array.isArray(boardsRes.data)
        ? boardsRes.data
        : boardsRes.data.boards || [];

      setUsers(userList);
      setBoards(boardList);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Count roles
  const clientCount = users.filter((u) => u.role === "client").length;
  const servicemanCount = users.filter((u) => u.role === "serviceman").length;
  const managerCount = users.filter((u) => u.role === "manager").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  const totalBoards = boards.length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col w-full overflow-y-auto">
        {/* Mobile topbar */}
        <div className="p-4 bg-white shadow-md md:hidden flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </div>

        {/* Main content */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 hidden md:block">Admin Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-sm text-gray-500">Clients</p>
              <p className="text-2xl font-semibold text-blue-600">{clientCount}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-sm text-gray-500">Servicemen</p>
              <p className="text-2xl font-semibold text-green-600">{servicemanCount}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-sm text-gray-500">Managers</p>
              <p className="text-2xl font-semibold text-purple-600">{managerCount}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-sm text-gray-500">Admins</p>
              <p className="text-2xl font-semibold text-yellow-600">{adminCount}</p>
            </div>
            <div className="bg-white p-6 rounded shadow text-center">
              <p className="text-sm text-gray-500">Total Boards</p>
              <p className="text-2xl font-semibold text-indigo-600">{totalBoards}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
