const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
const vendorModel = require("../models/vendor");
const transporter = require("../config/mail");
const generateOtp = require("../utils/generateOtp");

const registerUser = async (req, res) => {
  try {
    const { fullName, email, mobile, password, googleId, facebookId, profileImage } = req.body;
    const isSocialSignup = Boolean(googleId || facebookId);

    if (!fullName || !email || !mobile || (!isSocialSignup && !password)) {
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

    if (isSocialSignup) {
      // Google/Facebook already verified this email address for us —
      // create the account fully linked and active, no OTP step needed.
      const newUser = new userModel({
        fullName,
        email,
        mobile,
        role: "customer",
        provider: googleId ? "google" : "facebook",
        googleId: googleId || null,
        facebookId: facebookId || null,
        profileImage: profileImage || "",
        isVerified: true,
      });

      await newUser.save();

      const token = jwt.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        token,
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          profileImage: newUser.profileImage,
        },
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
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await newUser.save();

    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("PASS LENGTH:", process.env.EMAIL_PASS.length);

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
      message: "Registration successful. OTP sent to email.",
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

    const user = await userModel.findOne({ email });

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

    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isVerified = true;

    user.otp = null;
    user.otpExpiresAt = null;

    await user.save();

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOtp();

    user.otp = otp;

    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: "KaamSetu OTP",

      html: `
        <h2>Your OTP</h2>
        <h1>${otp}</h1>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOtp();

    user.otp = otp;

    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password OTP",
      html: `
        <h2>Password Reset</h2>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    // userId comes from the verified JWT (req.user), set by verifyToken —
    // NOT from req.body. That token can only exist if the OTP step
    // (verifyEmailOtp) already confirmed ownership of this account.
    // Trusting a plain email in the body here was the bug: anyone who
    // knew a user's email could reset their password without ever
    // proving they received the OTP.
    const { userId } = req.user;

    if (!password || password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const email = payload.email;
    const fullName = payload.name;
    const googleId = payload.sub;
    const profileImage = payload.picture;

    let user = await userModel.findOne({
      email,
    });

    // Existing User
    if (user) {
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account has been deactivated. Please contact support if you want to reactivate it.",
        });
      }

      // Google account link
      if (!user.googleId) {
        user.googleId = googleId;
        user.provider = "google";

        await user.save();
      }
      // Google has already confirmed ownership of this email address,
      // so there is no need to keep the account blocked on our own
      // (unrelated) OTP verification step.
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    } else {
      return res.status(200).json({
        success: true,
        isNewUser: true,

        fullName,
        email,
        googleId,
        profileImage,

        message: "Complete registration to continue",
      });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Google login successful",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const facebookLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Facebook access token is required",
      });
    }

    const facebookResponse = await axios.get(`https://graph.facebook.com/me`, {
      params: {
        fields: "id,name,email,picture",
        access_token: accessToken,
      },
    });

    const facebookUser = facebookResponse.data;

    const email = facebookUser.email;

    const fullName = facebookUser.name;

    const facebookId = facebookUser.id;

    const profileImage = facebookUser.picture?.data?.url;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Facebook email permission required",
      });
    }

    let user = await userModel.findOne({
      email,
    });

    // Existing User
    if (user) {
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: "Your account has been deactivated. Please contact support if you want to reactivate it.",
        });
      }

      if (!user.facebookId) {
        user.facebookId = facebookId;

        user.provider = "facebook";

        await user.save();
      }
      // Facebook has already confirmed ownership of this email address,
      // so there is no need to keep the account blocked on our own
      // (unrelated) OTP verification step.
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    } else {
      return res.status(200).json({
        success: true,
        isNewUser: true,

        fullName,
        email,
        facebookId,
        profileImage,

        message: "Complete registration to continue",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Facebook login successful",

      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
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

         if (!user.isActive) {
  return res.status(403).json({
    success: false,
    message: "Your account has been deactivated. Please contact support if you want to reactivate it.",
  });
}


    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first",
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
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
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
      profileImage,
      googleId,
      facebookId,
    } = req.body;
    const isSocialSignup = Boolean(googleId || facebookId);

    if (
      !fullName ||
      !email ||
      !mobile ||
      (!isSocialSignup && !password) ||
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

    // create new user
    const newUser = await userModel.create({
      fullName,
      email,
      mobile,
      ...(isSocialSignup
        ? {
            provider: googleId ? "google" : "facebook",
            googleId: googleId || null,
            facebookId: facebookId || null,
          }
        : { password: await bcrypt.hash(password, 10) }),
      role: "vendor",
      profileImage,
      isVerified: true,
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

const deactivateAccount = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.isActive = false;
user.deactivatedAt = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerUser,
  LoginUser,
  vendorRegister,
  deactivateAccount,
  verifyEmailOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
};