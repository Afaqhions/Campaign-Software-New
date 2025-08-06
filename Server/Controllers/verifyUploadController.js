import PicByServiceMan from "../Database/picByServiceManModel.js";
import BoardsModel from "../Database/boardsModel.js";
import CampaignModel from "../Database/campaignsModel.js"; // ✅ Needed for clientEmail

// ✅ Utility: Haversine formula to calculate distance in meters
const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371e3; // Earth radius in meters

  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

//
// ✅ Admin: Verify one upload by ID
//
export const adminVerifyUploadById = async (req, res) => {
  const { uploadId } = req.params;

  try {
    const upload = await PicByServiceMan.findById(uploadId);
    if (!upload) return res.status(404).json({ message: "Upload not found" });

    const { latitude, longitude } = upload;
    const boards = await BoardsModel.find();

    let isVerified = false;
    let minDistance = Infinity;

    for (const board of boards) {
      const dist = getDistanceInMeters(latitude, longitude, board.Latitude, board.Longitude);
      if (dist < minDistance) minDistance = dist;
      if (dist <= 50) isVerified = true;
    }

    upload.isVerified = isVerified;
    upload.distanceInMeters = parseFloat(minDistance.toFixed(2));
    await upload.save();

    res.status(200).json({
      message: isVerified
        ? "✅ Upload verified successfully (within 50 meters)"
        : "❌ Upload is not within 50 meters of any board",
      upload: {
        ...upload.toObject(),
        distanceStatus: minDistance <= 50 ? "✅ Within 50m" : "❌ More than 50m",
      },
    });
  } catch (err) {
    console.error("Admin verification error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//
// ✅ Admin: Bulk verify all uploads
//
export const verifyAllServiceManUploads = async (req, res) => {
  try {
    const uploads = await PicByServiceMan.find();
    if (!uploads || uploads.length === 0)
      return res.status(404).json({ message: "No uploads found" });

    const boards = await BoardsModel.find();
    const updatedUploads = [];

    for (const upload of uploads) {
      const { latitude, longitude } = upload;

      let isVerified = false;
      let minDistance = Infinity;

      for (const board of boards) {
        const dist = getDistanceInMeters(latitude, longitude, board.Latitude, board.Longitude);
        if (dist < minDistance) minDistance = dist;
        if (dist <= 50) isVerified = true;
      }

      upload.isVerified = isVerified;
      upload.distanceInMeters = parseFloat(minDistance.toFixed(2));
      await upload.save();

      updatedUploads.push({
        ...upload.toObject(),
        distanceStatus: minDistance <= 50 ? "✅ Within 50m" : "❌ More than 50m",
      });
    }

    res.status(200).json({
      message: "✅ All uploads verified",
      count: updatedUploads.length,
      updatedUploads,
    });
  } catch (err) {
    console.error("Error verifying all uploads:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//
// ✅ Admin: Get all uploads with distance + client email
//
export const adminGetAllUploads = async (req, res) => {
  try {
    const uploads = await PicByServiceMan.find();
    const boards = await BoardsModel.find();

    if (!uploads || uploads.length === 0) {
      return res.status(404).json({ message: "No uploads found" });
    }

    const uploadsWithDistance = await Promise.all(
      uploads.map(async (upload) => {
        let minDistance = Infinity;

        for (const board of boards) {
          const dist = getDistanceInMeters(
            upload.latitude,
            upload.longitude,
            board.Latitude,
            board.Longitude
          );
          if (dist < minDistance) minDistance = dist;
        }

        // ✅ Get clientEmail from campaign
        let clientEmail = "Unknown";
        if (upload.campaign) {
          const campaignDoc = await CampaignModel.findById(upload.campaign);
          clientEmail = campaignDoc?.clientEmail || "Unknown";
        }

        return {
          ...upload.toObject(),
          distanceInMeters: parseFloat(minDistance.toFixed(2)),
          distanceStatus: minDistance <= 50 ? "✅ Within 50m" : "❌ More than 50m",
          clientEmail,
        };
      })
    );

    res.status(200).json({
      message: "✅ All uploads fetched with distances and client emails",
      count: uploadsWithDistance.length,
      data: uploadsWithDistance,
    });
  } catch (err) {
    console.error("Admin get uploads error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//
// ✅ Export all controllers
//
// ✅ Export only once
// export {
//   adminVerifyUploadById,
//   verifyAllServiceManUploads,
//   adminGetAllUploads
// };
