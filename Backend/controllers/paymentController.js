const Razorpay = require("razorpay");

const Booking = require("../models/booking");
const Vendor = require("../models/vendor");

// =======================================
// Razorpay Instance
// =======================================

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =======================================
// Create Razorpay Order
// =======================================

const createOrder = async (req, res) => {
    
  try {
    const { bookingId } = req.body;

    const { userId } = req.user;
    // ==========================
    // Validation
    // ==========================

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    // ==========================
    // Find Booking
    // ==========================

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // ==========================
    // Booking Owner Check
    // ==========================

    if (booking.customerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized payment request.",
      });
    }

    // ==========================
    // Already Paid
    // ==========================

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "This booking is already paid.",
      });
    }

    // ==========================
    // Vendor Check
    // ==========================

    const vendor = await Vendor.findById(booking.vendorId);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }

    // ==========================
    // Vendor Approval Check
    // ==========================
    
    if (vendor.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Vendor is not approved yet.",
      });
    }

    // ==========================
    // Bank Verification Check
    // ==========================

    if (!vendor.bankDetails.isBankVerified) {
      return res.status(400).json({
        success: false,
        message: "Vendor bank account is not verified.",
      });
    }

    // ==========================
    // Razorpay Order
    // ==========================

    const options = {
      amount: booking.totalAmount * 100,
      currency: "INR",
      receipt: `KS_${booking.bookingNumber}_${Date.now()}`
    }; 

    const order = await razorpay.orders.create(options);

    // ==========================
    // Response
    // ==========================
    return res.status(201).json({
      success: true,
      message: "Order created successfully.",

      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID,
        bookingId: booking._id,
      },
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create payment order.",
    });

  }
};

module.exports = {
  createOrder,
};







// 1. bookingId aaya?

// ↓

// 2. Booking mili?

// ↓

// 3. Customer wahi hai?

// ↓

// 4. Booking already paid?

// ↓

// 5. Vendor Approved?

// ↓

// 6. Vendor Bank Verified?

// ↓

// 7. Amount Database se nikalo

// ↓

// 8. Razorpay Order Create

// ↓

// 9. Response