const express = require("express");
const authRouter = express.Router();
const { ValidateToken } = require("../middlewares/auth");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {

    const data = req.body;
    const saltRounds = 10;

    try {
        validateSignUpData(data);
        const password = data.password;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        data.password = hashedPassword;

        // Creating a new instance of the User model.
        const user = new User(data);

        await user.save();
        res.send("User created successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

authRouter.post("/login", async (req, res) => {

    const data = req.body;

    try {
        const emailId = data.emailId;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("User doesn't exist with this email id");
        }
        const password = data.password;
        const hashedPasswordFromDB = user.password;
        const flag = await bcrypt.compare(password, hashedPasswordFromDB);
        if (!flag) {
            throw new Error("Password is incorrect");
        }

        //console.log(user._id);
        //This will print id of user in form of objectId;
        //console.log(user._id.toString());
        //This will print only the id.

        const token = await jwt.sign({ _id: user._id }, "DEV@TINDER$123");
        res.cookie("token", token);
        res.send("Login Successful!!");
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }

})

authRouter.post("/logout", ValidateToken, (req, res) => {
    res.cookie("token", null, { expires: new Date() });
    res.send("Logged out successfully");
})

module.exports = authRouter;

