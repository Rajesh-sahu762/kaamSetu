// utils/generateBookingNumber.js
// Generates a human-readable, unique-enough booking number, e.g. KS-8F3K2A91.
// paymentService.js already reads booking.bookingNumber (for the Razorpay
// receipt) and vendorController/adminController already search/display it —
// this is the first place a Booking actually gets created, so it needs a
// producer for that field.

const generateBookingNumber = () => {
  const timestampPart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `KS-${timestampPart}${randomPart}`;
};

module.exports = generateBookingNumber;
