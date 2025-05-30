const express = require("express");
const profileRouter = express.Router();
const { ValidateToken } = require("../middlewares/auth");
const User = require("../models/user");

profileRouter.get("/user", ValidateToken, async (req, res) => {
    try {
        const userId = req.query?.userId;
        const users = await User.find({ $or: [{ _id: userId }, {}] });
        res.send(users);
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

profileRouter.get("/profile", ValidateToken, (req, res) => {
    const user = req.user;
    res.send(user);
})

module.exports = profileRouter;