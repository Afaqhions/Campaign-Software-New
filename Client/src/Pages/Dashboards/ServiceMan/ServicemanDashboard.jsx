import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/AuthContext"; // Adjust path if needed
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Haversine formula to calculate distance between two points on Earth
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
};

export default function ServiceManDashboard() {
  const { user, token, logout } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!user?.email || !token) return;

    const fetchCampaigns = async () => {
      setLoading(true);
      try {
        const url = `${
          import.meta.env.VITE_API_URL_GET_CAMPAIGN_BY_SERVICE_MAN
        }${encodeURIComponent(user.email)}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch campaigns");
        }

        const data = await res.json();
        setCampaigns(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        toast.error(err.message || "Error fetching campaigns");
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [user?.email, token]);

  const handleOpenForm = (campaign) => {
    setSelectedCampaign(campaign);
    setIsLocationVerified(false);
    setCapturedImage(null);
    setUserLocation(null);
  };

  const handleCloseForm = () => {
    setSelectedCampaign(null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleVerifyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        const board = selectedCampaign.selectedBoards[0];
        if (board) {
          const distance = getDistance(
            latitude,
            longitude,
            board.Latitude,
            board.Longitude
          );
          if (distance <= 50) {
            setIsLocationVerified(true);
            toast.success("Location verified!");
          } else {
            toast.error(
              `You are ${distance.toFixed(
                2
              )} meters away. Please get closer to the board.`
            );
          }
        }
      },
      () => {
        toast.error("Unable to retrieve your location");
      }
    );
  };

  const handleOpenCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast.error("Failed to access webcam");
      console.error(err);
    }
  };

  const handleCapturePhoto = () => {
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
        setCapturedImage(new File([blob], "captured.jpg", { type: "image/jpeg" }));
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
      },
      "image/jpeg",
      0.95
    );
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!capturedImage) {
      toast.error("Please capture an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("campaignName", selectedCampaign.name);
    formData.append("serviceManEmail", user.email);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${userLocation.latitude}&lon=${userLocation.longitude}&format=json`
      );
      const data = await response.json();
      const address = data.display_name || "Unknown location";
      formData.append("liveLocation", address);
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      formData.append("liveLocation", "Unknown location");
    }

    formData.append("city", selectedCampaign.city);
    formData.append("latitude", userLocation.latitude);
    formData.append("longitude", userLocation.longitude);
    formData.append("dateTime", new Date().toISOString());
    formData.append("image", capturedImage);

    try {
      await axios.post(import.meta.env.VITE_API_URL_UPLOAD_PIC, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Report submitted successfully!");
      handleCloseForm();
    } catch (error) {
      toast.error("Failed to submit report.");
      console.error(error);
    }
  };

  if (loading) {
    return <p className="text-center mt-8 text-lg">Loading campaigns...</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {user?.fullName || user?.email}
        </h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {/* Campaign list */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <motion.div
              key={campaign._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-5 rounded-xl shadow-lg border border-gray-100"
            >
              <h2 className="text-xl font-semibold text-gray-700">
                {campaign.name}
              </h2>
              <p className="text-gray-500 text-sm">City: {campaign.city}</p>
              <div>
                <p className="text-gray-500 text-sm">Boards:</p>
                <ul className="list-disc list-inside">
                  {campaign.selectedBoards && campaign.selectedBoards.map((board) => (
                    <li key={board._id} className="text-gray-500 text-sm">
                      {board.BoardNo}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handleOpenForm(campaign)}
                className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Fill Report
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center">
            No campaigns assigned yet.
          </p>
        )}
      </div>

      {/* Report Form Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-2xl font-semibold mb-4">
                Report for {selectedCampaign.name}
              </h2>
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <input
                  type="text"
                  value={selectedCampaign.name}
                  readOnly
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full p-2 border rounded-lg bg-gray-100"
                />
                <button
                  type="button"
                  onClick={handleVerifyLocation}
                  className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                >
                  Verify Location
                </button>
                {isLocationVerified && (
                  <button
                    type="button"
                    onClick={handleOpenCamera}
                    className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  >
                    Upload Image
                  </button>
                )}
                {stream && (
                  <div>
                    <video
                      ref={videoRef}
                      autoPlay
                      className="w-full rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleCapturePhoto}
                      className="w-full mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                    >
                      Take Picture
                    </button>
                  </div>
                )}
                {capturedImage && (
                  <div>
                    <h3 className="text-lg font-semibold">Captured Image:</h3>
                    <img
                      src={URL.createObjectURL(capturedImage)}
                      alt="Captured"
                      className="w-full rounded-lg"
                    />
                  </div>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                    disabled={!capturedImage}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer position="top-right" />
    </div>
  );
}