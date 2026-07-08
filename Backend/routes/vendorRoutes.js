const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => {
  res.json({ message: "Vendor routes are working!" });
});

router.get("/", (req, res) => {
  res.json({ message: "Vendor routes are working!" });
});

router.get("/test", (req, res) => {
  res.json({ message: "Vendor test route is working!" });
});

module.exports = router;