import { useEffect, useState } from "react";

const ClientDashboard = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // TODO: Replace with backend API call later
    setCampaigns([
      {
        _id: "1",
        title: "Back to School Campaign",
        price: 4500,
        location: "Mall Road Billboard",
        startDate: "2025-08-10",
        endDate: "2025-08-30",
      },
      {
        _id: "2",
        title: "Winter Sale Blast",
        price: 7000,
        location: "Main City Bridge",
        startDate: "2025-12-01",
        endDate: "2025-12-31",
      },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-10 px-6">
      <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center drop-shadow-md">
        📊 My Booked Campaigns
      </h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-xl p-6 border border-indigo-100">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-indigo-100 text-indigo-800 font-semibold text-left">
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Price (PKR)</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Start Date</th>
              <th className="px-4 py-3">End Date</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((camp, index) => (
                <tr
                  key={camp._id}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-indigo-50"
                  } hover:bg-emerald-50 transition-colors`}
                >
                  <td className="px-4 py-3 text-gray-800 font-medium">{camp.title}</td>
                  <td className="px-4 py-3 text-emerald-600 font-semibold">{camp.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-700">{camp.location}</td>
                  <td className="px-4 py-3 text-gray-600">{camp.startDate}</td>
                  <td className="px-4 py-3 text-gray-600">{camp.endDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6 italic">
                  No campaigns booked yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientDashboard;
