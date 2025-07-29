import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "../../../components/Sidebar"; // Adjust path based on your folder structure

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [boards, setBoards] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setUsers([
      { _id: "u1", name: "Alice", role: "client" },
      { _id: "u2", name: "Bob", role: "serviceman" },
      { _id: "u3", name: "Charlie", role: "client" },
    ]);

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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col w-full overflow-y-auto">
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
