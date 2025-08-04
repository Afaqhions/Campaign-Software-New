import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [allBoards, setAllBoards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    noOfBoards: "",
    selectedBoards: [],
  });

  const token = localStorage.getItem("token");

  // Fetch campaigns and boards
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campaignRes, boardsRes] = await Promise.all([
          axios.get(import.meta.env.VITE_API_URL_SEE_CAMPAIGNS, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(import.meta.env.VITE_API_URL_SEE_BOARD, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCampaigns(Array.isArray(campaignRes.data) ? campaignRes.data : []);

        const boards = Array.isArray(boardsRes.data.boards)
          ? boardsRes.data.boards
          : Array.isArray(boardsRes.data)
          ? boardsRes.data
          : [];

        setAllBoards(boards);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Error loading campaigns or boards.");
      }
    };

    fetchData();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target;
    if (name === "selectedBoards") {
      const selected = Array.from(selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, selectedBoards: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `${import.meta.env.VITE_API_URL_UPDATE_CAMPAIGNS}/${editId}`
      : import.meta.env.VITE_API_URL_CREATE_CAMPAIGN;

    const method = editId ? "put" : "post";

    try {
      const res = await axios[method](url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`Campaign ${editId ? "updated" : "created"} successfully`);
      setEditId(null);
      setShowForm(false);
      setFormData({ name: "", startDate: "", endDate: "", noOfBoards: "", selectedBoards: [] });

      const updated = await axios.get(import.meta.env.VITE_API_URL_SEE_CAMPAIGNS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(updated.data);
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(err?.response?.data?.message || "Submission failed");
    }
  };

  const handleEdit = (campaign) => {
    setFormData({
      name: campaign.name,
      startDate: campaign.startDate?.split("T")[0],
      endDate: campaign.endDate?.split("T")[0],
      noOfBoards: campaign.noOfBoards,
      selectedBoards: campaign.selectedBoards.map((b) => b._id || b),
    });
    setEditId(campaign._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this campaign?");
    if (!confirm) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL_DELET_CAMPAIGNS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Campaign deleted");
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">Manage Campaigns</h1>

        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setFormData({ name: "", startDate: "", endDate: "", noOfBoards: "", selectedBoards: [] });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        >
          {showForm ? "Close Form" : "Add Campaign"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4 max-w-3xl">
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Campaign Name"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <input
              name="noOfBoards"
              type="number"
              value={formData.noOfBoards}
              onChange={handleChange}
              placeholder="Number of Boards"
              className="w-full border px-3 py-2 rounded"
              required
            />
            <select
              name="selectedBoards"
              multiple
              value={formData.selectedBoards}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded h-40"
            >
              {allBoards.map((board) => (
                <option key={board._id} value={board._id}>
                  {`${board.Type?.toUpperCase()} — ${board.Location} (${board.City})`}
                </option>
              ))}
            </select>
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded">
              {editId ? "Update Campaign" : "Create Campaign"}
            </button>
          </form>
        )}

        <div className="mt-10 space-y-4">
          {campaigns.length > 0 ? (
            campaigns.map((campaign) => (
              <div key={campaign._id} className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold">{campaign.name}</h2>
                <p>Boards: {campaign.noOfBoards}</p>
                <p>
                  Duration: {campaign.startDate?.split("T")[0]} → {campaign.endDate?.split("T")[0]}
                </p>
                <p className="text-sm text-gray-600">
                  Boards:{" "}
                  {campaign.selectedBoards?.map((b) => b?.Location || b?.name || "Unknown").join(", ")}
                </p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => handleEdit(campaign)} className="bg-yellow-500 px-3 py-1 rounded text-white">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(campaign._id)} className="bg-red-600 px-3 py-1 rounded text-white">
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No campaigns found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ManageCampaigns;
