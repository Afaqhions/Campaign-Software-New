import VerificationModel from "../Database/verificationModel.js"
import CampaignModel from "../Database/campaignsModel.js";

export const getVerifiedCampaignsForClient = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Client email is required" });
    }

    // Step 1: Find all verifications with status "Verified"
    const verifiedCampaigns = await VerificationModel.find({ status: "Verified" })
      .populate({
        path: "campaign",
        match: { clientEmail: email }, // Filter campaigns by clientEmail
      })
      .populate("board")
      .populate("serviceMan")
      .populate("serviceManUpload")
      .exec();

    // Step 2: Filter out null campaigns (in case match didn't find any)
    const filteredCampaigns = verifiedCampaigns.filter(
      (verification) => verification.campaign !== null
    );

    res.status(200).json(filteredCampaigns);
  } catch (error) {
    console.error("Error fetching verified campaigns for client:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
