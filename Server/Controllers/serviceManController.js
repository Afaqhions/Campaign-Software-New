import PicByServiceMan from "../Database/picByServiceManModel.js";
import Campaign from "../Database/campaignsModel.js";
import Board from "../Database/boardsModel.js";
import path from "path";
// Upload and Save to MongoDB
export const uploadServiceManPic = async (req, res) => {
  try {
    const {
      campaignName,
      serviceManEmail,
      liveLocation,
      city,
      latitude,
      longitude,
      dateTime,
    } = req.body;

    // Validation
    if (
      !req.file ||
      !campaignName ||
      !serviceManEmail ||
      !liveLocation ||
      !city ||
      !latitude ||
      !longitude ||
      !dateTime
    ) {
      return res.status(400).json({ message: "All fields and image are required." });
    }

    const normalizedPath = req.file.path.replace(/\\/g, "/");

    console.log("Creating new entry with serviceManEmail:", serviceManEmail);
    
    const newEntry = new PicByServiceMan({
      campaignName,
      serviceManEmail,
      liveLocation,
      city,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      dateTime,
      imageUrl: normalizedPath,
    });

    await newEntry.save();
    console.log("Saved new entry:", newEntry);
    console.log("Saved serviceManEmail:", newEntry.serviceManEmail);

    res.status(201).json({
      message: "Upload successful",
      data: newEntry,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during upload." });
  }
};

// Get all uploads by a specific service man
import VerificationModel from "../Database/verificationModel.js"; // ✅ import verification model


export const getUploads = async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({ message: "Email is required in query" });
    }

    const uploads = await PicByServiceMan.find({ serviceManEmail: email }).sort({ createdAt: -1 });

    const uploadsWithStatus = await Promise.all(
      uploads.map(async (upload) => {
        const verification = await VerificationModel.findOne({
          serviceManUpload: upload._id,
          status: "Verified",
        });

        return {
          ...upload.toObject(),
          isVerified: !!verification,
        };
      })
    );

    return res.status(200).json({ data: uploadsWithStatus });
  } catch (error) {
    console.error("Error fetching uploads:", error);
    return res.status(500).json({ message: "Failed to fetch uploads" });
  }
};

// ✅ Get campaigns assigned to a specific serviceman


export const getCampaignsByServiceMan = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Fetch campaigns directly by serviceManEmail
    const campaigns = await Campaign.find({ serviceManEmail: email }).populate("selectedBoards").lean();

    if (!campaigns.length) {
      return res.status(404).json({ message: "No campaigns found for this service man" });
    }

    res.status(200).json({ data: campaigns });
  } catch (error) {
    console.error("Error fetching campaigns by service man:", error);
    res.status(500).json({ message: "Server error" });
  }
};
