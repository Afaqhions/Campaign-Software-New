import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";

const ManageUsers = () => {
  const [clients, setClients] = useState([
    { id: "U101", name: "Ali Khan", email: "ali@example.com", password: "pass123" },
    { id: "U102", name: "Sara Ahmed", email: "sara@example.com", password: "pass456" }
  ]);

  const [servicemen, setServicemen] = useState([
    { id: "S101", name: "Bilal Raza", email: "bilal@example.com", password: "123456" },
    { id: "S102", name: "Asma Yousaf", email: "asma@example.com", password: "123789" }
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Client"
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddUser = () => {
    const newUser = {
      id: `${formData.role[0].toUpperCase()}${Math.floor(Math.random() * 1000)}`,
      ...formData
    };

    // Future API POST URL (placeholder)
    // fetch("/api/users/add", { method: "POST", body: JSON.stringify(newUser) })

    if (formData.role === "Client") {
      setClients(prev => [...prev, newUser]);
    } else {
      setServicemen(prev => [...prev, newUser]);
    }

    setFormData({ name: "", email: "", password: "", role: "Client" });
  };

  const handleEdit = (user) => {
    const updatedName = prompt("Edit name:", user.name);
    if (!updatedName) return;

    if (user.id.startsWith("U")) {
      setClients(prev =>
        prev.map(u => u.id === user.id ? { ...u, name: updatedName } : u)
      );
    } else {
      setServicemen(prev =>
        prev.map(u => u.id === user.id ? { ...u, name: updatedName } : u)
      );
    }

    // Future API PUT URL
    // fetch(`/api/users/update/${user.id}`, { method: "PUT", body: JSON.stringify(updatedUser) })
  };

  const handleDelete = (id, role) => {
    if (role === "Client") {
      setClients(prev => prev.filter(user => user.id !== id));
    } else {
      setServicemen(prev => prev.filter(user => user.id !== id));
    }

    // Future API DELETE URL
    // fetch(`/api/users/delete/${id}`, { method: "DELETE" })
  };

  const renderTable = (users, role) => (
    <div className="mb-12">
      <h3 className="text-xl font-bold mb-4">{role}s</h3>
      <div className="overflow-x-auto bg-white shadow-lg rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-[#2563eb] text-white">
            <tr>
              <th className="py-3 px-4 text-left">User ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Password</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="py-3 px-4">{user.id}</td>
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.password}</td>
                <td className="py-3 px-4 space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(user.id, role)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-3 text-gray-500">
                  No {role.toLowerCase()}s found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto max-h-screen">
        <h2 className="text-3xl font-bold text-[#2563eb] mb-6">Manage Users</h2>

        {/* Form to add user */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200 mb-8">
          <h3 className="text-xl font-semibold mb-4">Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded w-full"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="border p-2 rounded w-full"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="Client">Client</option>
              <option value="Serviceman">Serviceman</option>
            </select>
          </div>
          <button
            onClick={handleAddUser}
            className="mt-4 bg-[#2563eb] text-white px-4 py-2 rounded hover:bg-[#1e40af]"
          >
            Add User
          </button>
        </div>

        {/* Render tables */}
        {renderTable(clients, "Client")}
        {renderTable(servicemen, "Serviceman")}
      </div>
    </div>
  );
};

export default ManageUsers;
