// Backend/seed.js
// One-time script to populate the DB with test data covering every panel
// (admin / vendor / customer) and every status/flow you'd want to click
// through for a demo or resume walkthrough.
//
// Run with:  node seed.js
// (reads Backend/.env for MONGO_URI, so run it from inside Backend/)
//
// Safe to re-run: it wipes only the collections it seeds (see WIPE_COLLECTIONS)
// so you don't end up with duplicates on a second run.

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./models/user");
const Vendor = require("./models/vendor");
const Category = require("./models/category");
const Service = require("./models/service");
const Booking = require("./models/booking");
const Review = require("./models/review");
const Transaction = require("./models/transaction");
const Notification = require("./models/notification");
const generateBookingNumber = require("./utils/generateBookingNumber");

const PASSWORD = "Test@1234"; // same password for every seeded account, for demo convenience

const toSlug = (str) =>
  str.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB:", mongoose.connection.name);

  // --- wipe only what we're about to reseed ---
  await Promise.all([
    Notification.deleteMany({}),
    Transaction.deleteMany({}),
    Review.deleteMany({}),
    Booking.deleteMany({}),
    Service.deleteMany({}),
    Vendor.deleteMany({}),
    Category.deleteMany({}),
    User.deleteMany({}),
  ]);

  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  // ---------------------------------------------------------------------
  // 1. ADMIN (no public registration route by design — created directly)
  // ---------------------------------------------------------------------
  const admin = await User.create({
    fullName: "Rajesh Admin",
    email: "admin@kaamsetu.test",
    mobile: "9000000001",
    password: hashedPassword,
    role: "admin",
    isVerified: true,
    provider: "local",
  });

  // ---------------------------------------------------------------------
  // 2. CATEGORIES
  // ---------------------------------------------------------------------
  const categoryNames = ["Plumbing", "Electrical", "Carpentry", "Home Cleaning", "Painting"];
  const categories = await Category.insertMany(
    categoryNames.map((name) => ({
      name,
      slug: toSlug(name),
      description: `${name} services by verified professionals`,
      isActive: true,
    }))
  );
  const [plumbing, electrical, carpentry, cleaning, painting] = categories;

  // ---------------------------------------------------------------------
  // 3. VENDORS — one of each status so you can test the admin approval
  //    flow AND the "approved vendor" customer-facing flow
  // ---------------------------------------------------------------------
  const vendorDefs = [
    {
      key: "approved1",
      fullName: "Suresh Kumar",
      email: "vendor.approved@kaamsetu.test",
      mobile: "9000000010",
      businessName: "Suresh Plumbing Works",
      businessType: "Individual",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302001",
      experience: 6,
      status: "approved",
      categoryFocus: plumbing,
    },
    {
      key: "approved2",
      fullName: "Meena Devi",
      email: "vendor.approved2@kaamsetu.test",
      mobile: "9000000011",
      businessName: "Meena Home Cleaning Co.",
      businessType: "Individual",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302004",
      experience: 4,
      status: "approved",
      categoryFocus: cleaning,
    },
    {
      key: "pending",
      fullName: "Aman Verma",
      email: "vendor.pending@kaamsetu.test",
      mobile: "9000000012",
      businessName: "Aman Electricals",
      businessType: "Individual",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302012",
      experience: 2,
      status: "pending",
      categoryFocus: electrical,
    },
    {
      key: "rejected",
      fullName: "Vikram Singh",
      email: "vendor.rejected@kaamsetu.test",
      mobile: "9000000013",
      businessName: "Vikram Carpentry",
      businessType: "Individual",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302015",
      experience: 1,
      status: "rejected",
      categoryFocus: carpentry,
    },
  ];

  const vendors = {};
  for (const v of vendorDefs) {
    const user = await User.create({
      fullName: v.fullName,
      email: v.email,
      mobile: v.mobile,
      password: hashedPassword,
      role: "vendor",
      isVerified: true,
      provider: "local",
    });

    const vendor = await Vendor.create({
      userId: user._id,
      businessName: v.businessName,
      businessType: v.businessType,
      experience: v.experience,
      address: `${v.businessName}, Main Market`,
      city: v.city,
      state: v.state,
      pincode: v.pincode,
      aadhaarImage: "seed/aadhaar-placeholder.jpg",
      panImage: "seed/pan-placeholder.jpg",
      status: v.status,
      approvedAt: v.status === "approved" ? new Date() : null,
      rejectionReason: v.status === "rejected" ? "Incomplete documents" : "",
      bio: `${v.experience} years experience in ${v.categoryFocus.name.toLowerCase()}.`,
      skills: [v.categoryFocus.name],
      serviceAreas: [v.city],
      bankDetails: {
        bankName: "State Bank of India",
        isBankVerified: v.status === "approved",
        accountHolder: v.fullName,
        accountNumber: "000011112222",
        ifscCode: "SBIN0001234",
      },
    });

    vendors[v.key] = { user, vendor, category: v.categoryFocus };
  }

  // ---------------------------------------------------------------------
  // 4. SERVICES — only for approved vendors (matches requireApprovedVendor)
  // ---------------------------------------------------------------------
  const serviceDefs = [
    {
      vendorKey: "approved1",
      serviceName: "Tap & Pipe Leak Repair",
      description: "Fixing leaking taps, pipes and joints at your home.",
      priceType: "fixed",
      startingPrice: 349,
      duration: 60,
    },
    {
      vendorKey: "approved1",
      serviceName: "Bathroom Fitting Installation",
      description: "Installation of wash basins, geysers and shower fittings.",
      priceType: "variable",
      startingPrice: 799,
      duration: 120,
    },
    {
      vendorKey: "approved2",
      serviceName: "Deep Home Cleaning",
      description: "Full-home deep cleaning including kitchen and bathrooms.",
      priceType: "fixed",
      startingPrice: 1499,
      duration: 180,
    },
  ];

  const services = [];
  for (const s of serviceDefs) {
    const { vendor, category } = vendors[s.vendorKey];
    const service = await Service.create({
      vendorId: vendor._id,
      categoryId: category._id,
      serviceScope: "custom",
      serviceName: s.serviceName,
      description: s.description,
      priceType: s.priceType,
      startingPrice: s.startingPrice,
      duration: s.duration,
      isActive: true,
      slug: toSlug(`${s.serviceName}-${vendor._id.toString().slice(-5)}`),
    });
    services.push(service);
  }

  // ---------------------------------------------------------------------
  // 5. CUSTOMERS
  // ---------------------------------------------------------------------
  const customerDefs = [
    { fullName: "Priya Sharma", email: "customer1@kaamsetu.test", mobile: "9000000020" },
    { fullName: "Rohit Gupta", email: "customer2@kaamsetu.test", mobile: "9000000021" },
  ];
  const customers = [];
  for (const c of customerDefs) {
    const user = await User.create({
      fullName: c.fullName,
      email: c.email,
      mobile: c.mobile,
      password: hashedPassword,
      role: "customer",
      isVerified: true,
      provider: "local",
    });
    customers.push(user);
  }
  const [customer1, customer2] = customers;

  // ---------------------------------------------------------------------
  // 6. BOOKINGS — one per status, spread across vendors/customers, so the
  //    vendor bookings page, customer bookings page and admin bookings
  //    page all have something in every filter/tab
  // ---------------------------------------------------------------------
  const approvedVendor1 = vendors.approved1.vendor;
  const approvedVendor2 = vendors.approved2.vendor;

  const bookingDefs = [
    {
      customer: customer1,
      vendor: approvedVendor1,
      service: services[0],
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: "cash",
      daysFromNow: 2,
    },
    {
      customer: customer1,
      vendor: approvedVendor1,
      service: services[1],
      status: "accepted",
      paymentStatus: "pending",
      paymentMethod: "cash",
      daysFromNow: 3,
    },
    {
      customer: customer2,
      vendor: approvedVendor2,
      service: services[2],
      status: "in_progress",
      paymentStatus: "paid",
      paymentMethod: "online",
      daysFromNow: 0,
    },
    {
      customer: customer2,
      vendor: approvedVendor1,
      service: services[0],
      status: "completed",
      paymentStatus: "paid",
      paymentMethod: "online",
      daysFromNow: -5,
    },
    {
      customer: customer1,
      vendor: approvedVendor2,
      service: services[2],
      status: "completed",
      paymentStatus: "paid",
      paymentMethod: "cash",
      daysFromNow: -10,
    },
    {
      customer: customer2,
      vendor: approvedVendor1,
      service: services[1],
      status: "cancelled",
      paymentStatus: "failed",
      paymentMethod: "online",
      daysFromNow: -2,
      cancelledBy: "customer",
      cancelReason: "Change of plans",
    },
    {
      customer: customer1,
      vendor: approvedVendor2,
      service: services[2],
      status: "rejected",
      paymentStatus: "pending",
      paymentMethod: "cash",
      daysFromNow: -1,
    },
  ];

  const bookings = [];
  for (const b of bookingDefs) {
    const bookingDate = new Date();
    bookingDate.setDate(bookingDate.getDate() + b.daysFromNow);

    const booking = await Booking.create({
      customerId: b.customer._id,
      vendorId: b.vendor._id,
      serviceId: b.service._id,
      bookingNumber: generateBookingNumber(),
      bookingDate,
      bookingTime: "11:00 AM",
      status: b.status,
      paymentStatus: b.paymentStatus,
      paymentMethod: b.paymentMethod,
      address: "123, MI Road, Jaipur, Rajasthan",
      totalAmount: b.service.startingPrice,
      cancelledBy: b.cancelledBy || "",
      cancelReason: b.cancelReason || "",
    });
    bookings.push({ booking, ...b });
  }

  // ---------------------------------------------------------------------
  // 7. REVIEWS — for the two completed bookings
  // ---------------------------------------------------------------------
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const reviewTexts = [
    { rating: 5, review: "Excellent work, fixed the leak in 30 minutes. Highly recommend!" },
    { rating: 4, review: "Good cleaning service, slightly late but thorough job." },
  ];
  for (let i = 0; i < completedBookings.length; i++) {
    const b = completedBookings[i];
    await Review.create({
      customerId: b.customer._id,
      vendorId: b.vendor._id,
      serviceId: b.service._id,
      bookingId: b.booking._id,
      rating: reviewTexts[i].rating,
      review: reviewTexts[i].review,
    });
  }

  // ---------------------------------------------------------------------
  // 8. TRANSACTIONS — for the paid/online bookings
  // ---------------------------------------------------------------------
  const paidBookings = bookings.filter((b) => b.paymentStatus === "paid" && b.paymentMethod === "online");
  for (const b of paidBookings) {
    const commission = Math.round(b.service.startingPrice * 0.1);
    await Transaction.create({
      bookingId: b.booking._id,
      customerId: b.customer._id,
      vendorId: b.vendor._id,
      amount: b.service.startingPrice,
      vendorAmount: b.service.startingPrice - commission,
      commission,
      commissionRate: 10,
      paymentMethod: "online",
      paymentGateway: "razorpay",
      gatewayTransactionId: `pay_seed_${b.booking._id.toString().slice(-8)}`,
      gatewayOrderId: `order_seed_${b.booking._id.toString().slice(-8)}`,
      settlementStatus: "settled",
      status: "completed",
    });
  }

  // ---------------------------------------------------------------------
  // 9. NOTIFICATIONS — a few for each role so the bell icon isn't empty
  // ---------------------------------------------------------------------
  await Notification.insertMany([
    {
      userId: customer1._id,
      title: "Booking Confirmed",
      message: "Your booking for Bathroom Fitting Installation has been accepted.",
      type: "booking",
      isRead: false,
    },
    {
      userId: customer2._id,
      title: "Payment Successful",
      message: "Your payment for Deep Home Cleaning was successful.",
      type: "payment",
      isRead: false,
    },
    {
      userId: vendors.approved1.user._id,
      title: "New Booking Received",
      message: "You have a new booking request for Tap & Pipe Leak Repair.",
      type: "booking",
      isRead: false,
    },
    {
      userId: vendors.pending.user._id,
      title: "Application Under Review",
      message: "Your vendor application is being reviewed by our team.",
      type: "vendor",
      isRead: false,
    },
    {
      userId: admin._id,
      title: "New Vendor Application",
      message: "Aman Electricals has applied to become a vendor.",
      type: "vendor",
      isRead: false,
    },
  ]);

  console.log("\nSeed complete.\n");
  console.log("========== TEST LOGIN CREDENTIALS ==========");
  console.log(`Password for ALL accounts below: ${PASSWORD}\n`);
  console.log("ADMIN         :", admin.email);
  console.log("VENDOR approved(1) :", vendors.approved1.user.email, "(Plumbing, has services+bookings+reviews)");
  console.log("VENDOR approved(2) :", vendors.approved2.user.email, "(Cleaning, has services+bookings+reviews)");
  console.log("VENDOR pending     :", vendors.pending.user.email, "(no services yet — test admin approval flow)");
  console.log("VENDOR rejected    :", vendors.rejected.user.email, "(test rejected-vendor UI state)");
  console.log("CUSTOMER 1         :", customer1.email);
  console.log("CUSTOMER 2         :", customer2.email);
  console.log("=============================================\n");

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});