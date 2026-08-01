const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const upload = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: async () => ({
      folder: `kaamsetu/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      resource_type: "image",
    }),
  });

  const fileFilter = (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Only JPG, JPEG, PNG and WEBP images are allowed."),
        false
      );
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  });
};

module.exports = upload;