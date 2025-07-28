import { useEffect, useState } from "react";

const ServiceManDashboard = () => {
  const [formData, setFormData] = useState({
    location: "",
    latitude: "",
    longitude: "",
    timestamp: "",
    image: null,
  });

  const [assignedCampaigns, setAssignedCampaigns] = useState([]);

  useEffect(() => {
    // TODO: Replace with real API call
    setAssignedCampaigns([
      {
        id: "1",
        name: "Summer Splash Campaign",
        location: "Main Road",
        date: "2025-07-20",
        status: "Assigned",
      },
      {
        id: "2",
        name: "Winter Fest Sale",
        location: "City Billboard 3",
        date: "2025-08-01",
        status: "Pending",
      },
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);
    // TODO: Send data to backend via API
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 to-blue-100 p-6 md:p-10">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center drop-shadow-md">
        🛠️ ServiceMan Dashboard
      </h1>

      {/* 📥 Input Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-indigo-100">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">📍 Upload Campaign Board Data</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Timestamp</label>
            <input
              type="datetime-local"
              name="timestamp"
              value={formData.timestamp}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">Upload Campaign Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full bg-white border border-gray-300 rounded-xl p-2"
              required
            />
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg transition-all"
            >
              Upload Data
            </button>
          </div>
        </form>
      </div>

      {/* 📋 Assigned Campaigns Table */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">📦 Assigned Campaigns</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-indigo-100 text-indigo-800 font-semibold text-left">
                <th className="px-4 py-3">Campaign Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedCampaigns.length > 0 ? (
                assignedCampaigns.map((camp, index) => (
                  <tr
                    key={camp.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                    } hover:bg-emerald-50 transition-colors`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">{camp.name}</td>
                    <td className="px-4 py-3 text-gray-700">{camp.location}</td>
                    <td className="px-4 py-3 text-gray-600">{camp.date}</td>
                    <td className="px-4 py-3 text-emerald-700 font-semibold">{camp.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-6 italic">
                    No campaigns assigned.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceManDashboard;
