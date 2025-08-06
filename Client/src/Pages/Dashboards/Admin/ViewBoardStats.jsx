import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import axios from "axios";
import { Menu } from "lucide-react";

const ViewBoardStats = () => {
  const [boards, setBoards] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const [boardsRes, campaignsRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL_SEE_BOARD, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(import.meta.env.VITE_API_URL_SEE_CAMPAIGNS, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const boardList = Array.isArray(boardsRes.data)
        ? boardsRes.data
        : boardsRes.data.boards || [];

      const campaignList = Array.isArray(campaignsRes.data)
        ? campaignsRes.data
        : campaignsRes.data.campaigns || [];

      setBoards(boardList);
      setCampaigns(campaignList);

      const now = new Date();
      const formatted = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      setLastUpdated(formatted);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalBoards = boards.length;
  const heldBoards = campaigns.reduce((sum, campaign) => {
    return sum + (campaign.noOfBoards || 0);
  }, 0);
  const freeBoards = totalBoards - heldBoards;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Topbar for mobile */}
      <div className="flex justify-between items-center p-4 bg-white shadow-md md:hidden">
        <h1 className="text-xl font-bold text-gray-800">Board Stats</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={24} />
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 w-full p-4 sm:p-6">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Board Statistics</h2>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Overview of held and free boards.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-100 text-blue-800 rounded-xl p-4 sm:p-6 shadow-md">
            <h3 className="text-sm sm:text-lg font-semibold">Total Boards</h3>
            <p className="text-2xl sm:text-3xl font-bold mt-2">{totalBoards}</p>
          </div>

          <div className="bg-green-100 text-green-800 rounded-xl p-4 sm:p-6 shadow-md">
            <h3 className="text-sm sm:text-lg font-semibold">Free Boards</h3>
            <p className="text-2xl sm:text-3xl font-bold mt-2">{freeBoards}</p>
          </div>

          <div className="bg-yellow-100 text-yellow-800 rounded-xl p-4 sm:p-6 shadow-md">
            <h3 className="text-sm sm:text-lg font-semibold">Held Boards</h3>
            <p className="text-2xl sm:text-3xl font-bold mt-2">{heldBoards}</p>
          </div>

          <div className="bg-gray-100 text-gray-800 rounded-xl p-4 sm:p-6 shadow-md">
            <h3 className="text-sm sm:text-lg font-semibold">Last Updated</h3>
            <p className="text-base sm:text-lg mt-2">{lastUpdated}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewBoardStats;
