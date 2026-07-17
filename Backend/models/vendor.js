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
      default: null,
    },
    skills: {
  type: [String],
  default: [],
},

serviceAreas: {
  type: [String],
  default: [],
},
   availability: {
  type: [
    {
      day: String,
      startTime: String,
      endTime: String,
      isHoliday: Boolean,
    },
  ],
  default: [],
},
    bankDetails: {
  bankName: {
    type: String,
    default: "",
  },
  isBankVerified: {
    type: Boolean,
    default: false
},
  accountHolder: {
    type: String,
    default: "",
  },
  accountNumber: {
    type: String,
    default: "",
  },
  ifscCode: {
    type: String,
    default: "",
  },
  upiId: {
    type: String,
    default: "",
  },
},
  },

  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Vendor", vendorSchema);
