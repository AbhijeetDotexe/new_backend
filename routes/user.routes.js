// username, fullname, email, passoword
const express = require("express");
const router = express.Router();
const userModel = require("../model/user.model");
const bcrypt = require('bcrypt');
const saltRounds = 5;

router.get("/", async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json(users);
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
})

router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await userModel.findOneAndDelete({
            _id: req.params.id
        })

        res.json(deletedUser);
    } catch (error) {
        res.json({ error: "Error deleting the user or no such user exist in the database" });
    }
})

router.patch("/:id", async (req, res) => {
    try {
        const updateUser = await userModel.findOneAndUpdate({
            _id: req.params.id
        }, req.body, {
            new: true
        })
        res.json(updateUser);
    } catch (error) {
        res.json({ error: "Error updating the current user" });
    }
})

module.exports = router;