import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import { Menu } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [servicemen, setServicemen] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [selectedServiceman, setSelectedServiceman] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [campaignsRes, usersRes, assignedRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL_SEE_CAMPAIGNS, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(import.meta.env.VITE_API_URL_SEE_USERS, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(import.meta.env.VITE_API_URL_GET_ALL_CAMPAIGNS, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCampaigns(
        Array.isArray(campaignsRes.data)
          ? campaignsRes.data
          : campaignsRes.data.campaigns || []
      );

      const users = Array.isArray(usersRes.data)
        ? usersRes.data
        : usersRes.data.users || [];

      setServicemen(users.filter((user) => user.role === "serviceman"));

      const assignments = Array.isArray(assignedRes.data)
        ? assignedRes.data
        : assignedRes.data.assigned || [];

      setAssigned(assignments);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!selectedCampaign || !selectedServiceman) {
      toast.error("Please select both campaign and serviceman.");
      return;
    }

    try {
      await axios.post(
        import.meta.env.VITE_API_URL_ASSIGN_CAMPAIGNS,
        {
          campaignId: selectedCampaign,
          servicemanId: selectedServiceman,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Campaign assigned successfully!");
      setSelectedCampaign("");
      setSelectedServiceman("");
      fetchData();
    } catch (error) {
      console.error("Assign Error:", error);

      if (error?.response?.status === 409) {
        toast.error("⚠️ This campaign is already assigned to the selected serviceman.");
      } else if (error?.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error("❌ Failed to assign campaign.");
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile topbar */}
      <div className="flex items-center justify-between bg-white shadow-md px-4 py-3 md:hidden">
        <h1 className="text-xl font-bold text-gray-800">Assign Campaign</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={24} />
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 w-full p-4 sm:p-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 hidden md:block">
          Assign Campaigns
        </h2>

        <div className="mb-4">
          <label className="block mb-2 font-semibold text-sm sm:text-base">
            Select Campaign:
          </label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="border px-4 py-2 w-full rounded text-sm sm:text-base"
          >
            <option value="">-- Choose Campaign --</option>
            {campaigns.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({new Date(c.startDate).toLocaleDateString()} -{" "}
                {new Date(c.endDate).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-semibold text-sm sm:text-base">
            Select Serviceman:
          </label>
          <select
            value={selectedServiceman}
            onChange={(e) => setSelectedServiceman(e.target.value)}
            className="border px-4 py-2 w-full rounded text-sm sm:text-base"
          >
            <option value="">-- Choose Serviceman --</option>
            {servicemen.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.email})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssign}
          className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
        >
          Assign Campaign
        </button>

        {/* Assigned Campaigns Table */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">📋 Assigned Campaigns</h3>
          <div className="overflow-x-auto rounded-lg shadow bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-3">Campaign</th>
                  <th className="text-left px-4 py-3">Serviceman</th>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Date Assigned</th>
                </tr>
              </thead>
              <tbody>
                {assigned.length > 0 ? (
                  assigned.map((a, idx) => (
                    <tr key={a._id || idx} className="border-t">
                      <td className="px-4 py-2">{a.campaignId?.name || "N/A"}</td>
                      <td className="px-4 py-2">{a.servicemanId?.name || "N/A"}</td>
                      <td className="px-4 py-2">{a.servicemanId?.email || "N/A"}</td>
                      <td className="px-4 py-2">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No assigned campaigns yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignCampaigns;
