import React from 'react';

const ManageUsers = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      <p className="text-gray-600 mb-4">View, edit, or delete clients and servicemen.</p>

      <table className="min-w-full bg-white border rounded-md">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="py-2 px-4 border">User ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Role</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border">U101</td>
            <td className="py-2 px-4 border">Ali Khan</td>
            <td className="py-2 px-4 border">Client</td>
            <td className="py-2 px-4 border">ali@example.com</td>
            <td className="py-2 px-4 border space-x-2">
              <button className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
              <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
