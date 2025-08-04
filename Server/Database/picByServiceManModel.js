import mongoose from 'mongoose';

const picByServiceManSchema = new mongoose.Schema(
  {
    campaignName: {
      type: String,
      required: true,
      trim: true,
    },
    serviceManEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    liveLocation: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    dateTime: {
      type: Date,
      default: Date.now, // ✅ correct usage
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // ✅ adds createdAt and updatedAt
);

const PicByServiceMan = mongoose.model('PicByServiceMan', picByServiceManSchema);

export default PicByServiceMan;
