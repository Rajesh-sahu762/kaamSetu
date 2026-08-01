// Backend/config/cloudinary.js
// This file wasn't in what you pasted, but both your upload.js and
// cloudinaryHelper.js require("../config/cloudinary") - so it must exist
// with exactly this shape, or the server won't even boot.

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;