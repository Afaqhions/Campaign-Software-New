import AssignmentModel from "../Database/assignedCampaignsModel.js";
import CampaignModel from "../Database/campaignsModel.js";
import UserModel from "../Database/userModel.js";

// @desc    Assign a campaign to a serviceman
// @route   POST /api/assign
// @access  Protected
export const assignCampaign = async (req, res) => {
  try {
    const { campaignId, servicemanId } = req.body;

    if (!campaignId || !servicemanId) {
      return res.status(400).json({ error: "Campaign ID and Serviceman ID are required." });
    }

    const campaign = await CampaignModel.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found." });
    }

    const serviceman = await UserModel.findById(servicemanId);
    if (!serviceman || serviceman.role !== "serviceman") {
      return res.status(404).json({ error: "Valid serviceman not found." });
    }

    const existingAssignment = await AssignmentModel.findOne({ campaignId, servicemanId });
    if (existingAssignment) {
      return res.status(409).json({ error: "This campaign is already assigned to this serviceman." });
    }

    const newAssignment = new AssignmentModel({ campaignId, servicemanId });
    await newAssignment.save();

    res.status(201).json({
      message: "Campaign assigned successfully.",
      assignment: newAssignment,
    });
  } catch (error) {
    console.error("Assign Campaign Error:", error);
    res.status(500).json({ error: "Server error while assigning campaign." });
  }
};

// @desc    Get all assignments (admin use)
// @route   GET /api/assign/all
// @access  Admin
export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await AssignmentModel.find()
      .populate("campaignId", "name location startDate endDate")
      .populate("servicemanId", "name email");

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Fetch Assignments Error:", error);
    res.status(500).json({ error: "Failed to fetch assignments." });
  }
};

// ✅ NEW CONTROLLER: Get assignments for a serviceman by email
// @desc    Get assigned campaigns for a serviceman
// @route   GET /api/assign?email=serviceman@example.com
export const getAssignmentsByEmail = async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const assignments = await AssignmentModel.find()
      .populate("campaignId")
      .populate("servicemanId");

    const filtered = assignments.filter(
      (a) => a.servicemanId?.email === email
    );

    res.status(200).json({ data: filtered });
  } catch (error) {
    console.error("Get Assignments Error:", error);
    res.status(500).json({ error: "Server error while fetching assignments." });
  }
};
