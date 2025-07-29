// src/Pages/Dashboards/Admin/ManageBoards.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/Sidebar";

const ManageBoards = () => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = [
          { id: 1, location: "Lahore", status: "Free" },
          { id: 2, location: "Karachi", status: "Held" },
        ];
        setBoards(data);
      } catch (error) {
        console.error("Failed to fetch boards", error);
        setBoards([]);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Boards</h2>
        <p className="text-gray-600 mb-4">Create, view, edit, or delete boards.</p>

        <button className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Create New Board
        </button>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-md shadow">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-2 px-4 border">Board ID</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {boards.length === 0 ? (
                <tr>
                  <td className="py-2 px-4 border text-center" colSpan="4">
                    No boards available
                  </td>
                </tr>
              ) : (
                boards.map((board) => (
                  <tr key={board.id}>
                    <td className="py-2 px-4 border">{board.id}</td>
                    <td className="py-2 px-4 border">{board.location}</td>
                    <td className="py-2 px-4 border">{board.status}</td>
                    <td className="py-2 px-4 border space-x-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                        Edit
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBoards;
