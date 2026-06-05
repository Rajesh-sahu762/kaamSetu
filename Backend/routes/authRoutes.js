const express = require('express')
const router = express.Router()

const { registerUser, LoginUser, vendorRegister } = require('../controllers/authController')

// Register Route

router.post('/register', registerUser)

// Login Route
router.post('/login', LoginUser)

// Vendor Register Route
router.post('/vendor/register',vendorRegister)

module.exports = router