// controllers/campaignController.js
import Campaign from "../Database/campaignsModel.js";
import Board from "../Database/boardsModel.js";
import mongoose from "mongoose";
import UserModel from "../Database/userModel.js";

// ✅ Create Campaign
export const createCampaign = async (req, res) => {
  try {
    const campaign = new Campaign(req.body);
    await campaign.save();
    // Populate selectedBoards for response
    await campaign.populate("selectedBoards");
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get All Campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("selectedBoards");
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Single Campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate("selectedBoards");
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    res.status(200).json(campaign);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Campaign
export const updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("selectedBoards");
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    res.status(200).json(campaign);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete Campaign
export const deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });
    res.status(200).json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Boards By City (case-insensitive, flexible field name)
export const getBoardsByCity = async (req, res) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({ message: "City parameter is required" });
    }

    // Case-insensitive search for both possible field names
    const boards = await Board.find({
      $or: [
        { city: { $regex: new RegExp(`^${city}$`, "i") } },
        { City: { $regex: new RegExp(`^${city}$`, "i") } }
      ]
    });

    if (!boards || boards.length === 0) {
      return res.status(404).json({ message: "No boards found in this city" });
    }

    res.status(200).json(boards);
  } catch (error) {
    console.error("Error fetching boards by city:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};


// ✅ Get Service Man(s) By City
export const getServiceManByCity = async (req, res) => {
  try {
    const { city } = req.params;
    const servicemen = await UserModel.find({ city: city, role: "serviceman" }).select("-password");
    if (servicemen.length === 0)
      return res.status(404).json({ message: "No service men found in this city" });
    res.status(200).json(servicemen);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};