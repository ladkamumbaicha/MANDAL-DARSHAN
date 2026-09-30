import mongoose from "mongoose";
import { MONGODB_COLLECTION } from "../config.js";

const socialSchema = new mongoose.Schema(
  {
    instagram: { type: String, default: "" },
    youtube: { type: String, default: "" },
    facebook: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    website: { type: String, default: "" }
  },
  { _id: false }
);

const mandalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    address: { type: String, default: "", trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    description: { type: String, default: "" },
    darshanTime: { type: String, default: "" },
    category: { type: String, default: "Ganpati Mandal" },
    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    social: { type: socialSchema, default: () => ({}) },
    year: { type: Number, default: 2027 },
    active: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    collection: MONGODB_COLLECTION
  }
);

const Mandal = mongoose.models.Mandal || mongoose.model("Mandal", mandalSchema);
export default Mandal;
