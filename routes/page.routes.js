const express = require("express");
const router = express.Router();
const pageModel = require("../model/page.model");
const crypto = require("crypto");
const client = require("../db/redis");
let count = 1;
router.post("/", async (req, res) => {
  try {
    req.body.id = crypto.randomUUID();
    const newPage = await new pageModel(req.body);
    await newPage.save();
    res.json(newPage);
  } catch (error) {
    res.json({ error: "Error creating a new Page" });
  }
});

router.get("/", async (req, res) => {
  try {
    const key = `PageData: dataofallthepages`;
    const redisData = await client.get(key);
    if (redisData && (count & 1) == 0) {
      console.log("Getting page data from the redis server");
      count += 1;
      res.send(redisData);
    } else {
      const allPages = await pageModel.find({});
      await client.set(key, JSON.stringify(allPages));
      client.expire(key, 10);
      console.log("Getting data from mongoose database", count);
      count++;
      res.json(allPages);
    }
  } catch (error) {
    res.json({ error: "Error getting details of all the pages" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedPage = await pageModel.findOneAndDelete({ id: req.params.id });
    res.json(deletedPage);
  } catch (error) {
    res.json({ error: "Error deleting the page or the page does not exists" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedPage = await pageModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    res.json(updatedPage);
  } catch (error) {
    res.json({ error: "Error updating the user or the user does not exists" });
  }
});

module.exports = router;
