import { useState, useEffect } from "react";
import axios from "axios";
import { Menu, Pencil, Trash2 } from "lucide-react";
import Sidebar from "../../../components/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageBoards = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [boards, setBoards] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    BoardNo: "",
    Type: "backlit",
    Location: "",
    City: "",
    Latitude: "",
    Longitude: "",
    Height: "",
    Width: "",
  });

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL_SEE_BOARD);
      setBoards(res.data.boards || []);
    } catch (err) {
      console.error("Error fetching boards:", err);
      toast.error("Failed to load boards.");
    }
  };

  // 📍 Auto-fetch geolocation and reverse geocode
  const getGeoLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          const location = data.display_name || "Unknown location";

          setFormData((prev) => ({
            ...prev,
            Latitude: latitude,
            Longitude: longitude,
            Location: location,
          }));

          toast.success("Location autofilled successfully");
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          toast.warn("Coordinates fetched, but address lookup failed.");
          setFormData((prev) => ({
            ...prev,
            Latitude: latitude,
            Longitude: longitude,
          }));
        }
      },
      (err) => {
        toast.error("Failed to access location: " + err.message);
        console.error("Geolocation error:", err);
      }
    );
  };

  const toggleDialog = () => setShowDialog(!showDialog);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `${import.meta.env.VITE_API_URL_UPDATE_BOARD}/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Board updated successfully");
      } else {
        await axios.post(import.meta.env.VITE_API_URL_ADD_BOARD, formData, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success("Board added successfully");
      }

      setFormData({
        BoardNo: "",
        Type: "backlit",
        Location: "",
        City: "",
        Latitude: "",
        Longitude: "",
        Height: "",
        Width: "",
      });
      setIsEditing(false);
      setEditId(null);
      setShowDialog(false);
      fetchBoards();
    } catch (err) {
      console.error("Error saving board:", err);
      if (err.response?.data?.message?.toLowerCase().includes("boardno")) {
        toast.error("Board with this BoardNo already exists.");
      } else if (
        err.response?.data?.message?.toLowerCase().includes("location")
      ) {
        toast.error("Board with this location already exists.");
      } else {
        toast.error("Failed to save board.");
      }
    }
  };

  const handleEdit = (board) => {
    setFormData({
      BoardNo: board.BoardNo,
      Type: board.Type,
      Location: board.Location,
      City: board.City || "",
      Latitude: board.Latitude,
      Longitude: board.Longitude,
      Height: board.Height,
      Width: board.Width,
    });
    setIsEditing(true);
    setEditId(board._id);
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL_DELETE_BOARD}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Board deleted successfully");
      fetchBoards();
    } catch (err) {
      console.error("Error deleting board:", err);
      toast.error("Failed to delete board.");
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <ToastContainer />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col w-full overflow-y-auto">
        <div className="p-4 bg-white shadow-md md:hidden flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Manage Boards</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
            <h2 className="text-2xl font-bold text-blue-600">Boards</h2>
            <button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  BoardNo: "",
                  Type: "backlit",
                  Location: "",
                  City: "",
                  Latitude: "",
                  Longitude: "",
                  Height: "",
                  Width: "",
                });
                toggleDialog();
                getGeoLocation(); // ⬅️ trigger geo auto-fill
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Add Board
            </button>
          </div>

          {showDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto overflow-x-auto p-6">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">
                  {isEditing ? "Edit Board" : "Add New Board"}
                </h3>
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 min-w-[300px]"
                >
                  {[
                    "BoardNo",
                    "Type",
                    "Location",
                    "City",
                    "Latitude",
                    "Longitude",
                    "Height",
                    "Width",
                  ].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-1">
                        {field}
                      </label>
                      {field === "Type" ? (
                        <select
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className="w-full p-2 border rounded"
                          required
                        >
                          <option value="backlit">Backlit</option>
                          <option value="frontlit">Frontlit</option>
                        </select>
                      ) : (
                        <input
                          type={
                            [
                              "Latitude",
                              "Longitude",
                              "Height",
                              "Width",
                            ].includes(field)
                              ? "number"
                              : "text"
                          }
                          step="any"
                          name={field}
                          value={formData[field]}
                          onChange={handleChange}
                          className="w-full p-2 border rounded"
                          required
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={toggleDialog}
                      className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {isEditing ? "Update" : "Save"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              All Boards
            </h3>
            {boards.length === 0 ? (
              <p className="text-gray-500">No boards found.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {boards.map((board) => (
                  <div
                    key={board._id}
                    className="bg-white p-4 rounded shadow border hover:shadow-lg transition relative"
                  >
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(board)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(board._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <h4 className="font-bold text-blue-600">
                      {board.Type.toUpperCase()}
                    </h4>
                    <p className="text-sm text-gray-700">
                      <strong>Board No:</strong> {board.BoardNo}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Location:</strong> {board.Location}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>City:</strong> {board.City || "N/A"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Lat/Lon:</strong> {board.Latitude},{" "}
                      {board.Longitude}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Size:</strong> {board.Height}m x {board.Width}m
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(board.CreatedAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageBoards;
