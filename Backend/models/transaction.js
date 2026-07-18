const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    paymentGateway: {
      type: String,
      enum: ["cash", "razorpay", "phonepe", "cashfree"],
      default: "cash",
    },
    commissionRate: {
      type: Number,
      default: 10,
    },
    remarks: {
      type: String,
      default: "",
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    vendorAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online"],
      default: "cash",
    },
    commission: {
      type: Number,
      required: true,
    },
    settlementStatus: {
      type: String,
      enum: ["pending", "processing", "settled"],
      default: "pending",
    },
    gatewayTransactionId: {
      type: String,
      default: "",
    },

    gatewayOrderId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

transactionSchema.index(
  { gatewayTransactionId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      gatewayTransactionId: {
        $type: "string",
      },
    },
  }
);

transactionSchema.index(
  { gatewayOrderId: 1 }
);

module.exports = mongoose.model("Transaction", transactionSchema);
