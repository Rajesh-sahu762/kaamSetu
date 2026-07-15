require('dotenv').config();
const express = require('express')
const app = express()
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const vendorRoutes = require('./routes/vendorRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const cors = require('cors')
const transporter = require('./config/mail');

app.use(cors()) // Enable CORS for all routes

const PORT = process.env.PORT || 3000


// Connect to MongoDB
connectDB();

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

// Routes
app.use('/api/auth',authRoutes )

app.use('/api/vendor', vendorRoutes)

app.use("/uploads", express.static("uploads"));

app.use("/api/notifications", notificationRoutes);


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})