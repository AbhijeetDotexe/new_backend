const express = require("express");
const router = express.Router();
const {
  getUsers,
  deleteUser,
  updateUser,
  createUser,
  register,
  login,
} = require("../controller/user.controller");
router.get("/", getUsers);

router.post("/", createUser);

router.delete("/:id", deleteUser);

router.patch("/:id", updateUser);

router.post("/register", register);

router.get("/login/:username", login);
module.exports = router;
