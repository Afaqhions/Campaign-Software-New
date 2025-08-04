import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ServiceManDashboard = () => {
  const [formData, setFormData] = useState({
    campaignName: "",
    serviceManEmail: localStorage.getItem("email") || "",
    liveLocation: "",
    city: "",
    latitude: "",
    longitude: "",
    dateTime: "",
    image: null,
  });

  const [uploadedCampaigns, setUploadedCampaigns] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchUploads = async () => {
    const email = localStorage.getItem("email");
    console.log("Fetching uploads for email:", email);
    
    if (!email) {
      console.log("No email found in localStorage");
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL_GET_PIC}?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Fetch response:", res.data);
      const uploads = Array.isArray(res.data.data) ? res.data.data : [];
      console.log("Setting uploads:", uploads);
      setUploadedCampaigns(uploads);
    } catch (error) {
      console.error("Fetch uploads failed:", error);
      console.error("Error details:", error.response?.data);
      setUploadedCampaigns([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");
    console.log("Form data:", formData);
    console.log("Token:", token);
    console.log("Upload URL:", import.meta.env.VITE_API_URL_UPLOAD_PIC);

    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        console.log(`Adding to FormData: ${key} =`, value);
        form.append(key, value);
      });

      console.log("Making POST request...");
      const res = await axios.post(import.meta.env.VITE_API_URL_UPLOAD_PIC, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", res.data);
      toast.success("Image uploaded successfully");
      
      // Refresh the data from server instead of just adding to local state
      await fetchUploads();

      setFormData((prev) => ({
        ...prev,
        campaignName: "",
        liveLocation: "",
        city: "",
        latitude: "",
        longitude: "",
        dateTime: "",
        image: null,
      }));
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error("Upload failed - Full error:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      toast.error(error?.response?.data?.message || error.message || "Upload failed");
    }
  };

  useEffect(() => {
    if (token) {
      console.log("useEffect triggered, token exists:", !!token);
      fetchUploads();
    } else {
      console.log("useEffect triggered, no token found");
    }
  }, [token]);

  return (
    <div className="min-h-screen p-6 md:p-10 bg-gradient-to-tr from-blue-50 to-indigo-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-indigo-700">🛠️ ServiceMan Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-xl shadow"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl mb-10">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-6">📍 Upload Campaign Data</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {[
            { name: "campaignName", label: "Campaign Name" },
            { name: "serviceManEmail", label: "ServiceMan Email" },
            { name: "liveLocation", label: "Live Location" },
            { name: "city", label: "City" },
            { name: "latitude", label: "Latitude" },
            { name: "longitude", label: "Longitude" },
            { name: "dateTime", label: "Date & Time", type: "datetime-local" },
          ].map(({ name, label, type = "text" }) => (
            <div key={name}>
              <label className="block mb-1 font-medium text-gray-700">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 rounded-xl p-2"
            />
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg"
            >
              Upload Data
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">📸 Uploaded Campaigns</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-indigo-100 text-indigo-800 font-semibold text-left">
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3">Date & Time</th>
                <th className="px-4 py-3">Verified</th>
              </tr>
            </thead>
            <tbody>
              {uploadedCampaigns.length > 0 ? (
                uploadedCampaigns.map((upload, index) => (
                  <tr
                    key={upload._id || index}
                    className={index % 2 === 0 ? "bg-white" : "bg-indigo-50"}
                  >
                    <td className="px-4 py-3">{upload.campaignName}</td>
                    <td className="px-4 py-3">{upload.liveLocation}</td>
                    <td className="px-4 py-3">{upload.city}</td>
                    <td className="px-4 py-3">
                      {new Date(upload.dateTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {upload.isVerified ? (
                        <span className="text-green-600 font-semibold">Verified</span>
                      ) : (
                        <span className="text-red-500 font-semibold">Unverified</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-6 italic">
                    No uploads found.
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