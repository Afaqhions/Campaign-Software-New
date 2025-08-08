import CampaignModel from "../Database/campaignsModel.js";
import BoardsModel from "../Database/boardsModel.js";
import ServiceManModel from "../Database/serviceManModel.js";

// ==========================
// Create a new campaign
// ==========================
export const createCampaign = async (req, res) => {
  try {
    console.log("📩 Received campaign data:", req.body);

    let {
      name,
      clientName,
      clientEmail,
      serviceManEmail,
      startDate,
      endDate,
      noOfBoards,
      selectedBoards,
      price,
    } = req.body;

    // Ensure selectedBoards is an array
    const boardsArray = Array.isArray(selectedBoards)
      ? selectedBoards
      : selectedBoards
      ? [selectedBoards]
      : [];

    // Required field validation
    if (
      !name ||
      !clientName ||
      !clientEmail ||
      !serviceManEmail ||
      !startDate ||
      !endDate ||
      !noOfBoards ||
      !price ||
      boardsArray.length === 0
    ) {
      return res.status(400).json({
        message: "All required fields must be filled. Please select at least one board.",
      });
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(clientEmail)) {
      return res.status(400).json({ message: "Invalid client email address." });
    }
    if (!emailRegex.test(serviceManEmail)) {
      return res.status(400).json({ message: "Invalid service man email address." });
    }

    // Date validation
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (isNaN(startDateObj) || isNaN(endDateObj)) {
      return res.status(400).json({ message: "Invalid date format." });
    }
    if (startDateObj >= endDateObj) {
      return res.status(400).json({ message: "End date must be after start date." });
    }

    // Create new campaign
    const newCampaign = new CampaignModel({
      name,
      clientName,
      clientEmail,
      serviceManEmail,
      startDate: startDateObj,
      endDate: endDateObj,
      noOfBoards: parseInt(noOfBoards),
      selectedBoards: boardsArray,
      price: parseFloat(price),
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);

  } catch (error) {
    console.error("❌ Error creating campaign:", error);

    // Handle unique constraint errors
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue)[0];
      const messages = {
        name: "Campaign name must be unique.",
        clientEmail: "Client email must be unique.",
        serviceManEmail: "Service man email must be unique.",
      };
      return res.status(400).json({ message: messages[duplicateField] || "Duplicate value error." });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// Get all campaigns with populated boards
// ==========================
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignModel.find().populate("selectedBoards");
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("❌ Error fetching campaigns:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// Get boards by city
// ==========================
export const getBoardsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) return res.status(400).json({ message: "City is required." });

    const boards = await BoardsModel.find({ City: city });
    res.status(200).json(boards);
  } catch (error) {
    console.error("❌ Error fetching boards:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// Get service men by city
// ==========================
export const getServiceMenByCity = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) return res.status(400).json({ message: "City is required." });

    const serviceMen = await ServiceManModel.find({ city });
    res.status(200).json(serviceMen);
  } catch (error) {
    console.error("❌ Error fetching service men:", error);
    res.status(500).json({ message: "Server error" });
  }
};
