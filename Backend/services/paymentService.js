const crypto = require("crypto");
const mongoose = require("mongoose");

const razorpay = require("../utils/razorpay");

const Booking = require("../models/booking");
const Vendor = require("../models/vendor");
const Transaction = require("../models/transaction");
const Notification = require("../models/notification");


class PaymentService {

    // ==========================================
    // Create Razorpay Order
    // ==========================================

    async createOrder(userId, bookingId) {

        try {

            // ==========================
            // Validation
            // ==========================

            if (!bookingId) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Booking ID is required."
                };
            }

            // ==========================
            // Find Booking
            // ==========================

            const booking = await Booking.findById(bookingId);

            if (!booking) {
                return {
                    success: false,
                    statusCode: 404,
                    message: "Booking not found."
                };
            }

            // ==========================
            // Booking Owner Check
            // ==========================

            if (booking.customerId.toString() !== userId) {
                return {
                    success: false,
                    statusCode: 403,
                    message: "Unauthorized payment request."
                };
            }

            // ==========================
            // Already Paid
            // ==========================

            if (booking.paymentStatus === "paid") {
                return {
                    success: false,
                    statusCode: 400,
                    message: "This booking is already paid."
                };
            }

            // ==========================
            // Vendor Check
            // ==========================

            const vendor = await Vendor.findById(booking.vendorId);

            if (!vendor) {
                return {
                    success: false,
                    statusCode: 404,
                    message: "Vendor not found."
                };
            }

            // ==========================
            // Vendor Approval
            // ==========================

            if (vendor.status !== "approved") {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Vendor is not approved yet."
                };
            }

            // ==========================
            // Bank Verification
            // ==========================

            if (
                !vendor.bankDetails ||
                !vendor.bankDetails.isBankVerified
            ) {
                return {
                    success: false,
                    statusCode: 400,
                    message: "Vendor bank account is not verified."
                };
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

                    vendorId: booking.vendorId.toString()

                }

            };

            const order = await razorpay.orders.create(options);

            // ==========================
            // Success Response
            // ==========================

            return {

                success: true,

                statusCode: 201,

                message: "Order created successfully.",

                data: {

                    orderId: order.id,

                    amount: order.amount,

                    currency: order.currency,

                    key: process.env.RAZORPAY_KEY_ID,

                    bookingId: booking._id

                }

            };

        }

        catch (error) {

            console.log("Create Order Error :", error);

            return {

                success: false,

                statusCode: 500,

                message: "Failed to create payment order."

            };

        }

    }


     // ==========================================
// Process Successful Payment
// ==========================================

async processSuccessfulPayment({

    booking,

    razorpayOrderId,

    razorpayPaymentId,

    amount,

    currency,

    session

}) {

    try {

        // ==========================
        // Duplicate Transaction
        // ==========================

        const existingTransaction =
        await Transaction.findOne({

            gatewayTransactionId: razorpayPaymentId

        }).session(session);

        if (existingTransaction) {

            return existingTransaction;

        }

        // ==========================
        // Amount Validation
        // ==========================

        if (amount !== booking.totalAmount * 100) {

            throw new Error("Payment amount mismatch.");

        }

        // ==========================
        // Currency Validation
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

                    gatewayTransactionId: razorpayPaymentId,

                    status: "completed"

                }
            ],
            { session }
        );

        // ==========================
        // Update Booking
        // ==========================

        booking.paymentStatus = "paid";

        booking.paymentMethod = "online";

        if (booking.status === "pending") {

            booking.status = "accepted";

        }

        await booking.save({ session });

        // ==========================
        // Get Vendor
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

                    referenceId: transaction._id

                }
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

                        referenceId: transaction._id

                    }
                ],
                { session }
            );
        }

        return transaction;

    } catch (error) {

        throw error;

    }

}

// ==========================================
// Verify Payment
// ==========================================

async verifyPayment(userId, paymentData) {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const {

            bookingId,

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature

        } = paymentData;

        // ==========================
        // Validation
        // ==========================

        if (
            !bookingId ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            await session.abortTransaction();
            session.endSession();

            return {

                success: false,

                statusCode: 400,

                message: "All payment details are required."

            };

        }

        // ==========================
        // Find Booking
        // ==========================

        const booking =
        await Booking.findById(bookingId)
        .session(session);

        if (!booking) {

            await session.abortTransaction();
            session.endSession();

            return {

                success: false,

                statusCode: 404,

                message: "Booking not found."

            };

        }

        // ==========================
        // Booking Owner
        // ==========================

        if (
            booking.customerId.toString() !==
            userId
        ) {

            await session.abortTransaction();
            session.endSession();

            return {

                success: false,

                statusCode: 403,

                message:
                "Unauthorized payment request."

            };

        }

        // ==========================
        // Already Paid
        // ==========================

        if (
            booking.paymentStatus === "paid"
        ) {

            await session.abortTransaction();
            session.endSession();

            return {

                success: false,

                statusCode: 400,

                message:
                "Payment already completed."

            };

        }

        // ==========================
        // Signature Verification
        // ==========================

        const generatedSignature =
        crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
        )
        .update(
            `${razorpay_order_id}|${razorpay_payment_id}`
        )
        .digest("hex");

        if (
            generatedSignature !==
            razorpay_signature
        ) {

            await session.abortTransaction();
            session.endSession();

            return {

                success: false,

                statusCode: 400,

                message:
                "Invalid payment signature."

            };

        }

        // ==========================
        // Process Payment
        // ==========================

        const transaction =
        await this.processSuccessfulPayment({

            booking,

            razorpayOrderId:
            razorpay_order_id,

            razorpayPaymentId:
            razorpay_payment_id,

            amount:
            booking.totalAmount * 100,

            currency: "INR",

            session

        });

        // ==========================
        // Commit
        // ==========================

        await session.commitTransaction();

        session.endSession();

        return {

            success: true,

            statusCode: 200,

            message:
            "Payment verified successfully.",

            data: transaction

        };

    }

    catch (error) {

        await session.abortTransaction();

        session.endSession();

        console.log(error);

        return {

            success: false,

            statusCode: 500,

            message:
            "Payment verification failed."

        };

    }

}

// ==========================================
// Razorpay Webhook
// ==========================================

async paymentWebhook(req) {

    const session = await mongoose.startSession();

    session.startTransaction();

    try {

        const webhookSignature =
        req.headers["x-razorpay-signature"];

        const body = req.body;

        const expectedSignature =
        crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_WEBHOOK_SECRET
        )
        .update(body)
        .digest("hex");

        if (
            expectedSignature !==
            webhookSignature
        ) {

            await session.abortTransaction();

            session.endSession();

            return {

                success: false,

                statusCode: 400,

                message:
                "Invalid webhook signature."

            };

        }

        const payload =
        JSON.parse(body.toString());

        const event =
        payload.event;

        // ==========================
        // Ignore Other Events
        // ==========================

        if (
            event !== "payment.captured"
        ) {

            await session.abortTransaction();

            session.endSession();

            return {

                success: true,

                statusCode: 200,

                message: "Event ignored."

            };

        }

        const payment =
        payload.payload.payment.entity;

        const bookingId =
        payment.notes?.bookingId;

        if (!bookingId) {

            await session.abortTransaction();

            session.endSession();

            return {

                success: false,

                statusCode: 400,

                message:
                "Booking ID not found."

            };

        }

        // ==========================
        // Find Booking
        // ==========================

        const booking =
        await Booking.findById(
            bookingId
        ).session(session);

        if (!booking) {

            await session.abortTransaction();

            session.endSession();

            return {

                success: false,

                statusCode: 404,

                message:
                "Booking not found."

            };

        }

        // ==========================
        // Already Paid
        // ==========================

        if (
            booking.paymentStatus ===
            "paid"
        ) {

            await session.abortTransaction();

            session.endSession();

            return {

                success: true,

                statusCode: 200,

                message:
                "Payment already processed."

            };

        }

        // ==========================
        // Process Payment
        // ==========================

        const transaction =
        await this.processSuccessfulPayment({

            booking,

            razorpayOrderId:
            payment.order_id,

            razorpayPaymentId:
            payment.id,

            amount:
            payment.amount,

            currency:
            payment.currency,

            session

        });

        await session.commitTransaction();

        session.endSession();

        return {

            success: true,

            statusCode: 200,

            message:
            "Webhook processed successfully.",

            data: transaction

        };

    }

    catch (error) {

        await session.abortTransaction();

        session.endSession();

        console.log(error);

        return {

            success: false,

            statusCode: 500,

            message:
            "Webhook processing failed."

        };

    }

}

}

module.exports = new PaymentService();