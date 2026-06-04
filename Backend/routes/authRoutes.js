const express = require('express')
const router = express.Router()

const { registerUser, LoginUser } = require('../controllers/authController')

// Register Route

router.post('/register', registerUser)

// Login Route
router.post('/login', LoginUser)

module.exports = router