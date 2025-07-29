import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [formData, setFormData] = useState({
    campaignName: "",
    campaignDescription: "",
    campaignPrice: "",
    location: "",
    latitude: "",
    longitude: "",
    image: null,
    clientName: "",
    clientEmail: "",
    startDate: "",
    endDate: "",
  });

  const timestamp = new Date().toLocaleString();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCampaign = {
      ...formData,
      timestamp,
      id: Date.now(),
    };
    setCampaigns((prev) => [...prev, newCampaign]);

    setFormData({
      campaignName: "",
      campaignDescription: "",
      campaignPrice: "",
      location: "",
      latitude: "",
      longitude: "",
      image: null,
      clientName: "",
      clientEmail: "",
      startDate: "",
      endDate: "",
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Campaigns</h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg p-6 space-y-4 max-w-3xl mx-auto"
        >
          {/* Campaign Info */}
          <div>
            <label className="block text-gray-700">Campaign Name</label>
            <input
              type="text"
              name="campaignName"
              value={formData.campaignName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Campaign Description</label>
            <textarea
              name="campaignDescription"
              value={formData.campaignDescription}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Campaign Price</label>
            <input
              type="number"
              name="campaignPrice"
              value={formData.campaignPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Client Info */}
          <div>
            <label className="block text-gray-700">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Client Email</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          {/* Campaign Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          {/* Location Info */}
          <div>
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Latitude</label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Longitude</label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          {/* Image */}
          <div>
            <label className="block text-gray-700">Campaign Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">Timestamp</label>
            <input
              type="text"
              value={timestamp}
              readOnly
              className="w-full px-4 py-2 bg-gray-100 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md w-full"
          >
            Add Campaign
          </button>
        </form>

        {/* List */}
        <div className="mt-10 max-h-96 overflow-y-auto">
          {campaigns.length > 0 ? (
            <ul className="space-y-4">
              {campaigns.map((campaign, index) => (
                <li key={index} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold text-blue-900">{campaign.campaignName}</h3>
                  <p className="text-sm text-gray-600">{campaign.campaignDescription}</p>
                  <p className="text-sm">Price: ${campaign.campaignPrice}</p>
                  <p className="text-sm">Client: {campaign.clientName} ({campaign.clientEmail})</p>
                  <p className="text-sm">Start: {campaign.startDate}</p>
                  <p className="text-sm">End: {campaign.endDate}</p>
                  <p className="text-sm">Location: {campaign.location}</p>
                  <p className="text-sm">Lat/Lon: {campaign.latitude}, {campaign.longitude}</p>
                  <p className="text-sm">Timestamp: {campaign.timestamp}</p>
                  {campaign.image && (
                    <img
                      src={URL.createObjectURL(campaign.image)}
                      alt="Campaign"
                      className="mt-2 max-w-xs rounded-md"
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 mt-4">No campaigns added yet.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageCampaigns;
