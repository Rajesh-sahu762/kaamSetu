const Razorpay = require("razorpay");
const crypto = require("crypto");
const Transaction = require("../models/transaction");
const Notification = require("../models/notification");
const Booking = require("../models/booking");
const Vendor = require("../models/vendor");
const mongoose = require("mongoose");
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
      receipt: `KS_${booking.bookingNumber}_${Date.now()}`,

      notes: {
        bookingId: booking._id.toString(),

        customerId: booking.customerId.toString(),

        vendorId: booking.vendorId.toString(),
      },
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

// =======================================
// Common Payment Processing Function
// =======================================

const processSuccessfulPayment = async ({
  booking,
  razorpayOrderId,
  razorpayPaymentId,
  amount,
  currency,
}) => {

  const session = await mongoose.startSession();

  session.startTransaction();

  try {

    // ==========================
    // Duplicate Transaction Check
    // ==========================

    const existingTransaction = await Transaction.findOne({
      gatewayTransactionId: razorpayPaymentId,
    }).session(session);

    if (existingTransaction) {

      await session.abortTransaction();
      session.endSession();

      return existingTransaction;

    }

    // ==========================
    // Amount Verification
    // ==========================

    if (amount !== booking.totalAmount * 100) {

      throw new Error("Payment amount mismatch.");

    }

    // ==========================
    // Currency Verification
    // ==========================

    if (currency !== "INR") {

      throw new Error("Invalid currency.");

    }

    // ==========================
    // Commission
    // ==========================

    const commissionRate =
      Number(process.env.COMMISSION_RATE || 10);

    const commission =
      Number(
        (
          booking.totalAmount *
          commissionRate
        ) / 100
      );

    const vendorAmount =
      booking.totalAmount - commission;

    // ==========================
    // Create Transaction
    // ==========================

    const [transaction] =
      await Transaction.create(
        [
          {

            bookingId: booking._id,

            customerId: booking.customerId,

            vendorId: booking.vendorId,

            amount: booking.totalAmount,

            vendorAmount,

            commission,

            commissionRate,

            currency,

            paymentGateway: "razorpay",

            paymentMethod: "online",

            settlementStatus: "pending",

            gatewayOrderId: razorpayOrderId,

            gatewayTransactionId:
              razorpayPaymentId,

            status: "completed",

          },
        ],
        { session }
      );

    // ==========================
    // Update Booking
    // ==========================

    booking.paymentStatus = "paid";

    booking.paymentMethod = "online";

    if (booking.status === "pending") {

      booking.status = "confirmed";

    }

    await booking.save({ session });

    // ==========================
    // Vendor
    // ==========================

    const vendor =
      await Vendor.findById(
        booking.vendorId
      ).session(session);

    // ==========================
    // Customer Notification
    // ==========================

    await Notification.create(
      [
        {

          userId: booking.customerId,

          title: "Payment Successful",

          message:
            `Payment received for booking ${booking.bookingNumber}.`,

          type: "payment",

          referenceId: transaction._id,

        },
      ],
      { session }
    );

    // ==========================
    // Vendor Notification
    // ==========================

    if (vendor) {

      await Notification.create(
        [
          {

            userId: vendor.userId,

            title: "Payment Received",

            message:
              `Customer payment received for booking ${booking.bookingNumber}.`,

            type: "payment",

            referenceId: transaction._id,

          },
        ],
        { session }
      );

    }

    // ==========================
    // Commit
    // ==========================

    await session.commitTransaction();

    session.endSession();

    return transaction;

  } catch (error) {

    await session.abortTransaction();

    session.endSession();

    throw error;

  }

};

// =======================================
// Verify Payment
// =======================================

const verifyPayment = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // ==========================
    // Validation
    // ==========================

    if (
      !bookingId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "All payment details are required.",
      });
    }

    // ==========================
    // Find Booking
    // ==========================

    const booking = await Booking.findById(bookingId).session(session);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // ==========================
    // Duplicate Payment Check
    // ==========================

    if (booking.paymentStatus === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment already completed.",
      });
    }

    // ==========================
    // Signature Verification
    // ==========================

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    const transaction =
await processSuccessfulPayment({

    booking,

    razorpayOrderId: razorpay_order_id,

    razorpayPaymentId: razorpay_payment_id,

    amount: booking.totalAmount * 100,

    currency: "INR",

});
    // ==========================
    // Response
    // ==========================

    await session.commitTransaction();

    session.endSession();

    return res.status(200).json({
      success: true,

      message: "Payment verified successfully.",

      data: transaction,
    });
  } catch (error) {
    await session.abortTransaction();

    session.endSession();

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
};

// =======================================
// Razorpay Webhook
// =======================================

const paymentWebhook = async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];

    const body = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    const payload = JSON.parse(body.toString());

    const event = payload.event;

    const payment = payload.payload.payment.entity;

    if (expectedSignature !== webhookSignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature.",
      });
    }

    // Sirf successful payment process karenge
    if (event !== "payment.captured") {
      return res.status(200).json({
        success: true,
        message: "Event ignored.",
      });
    }


    const bookingId = payment.notes?.bookingId;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID not found in payment notes.",
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Already Paid
    if (booking.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already processed.",
      });
    }

    const transaction =
await processSuccessfulPayment({

    booking,

    razorpayOrderId: razorpay_order_id,

    razorpayPaymentId: razorpay_payment_id,

    amount: booking.totalAmount * 100,

    currency: "INR",

});

    return res.status(200).json({
      success: true,

      message: "Webhook processed successfully.",

      data: transaction,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,

      message: "Webhook failed.",
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  paymentWebhook,
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
