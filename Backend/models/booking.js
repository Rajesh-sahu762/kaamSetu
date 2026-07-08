const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vendor",
            required: true,
            index: true,
        },
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
            index: true,
        },
        bookingDate: {
            type: Date,
            required: true,
        },
        bookingTime: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "completed", "cancelled"],
            default: "pending",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        address: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            default: "",
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card", "online"],
            default: "cash",
        },
    },
    {
        timestamps: true,
    }
);