// src/Pages/Dashboards/Admin/ManageBoards.jsx
import React, { useEffect, useState } from "react";

const ManageBoards = () => {
  const [boards, setBoards] = useState([]); // ✅ Initialize as an empty array

  useEffect(() => {
    // You can later replace this with actual API call
    const fetchBoards = async () => {
      try {
        // Simulated data (replace with API response)
        const data = [
          { id: 1, location: "Lahore", status: "Free" },
          { id: 2, location: "Karachi", status: "Held" },
        ];
        setBoards(data); // ✅ Make sure it's an array
      } catch (error) {
        console.error("Failed to fetch boards", error);
        setBoards([]); // fallback
      }
    };

    fetchBoards();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Boards</h2>
      <p className="text-gray-600 mb-4">Create, view, edit, or delete boards.</p>

      <button className="mb-4 bg-green-500 text-white px-4 py-2 rounded">
        Create New Board
      </button>

      <table className="min-w-full bg-white border rounded-md">
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
                  <button className="bg-blue-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBoards;
