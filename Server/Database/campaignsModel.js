import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    clientEmail: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    noOfBoards: {
      type: Number,
      required: true,
    },
    selectedBoards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
      },
    ],
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
  },
  { timestamps: true }
);

const CampaignModel = mongoose.model("Campaign", campaignSchema);
export default CampaignModel;
