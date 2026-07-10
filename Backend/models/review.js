const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
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
        bookingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
            index: true,
        },
        rating: { 
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        review: {
            type: String,
            default: "",
        },
        
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model("Review", reviewSchema);