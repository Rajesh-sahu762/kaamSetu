const bcrypt = require('bcrypt')
const userModel = require('../models/user')
const jwt = require('jsonwebtoken')

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
        const existingUser = await userModel.findOne({
    $or: [
        { email },
        { mobile }
    ]
});
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

        console.log(req.body);
console.log(process.env.MONGO_URI);


  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

const LoginUser = async (req,res) => {
    const {email, password} = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "please provide all the required fields"
            })
        }
        // check if user exists 
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "user does not exist"
            })
        }
        // compare password
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "invalid credentials"
            })
        }
        // generate token
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '2h'})
        res.status(200).json({
            success:true,
            message: "user logged in successfully",
            token,
            user:{
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role            
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }

}

module.exports = {
    registerUser, 
    LoginUser
}