const getVendorProfile = async (req, res) =>  {
 res.status(200).json({ message: "Vendor profile retrieved successfully" });
};

const updateVendorProfile = async (req, res) =>   {
    res.status(200).json({ message: "Vendor profile updated successfully" });
};

const updateProfileImage = async (req, res) =>  {
    res.status(200).json({ message: "Vendor profile image updated successfully" });
};

module.exports = {
  getVendorProfile,
  updateVendorProfile,
  updateProfileImage,
};
