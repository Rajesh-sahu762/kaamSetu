const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      required: true,
      enum: ["Individual", "Company", "Partnership"],
    },

    experience: {
      type: Number,

      default: 0,
    },

    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },

    aadhaarNumber: {
      type: String,
      // required: true
    },
    panNumber: {
      type: String,
      // required: true
    },

    aadhaarImage: {
      type: String,
      required: true,
    },
    panImage: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },
    radius: {
      type: Number,
      default: 10,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    bio: {
        type: String,
    },
    approvedAt: {
   type: Date,
   default: null
},
  },

{
      
    timestamps: true,
  },
);

module.exports = mongoose.model("Vendor", vendorSchema);
