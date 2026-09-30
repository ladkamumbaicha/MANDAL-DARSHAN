import mongoose from "mongoose";

const mandalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      default: "",
      trim: true
    },

    address: {
      type: String,
      default: "",
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      default: ""
    },

    latitude: {
      type: Number
    },

    longitude: {
      type: Number
    },

    instagram: {
      type: String,
      default: ""
    },

    facebook: {
      type: String,
      default: ""
    },

    youtube: {
      type: String,
      default: ""
    },

    whatsapp: {
      type: String,
      default: ""
    },

    website: {
      type: String,
      default: ""
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,

    // Collection is specified HERE,
    // NOT in mongoose.connect()
    collection: "mandals"
  }
);

const Mandal =
  mongoose.models.Mandal ||
  mongoose.model(
    "Mandal",
    mandalSchema
  );

export default Mandal;