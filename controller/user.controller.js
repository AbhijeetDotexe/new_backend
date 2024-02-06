const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 5;
const secretmessage = "This is just for testing";
const client = require("../db/redis");

let count = 1;

const getUsers = async (req, res) => {
  try {
    const key = `UserData: detailsofalltheusers`;
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
};

const createUser = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    const newUser = await new userModel(req.body);
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.json({ error: "Error creating a new user in the database" });
  }
};

const deleteUser = async (req, res) => {
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
};

const updateUser = async (req, res) => {
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
};

const register = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    const user = await new userModel(req.body);
    await user.save();
    res.json({ username: "User registered Successfully" });
  } catch (error) {
    res.json({ error: "Error registering a new user" });
  }
};

const login = async (req, res) => {
  console.log(req.query);
  try {
    const email = req.query.email;
    const user = await userModel.findOne({ email: email });
    console.log(user);
    if (!user) {
      res.json({ error: "No such username exists" });
    } else {
      const passwordMatch = await bcrypt.compare(
        req.query.password,
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
      res.send({ user: token });
    }
  } catch (error) {
    res.json({ error: "Login Failed" });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  updateUser,
  createUser,
  register,
  login,
};
