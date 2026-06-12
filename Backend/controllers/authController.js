const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const vendorModel = require("../models/vendor");
const transporter = require('../config/mail')
const generateOtp = require('../utils/generateOtp')

const registerUser = async (req, res) => {
  try {
  
    const { fullName, email, mobile, password } = req.body;
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({
        success: false,
        message: "please provide all the required fields",
      });
    }
    // check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();

    // create new user
    const newUser = new userModel({
  fullName,
  email,
  password: hashedPassword,
  mobile,
  role: "customer",

  otp,
  otpExpiresAt:
    new Date(Date.now() + 10 * 60 * 1000),
});

    
    await newUser.save();

    transporter.verify(function (error, success) {
  if (error) {
    console.log("MAIL ERROR:", error);
  } else {
    console.log("MAIL SERVER READY");
  }
});

    await transporter.sendMail({
  from: process.env.EMAIL_USER,

  to: email,

  subject: "KaamSetu Email Verification",

  html: `
    <h2>Verify Your Email</h2>

    <p>Your OTP is:</p>

    <h1>${otp}</h1>

    <p>Valid for 10 minutes.</p>
  `,
});


    res.status(201).json({
      success: true,
      message:
  "Registration successful. OTP sent to email.",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user =
      await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      user.otpExpiresAt < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isVerified = true;

    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "please provide all the required fields",
      });
    }
    // check if user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user does not exist",
      });
    }

    if (!user.isVerified) {
  return res.status(400).json({
    success: false,
    message:
      "Please verify your email first",
  });
}

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "invalid credentials",
      });
    }
    // generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(200).json({
      success: true,
      message: "user logged in successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const vendorRegister = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      password,
      businessName,
      businessType,
      experience,
      address,
      city,
      state,
      pincode,
      aadhaarNumber,
      panNumber,
      aadhaarImage,
      panImage,
      radius,
      profileImage
    } = req.body;
    if (
      !fullName ||
      !email ||
      !mobile ||
      !password ||
      !businessName ||
      !businessType ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      // !aadhaarNumber ||
      // !panNumber ||
      !aadhaarImage ||
      !panImage ||
      !radius ||
      !profileImage
    ) {
      return res.status(400).json({
        success: false,
        message: "please provide all the required fields",
      });
    }
    // check if user already exists
    const existingUser = await userModel.findOne({
      $or: [{ email }, { mobile }],
    });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }
    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const newUser = await userModel.create({
      fullName,
      email,
      mobile,
      password: hashedPassword,
      role: "vendor",
      profileImage,
    });

    const newVendor = await vendorModel.create({
      userId: newUser._id,

      businessName,
      businessType,
      experience,

      address,
      city,
      state,
      pincode,

      aadhaarNumber,
      panNumber,

      aadhaarImage,
      panImage,
      radius,
    });

    await newUser.save();
    await newVendor.save();

    res.status(201).json({
      success: true,
      message: "user registered successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  LoginUser,
  vendorRegister,
  verifyEmailOtp,
};