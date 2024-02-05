// username, fullname, email, passoword
const express = require("express");
const router = express.Router();
const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 5;
const secretmessage = "This is just for testing";
const client = require("../db/redis");
let count = 1;
router.get("/", async (req, res) => {
  try {
    const key = `${req.body.method}:${req.body.originalUrl}`;
    const redisData = await client.get(key);
    if (redisData && (count & 1) == 0) {
      console.log("Getting data for redis database");
      count++;
      res.send(redisData);
    } else {
      const users = await userModel.find({});
      await client.set(key, JSON.stringify(users));
      console.log(key);
      client.expire(key, 10);
      console.log(`Getting data from mongoose database, ${count}`);
      count++;
      res.json(users);
    }
  } catch (error) {
    res.json({ error: "Error getting details of the users" });
  }
});

router.post("/", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = await new userModel(req.body);
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.json({ error: "Error creating a new user in the database" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await userModel.findOneAndDelete({
      _id: req.params.id,
    });

    res.json(deletedUser);
  } catch (error) {
    res.json({
      error: "Error deleting the user or no such user exist in the database",
    });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const updateUser = await userModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      req.body,
      {
        new: true,
      }
    );
    res.json(updateUser);
  } catch (error) {
    res.json({ error: "Error updating the current user" });
  }
});

router.post("/register", async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    const user = await new userModel(req.body);
    await user.save();
    res.json({ username: "User registered Successfully" });
  } catch (error) {
    res.json({ error: "Error registering a new user" });
  }
});

router.get("/login/:username", async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.params.username });
    if (!user) {
      res.json({ error: "No such username exists" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordMatch) {
      res.json({ error: "Password does not match with the username" });
    }

    const token = jwt.sign(
      {
        userid: user._id,
      },
      secretmessage,
      {
        expiresIn: "1h",
      }
    );
    res.json("User logged in successfully");
  } catch (error) {
    res.json({ error: "Login Failed" });
  }
});
module.exports = router;
