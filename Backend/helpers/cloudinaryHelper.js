// Backend/utils/cloudinaryHelper.js
// (Same content you already have - included here just so the controller's
// new require path -> ../utils/cloudinaryHelper -> lines up. Rename this
// file to whatever you actually saved it as, and adjust the require in
// vendorController.js to match.)

const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadImage = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `kaamsetu/${folder}`, resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const deleteImage = async (publicId) => {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId);
};

const getPublicId = (url) => {
  if (!url) return null;
  const parts = url.split("/");
  const file = parts.pop().split(".")[0];
  const folder = parts.slice(parts.indexOf("upload") + 2).join("/");
  return `${folder}/${file}`;
};

module.exports = { uploadImage, deleteImage, getPublicId };