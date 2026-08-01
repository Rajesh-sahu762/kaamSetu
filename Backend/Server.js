require('dotenv').config();
const express = require('express')
const app = express()
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const vendorRoutes = require('./routes/vendorRoutes')
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require('./routes/notificationRoutes')
const cors = require('cors')
const transporter = require('./config/mail');
const paymentRoutes = require("./routes/paymentRoutes");
const publicRoutes = require("./routes/publicRoutes");
const customerRoutes = require("./routes/customerRoutes");
const supportRoutes = require("./routes/supportRoutes");

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://kaamsetu.vercel.app"
    ],
    credentials: true,
})); // Enable CORS for all routes

const PORT = process.env.PORT || 3000


// Connect to MongoDB
connectDB();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

// Routes
app.use('/api/auth',authRoutes )

app.use('/api/vendor', vendorRoutes)

app.use("/uploads", express.static("uploads"));

app.use("/api/notifications", notificationRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/public", publicRoutes);

app.use("/api/customer", customerRoutes);

app.use("/api/support", supportRoutes);


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})