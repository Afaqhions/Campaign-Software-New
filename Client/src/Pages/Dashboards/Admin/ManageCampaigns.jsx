import React, { useEffect, useState } from 'react';

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  // Future: Fetch campaigns from backend API
  useEffect(() => {
    // Sample static data, replace with API call
    const dummyData = [
      {
        id: 'C123',
        title: 'Summer Sale',
        location: 'Lahore'
      },
      {
        id: 'C124',
        title: 'Winter Promo',
        location: 'Karachi'
      }
    ];
    setCampaigns(dummyData);
  }, []);

  const handleEdit = (id) => {
    console.log(`Edit campaign with ID: ${id}`);
    // Navigate to edit page or open modal
  };

  const handleDelete = (id) => {
    console.log(`Delete campaign with ID: ${id}`);
    // Call backend API to delete
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Campaigns</h2>
      <p className="text-gray-600 mb-4">Create, view, edit, or delete campaigns.</p>

      <button
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        onClick={() => console.log('Redirect to create campaign form')}
      >
        + Create New Campaign
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-md shadow-sm">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="py-2 px-4 border">Campaign ID</th>
              <th className="py-2 px-4 border">Title</th>
              <th className="py-2 px-4 border">Location</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td className="py-2 px-4 border">{campaign.id}</td>
                <td className="py-2 px-4 border">{campaign.title}</td>
                <td className="py-2 px-4 border">{campaign.location}</td>
                <td className="py-2 px-4 border space-x-2">
                  <button
                    onClick={() => handleEdit(campaign.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(campaign.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {campaigns.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No campaigns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageCampaigns;
