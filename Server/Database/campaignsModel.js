import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    serviceManEmail: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    city: {
      type: String,
      required: true,
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
        required: true
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

export default mongoose.model("Campaign", campaignSchema);
