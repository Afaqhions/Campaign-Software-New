import CampaignModel from "../Database/campaignsModel.js";


// Create a new campaign
export const createCampaign = async (req, res) => {
  try {
    console.log("Received campaign data:", req.body);
    
    const {
      name,
      startDate,
      endDate,
      noOfBoards,
      selectedBoards,
      clientEmail,
      price,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !startDate ||
      !endDate ||
      !noOfBoards ||
      !clientEmail ||
      !price ||
      !Array.isArray(selectedBoards) ||
      selectedBoards.length === 0
    ) {
      console.log("Validation failed:", {
        name: !!name,
        startDate: !!startDate,
        endDate: !!endDate,
        noOfBoards: !!noOfBoards,
        clientEmail: !!clientEmail,
        price: !!price,
        selectedBoards: Array.isArray(selectedBoards) ? selectedBoards.length : 'not array',
        selectedBoardsValue: selectedBoards
      });
      return res
        .status(400)
        .json({ message: "All required fields must be filled. Please select at least one board." });
    }

    // Validate dates
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      console.log("Invalid dates:", { startDate, endDate });
      return res
        .status(400)
        .json({ message: "Invalid date format." });
    }

    if (startDateObj >= endDateObj) {
      return res
        .status(400)
        .json({ message: "End date must be after start date." });
    }

    const newCampaign = new CampaignModel({
      name,
      startDate: startDateObj,
      endDate: endDateObj,
      noOfBoards: parseInt(noOfBoards),
      selectedBoards,
      clientEmail,
      price: parseFloat(price),
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate entry detected." });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Get all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignModel.find().populate("selectedBoards");
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update a campaign
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      startDate,
      endDate,
      noOfBoards,
      selectedBoards,
      clientEmail,
      price,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !startDate ||
      !endDate ||
      !noOfBoards ||
      !clientEmail ||
      !price ||
      !selectedBoards ||
      selectedBoards.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    // Check for existing email in another campaign
    const existingCampaign = await CampaignModel.findOne({
      clientEmail,
      _id: { $ne: id },
    });

    if (existingCampaign) {
      return res
        .status(400)
        .json({ message: "Client email must be unique." });
    }

    const updatedCampaign = await CampaignModel.findByIdAndUpdate(
      id,
      {
        name,
        startDate,
        endDate,
        noOfBoards,
        selectedBoards,
        clientEmail,
        price,
      },
      { new: true, runValidators: true }
    );

    if (!updatedCampaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign:", error);

    if (error.code === 11000 && error.keyValue?.clientEmail) {
      return res
        .status(400)
        .json({ message: "Client email must be unique." });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// Delete a campaign
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCampaign = await CampaignModel.findByIdAndDelete(id);

    if (!deletedCampaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    res.status(200).json({ message: "Campaign deleted successfully." });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get campaigns for a specific client by email
export const getClientCampaigns = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Client email is required." });
    }

    const campaigns = await CampaignModel.find({ clientEmail: email }).populate(
      "selectedBoards"
    );

    res.status(200).json(campaigns);
  } catch (error) {
    console.error("Error fetching client campaigns:", error);
    res.status(500).json({ message: "Failed to fetch client campaigns." });
  }
};
