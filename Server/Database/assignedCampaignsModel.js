import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },
    servicemanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming your servicemen are stored in the User model
      required: true,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const AssignmentModel = mongoose.model("Assignment", assignmentSchema);

export default AssignmentModel;
