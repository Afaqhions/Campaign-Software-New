import PicByServiceMan from "../Database/picByServiceManModel.js";
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
export const getServiceManUploads = async (req, res) => {
  try {
    const { email } = req.query;
    console.log("Fetching uploads for email:", email);

    if (!email) {
      console.log("No email provided in query");
      return res.status(400).json({ message: "Service man email is required." });
    }

    const uploads = await PicByServiceMan.find({ serviceManEmail: email.toLowerCase() }).sort({ createdAt: -1 });
    console.log("Found uploads:", uploads.length);

    res.status(200).json({ data: uploads });
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: "Server error while fetching uploads." });
  }
};
