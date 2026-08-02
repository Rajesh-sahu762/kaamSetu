// Backend/seed.js
// Populates every collection with 5-7 realistic dummy records so you can
// click through the customer, vendor, and admin panels end-to-end.
//
// IMAGES: schema fields just store an image URL string - the app doesn't
// care where it comes from as long as it's a valid https URL (this is the
// same assumption the Cloudinary migration relies on). So instead of
// uploading through Cloudinary during seeding, this script points
// directly at two free, stable public image services:
//   - https://i.pravatar.cc/... for profile/face photos
//   - https://picsum.photos/id/<id>/... for service/category/document photos
// Both are real, always-on URLs - nothing here is a fake/broken link.
//
// Run with:
//   cd Backend
//   node seed.js
//
// Safe to re-run - it wipes only the collections it seeds, so re-running
// after changes won't leave duplicates.

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

const PASSWORD = "Test@1234"; // same password on every seeded account, for demo convenience

const toSlug = (str) =>
  str.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const avatar = (id) => `https://i.pravatar.cc/300?img=${id}`;
const photo = (id) => `https://picsum.photos/id/${id}/800/600`;

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB:", mongoose.connection.name);

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
  // 1. ADMIN - only one; there's no public admin-register route by design,
  //    so this account has to be created directly like this.
  // ---------------------------------------------------------------------
  const admin = await User.create({
    fullName: "Rajesh Admin",
    email: "admin@kaamsetu.test",
    mobile: "9000000001",
    password: hashedPassword,
    role: "admin",
    isVerified: true,
    provider: "local",
    profileImage: avatar(12),
  });

  // ---------------------------------------------------------------------
  // 2. CATEGORIES (6)
  // ---------------------------------------------------------------------
  const categoryDefs = [
    { name: "Plumbing", img: photo(1060) },
    { name: "Electrical", img: photo(1078) },
    { name: "Carpentry", img: photo(1080) },
    { name: "Home Cleaning", img: photo(1040) },
    { name: "Painting", img: photo(1050) },
    { name: "AC Repair & Servicing", img: photo(1074) },
  ];
  const categories = await Category.insertMany(
    categoryDefs.map((c) => ({
      name: c.name,
      slug: toSlug(c.name),
      description: `${c.name} services by verified professionals`,
      image: c.img,
      isActive: true,
    }))
  );
  const [plumbing, electrical, carpentry, cleaning, painting, acRepair] = categories;

  // ---------------------------------------------------------------------
  // 3. VENDORS (6) - 4 approved (with services/bookings), 1 pending
  //    (test the admin-approval flow), 1 rejected (test the rejected UI)
  // ---------------------------------------------------------------------
  const vendorDefs = [
    {
      key: "suresh",
      fullName: "Suresh Kumar",
      email: "vendor.suresh@kaamsetu.test",
      mobile: "9000000010",
      businessName: "Suresh Plumbing Works",
      city: "Jaipur",
      pincode: "302001",
      experience: 6,
      status: "approved",
      category: plumbing,
      avatarId: 15,
    },
    {
      key: "meena",
      fullName: "Meena Devi",
      email: "vendor.meena@kaamsetu.test",
      mobile: "9000000011",
      businessName: "Meena Home Cleaning Co.",
      city: "Jaipur",
      pincode: "302004",
      experience: 4,
      status: "approved",
      category: cleaning,
      avatarId: 45,
    },
    {
      key: "ramesh",
      fullName: "Ramesh Yadav",
      email: "vendor.ramesh@kaamsetu.test",
      mobile: "9000000012",
      businessName: "RY Electricals",
      city: "Jaipur",
      pincode: "302017",
      experience: 8,
      status: "approved",
      category: electrical,
      avatarId: 33,
    },
    {
      key: "farhan",
      fullName: "Farhan Khan",
      email: "vendor.farhan@kaamsetu.test",
      mobile: "9000000013",
      businessName: "Khan Paint Works",
      city: "Jaipur",
      pincode: "302020",
      experience: 5,
      status: "approved",
      category: painting,
      avatarId: 51,
    },
    {
      key: "aman",
      fullName: "Aman Verma",
      email: "vendor.aman@kaamsetu.test",
      mobile: "9000000014",
      businessName: "Aman Electricals",
      city: "Jaipur",
      pincode: "302012",
      experience: 2,
      status: "pending",
      category: electrical,
      avatarId: 22,
    },
    {
      key: "vikram",
      fullName: "Vikram Singh",
      email: "vendor.vikram@kaamsetu.test",
      mobile: "9000000015",
      businessName: "Vikram Carpentry",
      city: "Jaipur",
      pincode: "302015",
      experience: 1,
      status: "rejected",
      category: carpentry,
      avatarId: 60,
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
      profileImage: avatar(v.avatarId),
    });

    const vendor = await Vendor.create({
      userId: user._id,
      businessName: v.businessName,
      businessType: "Individual",
      experience: v.experience,
      address: `${v.businessName}, Main Market`,
      city: v.city,
      state: "Rajasthan",
      pincode: v.pincode,
      aadhaarImage: photo(1025),
      panImage: photo(1026),
      status: v.status,
      approvedAt: v.status === "approved" ? new Date() : null,
      rejectionReason: v.status === "rejected" ? "Incomplete KYC documents" : "",
      bio: `${v.experience} years experience in ${v.category.name.toLowerCase()}.`,
      skills: [v.category.name],
      serviceAreas: [v.city],
      bankDetails: {
        bankName: "State Bank of India",
        isBankVerified: v.status === "approved",
        accountHolder: v.fullName,
        accountNumber: "000011112222",
        ifscCode: "SBIN0001234",
      },
    });

    vendors[v.key] = { user, vendor, category: v.category };
  }

  // ---------------------------------------------------------------------
  // 4. SERVICES (7) - only for approved vendors
  // ---------------------------------------------------------------------
  const serviceDefs = [
    {
      vendorKey: "suresh",
      serviceName: "Tap & Pipe Leak Repair",
      description: "Fixing leaking taps, pipes and joints at your home.",
      priceType: "fixed",
      startingPrice: 349,
      duration: 60,
      images: [photo(1060), photo(1061)],
    },
    {
      vendorKey: "suresh",
      serviceName: "Bathroom Fitting Installation",
      description: "Installation of wash basins, geysers and shower fittings.",
      priceType: "variable",
      startingPrice: 799,
      duration: 120,
      images: [photo(1062), photo(1063)],
    },
    {
      vendorKey: "meena",
      serviceName: "Deep Home Cleaning",
      description: "Full-home deep cleaning including kitchen and bathrooms.",
      priceType: "fixed",
      startingPrice: 1499,
      duration: 180,
      images: [photo(1040), photo(1041)],
    },
    {
      vendorKey: "meena",
      serviceName: "Kitchen Deep Cleaning",
      description: "Degreasing, chimney cleaning and cabinet wipe-down.",
      priceType: "fixed",
      startingPrice: 999,
      duration: 90,
      images: [photo(1042), photo(1043)],
    },
    {
      vendorKey: "ramesh",
      serviceName: "Wiring & Switchboard Repair",
      description: "Rewiring, switchboard replacement and safety checks.",
      priceType: "variable",
      startingPrice: 499,
      duration: 90,
      images: [photo(1078), photo(1079)],
    },
    {
      vendorKey: "ramesh",
      serviceName: "Ceiling Fan Installation",
      description: "Fan mounting, wiring and balancing.",
      priceType: "fixed",
      startingPrice: 349,
      duration: 45,
      images: [photo(1080), photo(1081)],
    },
    {
      vendorKey: "farhan",
      serviceName: "Full Home Interior Painting",
      description: "Premium emulsion painting for 2-3 BHK homes.",
      priceType: "variable",
      startingPrice: 5999,
      duration: 480,
      images: [photo(1050), photo(1051)],
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
      images: s.images,
      coverImage: s.images[0],
      isActive: true,
      slug: toSlug(`${s.serviceName}-${vendor._id.toString().slice(-5)}`),
    });
    services.push(service);
  }
  const [svcTap, svcBathroom, svcDeepClean, svcKitchen, svcWiring, svcFan, svcPaint] = services;

  // ---------------------------------------------------------------------
  // 5. CUSTOMERS (6)
  // ---------------------------------------------------------------------
  const customerDefs = [
    { fullName: "Priya Sharma", email: "customer.priya@kaamsetu.test", mobile: "9000000020", avatarId: 5 },
    { fullName: "Rohit Gupta", email: "customer.rohit@kaamsetu.test", mobile: "9000000021", avatarId: 8 },
    { fullName: "Anjali Mehta", email: "customer.anjali@kaamsetu.test", mobile: "9000000022", avatarId: 9 },
    { fullName: "Karan Malhotra", email: "customer.karan@kaamsetu.test", mobile: "9000000023", avatarId: 14 },
    { fullName: "Sneha Reddy", email: "customer.sneha@kaamsetu.test", mobile: "9000000024", avatarId: 20 },
    { fullName: "Vikas Chawla", email: "customer.vikas@kaamsetu.test", mobile: "9000000025", avatarId: 25 },
  ];
  const customers = {};
  for (const c of customerDefs) {
    const user = await User.create({
      fullName: c.fullName,
      email: c.email,
      mobile: c.mobile,
      password: hashedPassword,
      role: "customer",
      isVerified: true,
      provider: "local",
      profileImage: avatar(c.avatarId),
    });
    customers[c.fullName.split(" ")[0].toLowerCase()] = user;
  }
  const { priya, rohit, anjali, karan, sneha, vikas } = customers;

  // ---------------------------------------------------------------------
  // 6. BOOKINGS (11) - one for every status in the schema's enum
  //    (pending / accepted / on_the_way / in_progress / cancelled /
  //    rejected) plus 5 completed ones so there's enough data for 5
  //    reviews and a handful of transactions.
  // ---------------------------------------------------------------------
  const sureshVendor = vendors.suresh.vendor;
  const meenaVendor = vendors.meena.vendor;
  const rameshVendor = vendors.ramesh.vendor;
  const farhanVendor = vendors.farhan.vendor;

  const daysFromNow = (n) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
  };

  const bookingDefs = [
    { customer: priya, vendor: sureshVendor, service: svcTap, status: "pending", paymentStatus: "pending", paymentMethod: "cash", date: daysFromNow(2) },
    { customer: rohit, vendor: sureshVendor, service: svcBathroom, status: "accepted", paymentStatus: "pending", paymentMethod: "cash", date: daysFromNow(3) },
    { customer: anjali, vendor: rameshVendor, service: svcWiring, status: "on_the_way", paymentStatus: "pending", paymentMethod: "cash", date: daysFromNow(0) },
    { customer: karan, vendor: meenaVendor, service: svcDeepClean, status: "in_progress", paymentStatus: "paid", paymentMethod: "online", date: daysFromNow(0) },
    { customer: sneha, vendor: sureshVendor, service: svcTap, status: "completed", paymentStatus: "paid", paymentMethod: "online", date: daysFromNow(-4) },
    { customer: vikas, vendor: meenaVendor, service: svcKitchen, status: "completed", paymentStatus: "paid", paymentMethod: "cash", date: daysFromNow(-6) },
    { customer: priya, vendor: rameshVendor, service: svcFan, status: "completed", paymentStatus: "paid", paymentMethod: "online", date: daysFromNow(-8) },
    { customer: rohit, vendor: farhanVendor, service: svcPaint, status: "completed", paymentStatus: "paid", paymentMethod: "online", date: daysFromNow(-15) },
    { customer: anjali, vendor: sureshVendor, service: svcBathroom, status: "completed", paymentStatus: "paid", paymentMethod: "cash", date: daysFromNow(-20) },
    { customer: karan, vendor: meenaVendor, service: svcDeepClean, status: "cancelled", paymentStatus: "failed", paymentMethod: "online", date: daysFromNow(-2), cancelledBy: "customer", cancelReason: "Change of plans" },
    { customer: sneha, vendor: rameshVendor, service: svcWiring, status: "rejected", paymentStatus: "pending", paymentMethod: "cash", date: daysFromNow(-1) },
  ];

  const bookings = [];
  for (const b of bookingDefs) {
    const booking = await Booking.create({
      customerId: b.customer._id,
      vendorId: b.vendor._id,
      serviceId: b.service._id,
      bookingNumber: generateBookingNumber(),
      bookingDate: b.date,
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
  // 7. REVIEWS (5) - one per completed booking
  // ---------------------------------------------------------------------
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const reviewDefs = [
    { rating: 5, review: "Excellent work, fixed the leak in 30 minutes. Highly recommend!" },
    { rating: 4, review: "Good cleaning service, slightly late but thorough job." },
    { rating: 5, review: "Fan installed perfectly, very professional." },
    { rating: 4, review: "Painting quality was great, finished a day early too.", reply: "Thank you so much for the kind words! Look forward to serving you again." },
    { rating: 3, review: "Job was fine, could've cleaned up after finishing better." },
  ];
  const reviews = [];
  for (let i = 0; i < completedBookings.length; i++) {
    const b = completedBookings[i];
    const r = reviewDefs[i];
    const review = await Review.create({
      customerId: b.customer._id,
      vendorId: b.vendor._id,
      serviceId: b.service._id,
      bookingId: b.booking._id,
      rating: r.rating,
      review: r.review,
      vendorReply: r.reply || "",
      vendorRepliedAt: r.reply ? new Date() : null,
    });
    reviews.push(review);
  }

  // ---------------------------------------------------------------------
  // 8. TRANSACTIONS (7) - one for every paid booking (online or cash),
  //    plus a refunded one for the cancelled online booking
  // ---------------------------------------------------------------------
  const paidBookings = bookings.filter((b) => b.paymentStatus === "paid");
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
      paymentMethod: b.paymentMethod,
      paymentGateway: b.paymentMethod === "online" ? "razorpay" : "cash",
      gatewayTransactionId: b.paymentMethod === "online" ? `pay_seed_${b.booking._id.toString().slice(-8)}` : "",
      gatewayOrderId: b.paymentMethod === "online" ? `order_seed_${b.booking._id.toString().slice(-8)}` : "",
      settlementStatus: b.status === "completed" ? "settled" : "pending",
      status: "completed",
    });
  }

  const cancelledOnlineBooking = bookings.find((b) => b.status === "cancelled" && b.paymentMethod === "online");
  if (cancelledOnlineBooking) {
    const commission = Math.round(cancelledOnlineBooking.service.startingPrice * 0.1);
    await Transaction.create({
      bookingId: cancelledOnlineBooking.booking._id,
      customerId: cancelledOnlineBooking.customer._id,
      vendorId: cancelledOnlineBooking.vendor._id,
      amount: cancelledOnlineBooking.service.startingPrice,
      vendorAmount: cancelledOnlineBooking.service.startingPrice - commission,
      commission,
      commissionRate: 10,
      paymentMethod: "online",
      paymentGateway: "razorpay",
      gatewayTransactionId: `pay_seed_${cancelledOnlineBooking.booking._id.toString().slice(-8)}`,
      gatewayOrderId: `order_seed_${cancelledOnlineBooking.booking._id.toString().slice(-8)}`,
      settlementStatus: "pending",
      status: "refunded",
    });
  }

  // ---------------------------------------------------------------------
  // 9. NOTIFICATIONS (7) - spread across roles and types
  // ---------------------------------------------------------------------
  await Notification.insertMany([
    {
      userId: sneha._id,
      title: "Service Completed",
      message: "Your booking for Tap & Pipe Leak Repair has been completed successfully.",
      type: "booking",
      isRead: false,
    },
    {
      userId: karan._id,
      title: "Payment Successful",
      message: "Your payment for Deep Home Cleaning was successful.",
      type: "payment",
      isRead: false,
    },
    {
      userId: sureshVendor.userId,
      title: "New Booking Received",
      message: "You have a new booking request for Tap & Pipe Leak Repair.",
      type: "booking",
      isRead: false,
    },
    {
      userId: vendors.aman.user._id,
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
    {
      userId: rohit._id,
      title: "Vendor Replied",
      message: "Khan Paint Works replied to your review.",
      type: "review",
      isRead: false,
    },
    {
      userId: meenaVendor.userId,
      title: "New Review Received",
      message: "You received a new 4-star review on Kitchen Deep Cleaning.",
      type: "review",
      isRead: false,
    },
  ]);

  // ---------------------------------------------------------------------
  console.log("\nSeed complete.\n");
  console.log("========== TEST LOGIN CREDENTIALS ==========");
  console.log(`Password for ALL accounts below: ${PASSWORD}\n`);
  console.log("ADMIN               :", admin.email);
  console.log("VENDOR approved     :", vendors.suresh.user.email, "(Plumbing)");
  console.log("VENDOR approved     :", vendors.meena.user.email, "(Home Cleaning)");
  console.log("VENDOR approved     :", vendors.ramesh.user.email, "(Electrical)");
  console.log("VENDOR approved     :", vendors.farhan.user.email, "(Painting)");
  console.log("VENDOR pending      :", vendors.aman.user.email, "(test admin approval flow)");
  console.log("VENDOR rejected     :", vendors.vikram.user.email, "(test rejected-vendor UI)");
  console.log("CUSTOMER            :", priya.email);
  console.log("CUSTOMER            :", rohit.email);
  console.log("CUSTOMER            :", anjali.email);
  console.log("CUSTOMER            :", karan.email);
  console.log("CUSTOMER            :", sneha.email);
  console.log("CUSTOMER            :", vikas.email);
  console.log("=============================================\n");
  console.log(
    `Seeded: 6 categories, 6 vendors, 7 services, 6 customers, ${bookings.length} bookings, ${reviews.length} reviews, transactions, 7 notifications.\n`
  );

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});