// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
       required: function () {
    return this.provider === "local";
  },
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: function () {
    return this.provider === "local";
  },
    },

    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: {
  type: String,
  default: ""
},
otp: {
  type: String,
  default: null,
},

otpExpiresAt: {
  type: Date,
  default: null,
},

googleId: {
  type: String,
  default: null,
},

provider: {
  type: String,
  enum: ["local", "google"],
  default: "local",
},



  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);