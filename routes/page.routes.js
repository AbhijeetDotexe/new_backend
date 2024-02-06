const express = require("express");
const router = express.Router();

const {
  createPage,
  deletePage,
  putData,
  getData,
} = require("../controller/page.controller");

router.post("/", createPage);

router.get("/", getData);

router.delete("/:id", deletePage);

router.put("/:id", putData);

module.exports = router;
