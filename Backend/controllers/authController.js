const bcrypt = require('bcrypt')
const userModel = require('../models/user')

const registerUser = async (req,res) => {
     try {
        const { fullName, email, mobile, password} = req.body
        if (!fullName || !email || !mobile || !password) {
            return res.status(400).json({
                success: false,
                message: "please provide all the required fields"
            })
        }
        // check if user already exists 
        const existingUser = userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "user already exists"
            })
        }

        // hash the password
           const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

        // create new user
        const newUser = new userModel({
            fullName,
            email,
            password: hashedPassword,
            mobile,
               role: "customer",
        })
        await newUser.save()
        res.status(201).json({
            success: true,
            message: "user registered successfully",
            user: newUser

        })



  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const LoginUser = (req,res) => {
    res.send('Login User')
}

module.exports = {
    registerUser, 
    LoginUser
}