const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

const uploadBufferToCloudinary = (buffer, folder, options = {}) => {
  if (!Buffer.isBuffer(buffer)) {
    return Promise.reject(new TypeError("A file buffer is required for Cloudinary upload."));
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        ...options,
        folder: `kaamsetu/${folder}`,
        resource_type: options.resource_type || "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from([buffer]).pipe(stream);
  });
};

const uploadImage = uploadBufferToCloudinary;

const deleteImage = async (publicId) => {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId);
};

const getPublicId = (url) => {
  if (!url) return null;
  try {
    const parsedUrl = new URL(url);
    if (!/(^|\.)cloudinary\.com$/i.test(parsedUrl.hostname)) return null;

    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    const uploadIndex = segments.indexOf("upload");
    if (uploadIndex === -1) return null;

    let assetSegments = segments.slice(uploadIndex + 1);
    const versionIndex = assetSegments.findIndex((segment) => /^v\d+$/.test(segment));
    if (versionIndex !== -1) assetSegments = assetSegments.slice(versionIndex + 1);
    if (!assetSegments.length) return null;

    const last = assetSegments.pop().replace(/\.[^.]+$/, "");
    return [...assetSegments, last].join("/") || null;
  } catch {
    return null;
  }
};

module.exports = { uploadBufferToCloudinary, uploadImage, deleteImage, getPublicId };
