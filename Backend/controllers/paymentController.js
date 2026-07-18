const paymentService = require("../services/paymentService");

// ==========================================
// Create Razorpay Order
// ==========================================

const createOrder = async (req, res) => {

    try {

        const userId = req.user.userId;

        const { bookingId } = req.body;

        const response =
            await paymentService.createOrder(
                userId,
                bookingId
            );

        return res
            .status(response.statusCode)
            .json(response);

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal server error."

        });

    }

};

// ==========================================
// Verify Payment
// ==========================================

const verifyPayment = async (req, res) => {

    try {

        const userId = req.user.userId;

        const response =
            await paymentService.verifyPayment(

                userId,

                req.body

            );

        return res
            .status(response.statusCode)
            .json(response);

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal server error."

        });

    }

};

// ==========================================
// Razorpay Webhook
// ==========================================

const paymentWebhook = async (req, res) => {

    try {

        const response =
            await paymentService.paymentWebhook(req);

        return res
            .status(response.statusCode)
            .json(response);

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal server error."

        });

    }

};

module.exports = {

    createOrder,

    verifyPayment,

    paymentWebhook

};