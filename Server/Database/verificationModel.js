import mongoose from 'mongoose';

const verificationSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    serviceMan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceMan",
      required: true,
    },
    serviceManUpload: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PicByServiceMan",
      required: true,
    },
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Verified"],
      default: "Pending",
      required: true,
    },
    distanceInMeters: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ Exporting the model
const VerificationModel = mongoose.model("Verification", verificationSchema);
export default VerificationModel;
