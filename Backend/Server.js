const express = require('express')
const app = express()
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const cors = require('cors')

dotenv.config()

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


app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`)
})