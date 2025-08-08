import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const ManageCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [allBoards, setAllBoards] = useState([]);
  const [filteredBoards, setFilteredBoards] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    noOfBoards: "",
    selectedBoards: [],
    clientEmail: "",
    price: "",
  });

  const token = localStorage.getItem("token");

  // ✅ Fetch Campaigns + Boards from DB
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

        const campaignsData = Array.isArray(campaignRes.data)
          ? campaignRes.data
          : [];

        const boardsData = Array.isArray(boardsRes.data)
          ? boardsRes.data
          : boardsRes.data.boards || [];

        setCampaigns(campaignsData);

        // ✅ Boards already in use
        const usedBoardIds = campaignsData.flatMap((camp) =>
          camp.selectedBoards.map((b) => b._id || b)
        );

        // ✅ If editing, allow the campaign's own boards
        const selectedBoardIds = editId
          ? campaignsData
              .find((c) => c._id === editId)
              ?.selectedBoards.map((b) => b._id || b) || []
          : [];

        const freeBoards = boardsData.filter(
          (board) =>
            !usedBoardIds.includes(board._id) ||
            selectedBoardIds.includes(board._id)
        );

        setAllBoards(freeBoards);

        // ✅ Extract unique cities from boards for dropdown
        const cityList = [...new Set(freeBoards.map((b) => b.City))];
        setCities(cityList);
      } catch (error) {
        toast.error("Error loading campaigns or boards.");
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, [token, editId]);

  // ✅ Handle City Change
  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setFormData((prev) => ({ ...prev, selectedBoards: [] })); // reset boards selection
    if (city) {
      setFilteredBoards(allBoards.filter((b) => b.City === city));
    } else {
      setFilteredBoards([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target;
    if (name === "selectedBoards") {
      const selected = Array.from(selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, selectedBoards: selected }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ✅ Check if email already exists in another campaign
  const isEmailUnique = (email) => {
    return !campaigns.some(
      (c) =>
        c.clientEmail.toLowerCase() === email.toLowerCase() &&
        c._id !== editId
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      name,
      startDate,
      endDate,
      noOfBoards,
      selectedBoards,
      clientEmail,
      price,
    } = formData;

    // ✅ Basic Required Field Check
    if (
      !name.trim() ||
      !startDate ||
      !endDate ||
      !noOfBoards ||
      !clientEmail.trim() ||
      !price
    ) {
      toast.error("All required fields must be filled.");
      return;
    }

    // ✅ Email Format Validation
    if (!/^\S+@\S+\.\S+$/.test(clientEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // ✅ Unique Email Validation
    if (!isEmailUnique(clientEmail)) {
      toast.error("This client email is already used in another campaign.");
      return;
    }

    // ✅ Board Selection Check
    if (selectedBoards.length === 0) {
      toast.error("Please select at least one board.");
      return;
    }

    const url = editId
      ? `${import.meta.env.VITE_API_URL_UPDATE_CAMPAIGNS}/${editId}`
      : import.meta.env.VITE_API_URL_CREATE_CAMPAIGN;

    const method = editId ? "put" : "post";

    const payload = {
      name: name.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      noOfBoards: parseInt(noOfBoards),
      selectedBoards,
      clientEmail: clientEmail.trim(),
      price: parseFloat(price),
    };

    try {
      await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(`Campaign ${editId ? "updated" : "created"} successfully`);

      setEditId(null);
      setShowForm(false);
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        noOfBoards: "",
        selectedBoards: [],
        clientEmail: "",
        price: "",
      });

      const updated = await axios.get(
        import.meta.env.VITE_API_URL_SEE_CAMPAIGNS,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCampaigns(updated.data);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Server error while creating/updating campaign";
      toast.error(msg);
      console.error("Submit error:", err);
    }
  };

  const handleEdit = (campaign) => {
    setFormData({
      name: campaign.name,
      startDate: campaign.startDate.slice(0, 10),
      endDate: campaign.endDate.slice(0, 10),
      noOfBoards: campaign.noOfBoards,
      selectedBoards: campaign.selectedBoards.map((b) => b._id || b),
      clientEmail: campaign.clientEmail,
      price: campaign.price,
    });
    setSelectedCity(""); // reset city on edit
    setEditId(campaign._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL_DELET_CAMPAIGNS}/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Campaign deleted");
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error("Failed to delete campaign");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar />
      <div className="p-6 w-full">
        <ToastContainer />
        <button
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-6 py-2 rounded shadow-md"
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setEditId(null);
          }}
        >
          {showForm ? "Close Form" : "Add Campaign"}
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <label>
              Campaign Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
            </label>
            <label>
              Start Date
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
            </label>
            <label>
              End Date
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
            </label>
            <label>
              Number of Boards
              <input
                type="number"
                name="noOfBoards"
                value={formData.noOfBoards}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
            </label>
            <label>
              Client Email
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
            </label>
            <label>
              Price
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="border p-2 w-full"
              />
            </label>

            {/* ✅ City Dropdown */}
            <label className="col-span-2">
              Select City
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="border p-2 w-full"
              >
                <option value="">-- Select City --</option>
                {cities.map((city, idx) => (
                  <option key={idx} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            {/* ✅ Boards Dropdown */}
            <label className="col-span-2">
              Select Boards
              <select
                name="selectedBoards"
                multiple
                value={formData.selectedBoards}
                onChange={handleChange}
                className="border p-2 w-full h-32"
                required
              >
                {filteredBoards.map((board) => (
                  <option key={board._id} value={board._id}>
                    {board.BoardNo} - {board.City}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded col-span-2"
            >
              {editId ? "Update Campaign" : "Create Campaign"}
            </button>
          </form>
        )}

        {/* ✅ Campaign List */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          {campaigns.map((campaign) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border p-4 rounded shadow bg-white"
            >
              <h2 className="text-xl font-semibold text-indigo-600">
                {campaign.name}
              </h2>
              <p>📧 Email: {campaign.clientEmail}</p>
              <p>💰 Price: PKR {campaign.price.toLocaleString()}</p>
              <p>📋 Boards: {campaign.noOfBoards}</p>
              <p>
                📅 Duration: {campaign.startDate.slice(0, 10)} →{" "}
                {campaign.endDate.slice(0, 10)}
              </p>
              <p className="italic text-sm text-gray-500">
                Boards:{" "}
                {campaign.selectedBoards
                  .map((b) =>
                    typeof b === "object"
                      ? `${b.BoardNo} - ${b.City}`
                      : b
                  )
                  .join(", ")}
              </p>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleEdit(campaign)}
                  className="bg-yellow-400 text-black px-4 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(campaign._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCampaigns;
