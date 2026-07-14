const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    serviceScope: {
      type: String,
      enum: ["all", "custom"],
      default: "custom",
    },
    serviceName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priceType: {
      type: String,
      required: true,
      enum: ["fixed", "variable"],
    },
    startingPrice: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      unique: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Service", serviceSchema);
