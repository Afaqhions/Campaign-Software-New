// controllers/campaignController.js
import CampaignModel from "../Database/campaignsModel.js";

// Create a new campaign
export const createCampaign = async (req, res) => {
  try {
    const { name, startDate, endDate, noOfBoards, selectedBoards } = req.body;

    // Check for missing fields
    if (!name || !startDate || !endDate || !noOfBoards) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const newCampaign = new CampaignModel({
      name,
      startDate,
      endDate,
      noOfBoards,
      selectedBoards,
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json(savedCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: Get all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignModel.find().populate("selectedBoards");
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a campaign
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, startDate, endDate, noOfBoards, selectedBoards } = req.body;

    // Find and update the campaign
    const updatedCampaign = await CampaignModel.findByIdAndUpdate(
      id,
      { name, startDate, endDate, noOfBoards, selectedBoards },
      { new: true, runValidators: true }
    );

    if (!updatedCampaign) {
      return res.status(404).json({ message: "Campaign not found." });
    }

    res.status(200).json(updatedCampaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
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
