import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ServiceManDashboard = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  const [formData, setFormData] = useState({
    campaignName: "",
    serviceManEmail: "",
    liveLocation: "",
    city: "",
    latitude: "",
    longitude: "",
    dateTime: "",
    image: null,
  });

  const [capturedImage, setCapturedImage] = useState(null);
  const [uploadedCampaigns, setUploadedCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState({ token: null, email: null });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (!token || !email) {
      toast.error("Unauthorized. Please login.");
      navigate("/");
      return;
    }
    setAuth({ token, email });
    setFormData((prev) => ({ ...prev, serviceManEmail: email }));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getLiveLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
        }));

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          const address = data.display_name || "Unknown location";

          setFormData((prev) => ({
            ...prev,
            liveLocation: address,
          }));

          toast.success("Location fetched successfully");
        } catch (error) {
          console.error("Reverse geocoding failed:", error);
          toast.warn("Coordinates fetched but address could not be resolved.");
        }
      },
      (err) => {
        toast.error("Failed to get location.");
        console.error("Geolocation error:", err);
      }
    );
  };

  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast.error("Failed to access webcam");
      console.error(err);
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) {
      toast.error("Camera not available");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Image capture failed");
          return;
        }

        const now = new Date();
        const formattedDateTime = now.toISOString().slice(0, 16);

        setFormData((prev) => ({
          ...prev,
          image: new File([blob], "captured.jpg", { type: "image/jpeg" }),
          dateTime: formattedDateTime,
        }));

        const previewUrl = URL.createObjectURL(blob);
        setCapturedImage(previewUrl);

        toast.success("Photo captured and timestamp added");
      },
      "image/jpeg",
      0.95
    );
  };

  const fetchUploads = async () => {
    const { token, email } = auth;
    if (!token || !email) return;

    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL_GET_PIC}?email=${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const uploads = Array.isArray(res.data.data) ? res.data.data : [];
      setUploadedCampaigns(uploads);
    } catch (error) {
      toast.error("Failed to fetch uploads");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { token } = auth;
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) form.append(key, value);
      });

      await axios.post(import.meta.env.VITE_API_URL_UPLOAD_PIC, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Data uploaded successfully");
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
      setCapturedImage(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Upload failed");
    }
  };

  useEffect(() => {
    if (auth.token && auth.email) {
      fetchUploads();
    }
  }, [auth]);

  const animatedButton = (label, onClick, classes = "") => (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`text-white font-medium px-4 py-2 rounded-xl shadow-lg transition-colors duration-200 ${classes}`}
    >
      {label}
    </motion.button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-blue-100 via-purple-50 to-white"
    >
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-5xl font-bold text-indigo-800 tracking-tight">🛠️ ServiceMan Dashboard</h1>
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg"
        >
          Logout
        </motion.button>
      </div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-2xl border border-indigo-100 mb-14"
      >
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6">📍 Upload Campaign Data</h2>
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {[{ name: "campaignName", label: "Campaign Name" },
            { name: "serviceManEmail", label: "Email" },
            { name: "liveLocation", label: "Live Location" },
            { name: "city", label: "City" },
            { name: "latitude", label: "Latitude" },
            { name: "longitude", label: "Longitude" },
            { name: "dateTime", label: "Date & Time", type: "datetime-local" },
          ].map(({ name, label, type = "text" }) => (
            <div key={name}>
              <label className="block mb-2 font-medium text-gray-800">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-4 md:col-span-2 mt-4">
            {animatedButton("📍 Get Location", getLiveLocation, "bg-blue-600 hover:bg-blue-700")}
            {animatedButton("📸 Open Camera", openCamera, "bg-purple-600 hover:bg-purple-700")}
            {animatedButton("📷 Capture", capturePhoto, "bg-green-600 hover:bg-green-700")}
          </div>

          {capturedImage && (
            <div className="md:col-span-2">
              <p className="font-semibold text-gray-700 mb-2">📸 Preview:</p>
              <img src={capturedImage} alt="Captured" className="rounded-xl w-64 border shadow" />
            </div>
          )}

          <div className="md:col-span-2">
            <video ref={videoRef} autoPlay muted className="w-full max-w-md rounded-xl border mt-4" />
          </div>

          <div className="md:col-span-2 text-right">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg"
            >
              🚀 Upload Data
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Uploaded Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white p-6 rounded-3xl shadow-2xl border border-indigo-100"
      >
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">📸 Uploaded Campaigns</h2>
        {loading ? (
          <p className="text-center text-indigo-600 italic">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800 font-semibold">
                  <th className="px-4 py-3 text-left">Campaign</th>
                  <th className="px-4 py-3 text-left">Location</th>
                  <th className="px-4 py-3 text-left">City</th>
                  <th className="px-4 py-3 text-left">Date & Time</th>
                  <th className="px-4 py-3 text-left">Status</th>
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
                      <td className="px-4 py-3">{new Date(upload.dateTime).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {upload.isVerified ? (
                          <span className="text-green-600 font-semibold">✅ Verified</span>
                        ) : (
                          <span className="text-red-500 font-semibold">❌ Unverified</span>
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
        )}
      </motion.div>
    </motion.div>
  );
};

export default ServiceManDashboard;
