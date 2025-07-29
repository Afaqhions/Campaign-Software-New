import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // ✅ <-- Required for <Link> to work
import Sidebar from "../../../components/Sidebar";


const AssignCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [servicemen, setServicemen] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedServiceman, setSelectedServiceman] = useState("");
  const [message, setMessage] = useState({ type: "", content: "" });

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔄 Replace with real API calls if available
        // const campaignsRes = await axios.get(`${VITE_API_URL}/api/campaigns`);
        // const servicemenRes = await axios.get(`${VITE_API_URL}/api/servicemen`);

        // 🧪 Dummy data for now
        const dummyCampaigns = [
          { _id: "1", title: "Eid Sale", location: "Lahore" },
          { _id: "2", title: "New Year Promo", location: "Karachi" },
        ];
        const dummyServicemen = [
          { _id: "a", name: "Ahmed Raza" },
          { _id: "b", name: "Zain Ali" },
        ];

        // ✅ Safe fallback to array
        setCampaigns(Array.isArray(dummyCampaigns) ? dummyCampaigns : []);
        setServicemen(Array.isArray(dummyServicemen) ? dummyServicemen : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage({ type: "error", content: "Failed to fetch data." });
      }
    };

    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedCampaign || !selectedServiceman) {
      setMessage({
        type: "error",
        content: "Please select both campaign and serviceman.",
      });
      return;
    }

    try {
      // 🔄 Replace with actual backend POST request
      // await axios.post(`${VITE_API_URL}/api/assign`, {
      //   campaignId: selectedCampaign,
      //   servicemanId: selectedServiceman,
      // });

      // ✅ Simulate success
      setMessage({
        type: "success",
        content: "Campaign assigned successfully!",
      });
      setSelectedCampaign("");
      setSelectedServiceman("");
    } catch (error) {
      console.error("Assign Error:", error);
      setMessage({ type: "error", content: "Failed to assign campaign." });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Assign Campaigns</h2>

        {message.content && (
          <div
            className={`mb-4 px-4 py-2 rounded ${
              message.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {message.content}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Select Campaign:</label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="border px-4 py-2 w-full rounded"
          >
            <option value="">-- Choose Campaign --</option>
            {campaigns.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title} ({c.location})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold">Select Serviceman:</label>
          <select
            value={selectedServiceman}
            onChange={(e) => setSelectedServiceman(e.target.value)}
            className="border px-4 py-2 w-full rounded"
          >
            <option value="">-- Choose Serviceman --</option>
            {servicemen.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Assign Campaign
        </button>
      </div>
    </div>
  );
};

export default AssignCampaigns;
