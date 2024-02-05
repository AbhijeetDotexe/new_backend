const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/jwt.authentication");

router.get("/", verifyToken, (req, res) => {
  res.json({ message: "Protected route is being accessed" });
});

module.exports = router;
