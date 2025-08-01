const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

profileRouter.get("/users", userAuth, async (req, res) => {
    try {
        const userId = req.query?.userId;
        let query1 = {};
        if (userId !== undefined) {
            query1 = { _id: userId };
        }
        const users = await User.find(query1);
        res.send(users);
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

profileRouter.get("/profile/view", userAuth, (req, res) => {
    const loggedInUser = req.user;
    res.send(loggedInUser);
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        //TO DO refactoring here
        const ALLOWED_UPDATES = [
            "firstName",
            "lastName",
            "age"
        ]
        const inputData = req.body;
        const flag = Object.keys(inputData).every((k) => ALLOWED_UPDATES.includes(k));
        if (!flag)
            throw new Error("Updation is not allowed");
        const loggedInUser = req.user;

        //Here, loggedInUser is mongoose document and not a plain object. In that case, 
        // hasOwnProperty() may not behave as expected

        // for (let key in inputData) {
        //     if (key in user) {
        //         loggedInUser[key] = inputData[key];
        //     }
        // }

        Object.keys(inputData).forEach((key) => {
            loggedInUser[key] = inputData[key];
        })
        await loggedInUser.save();

        res.json({
            "user": {
                "firstName": loggedInUser.firstName,
                "message": "user updated successfully"
            }
        })
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

profileRouter.patch("/profile/edit/password", userAuth, async (req, res) => {
    try {
        const inputData = req.body;
        const loggedInUser = req.user;
        const validate = await bcrypt.compare(inputData.oldPassword, loggedInUser.password);
        if (!validate)
            throw new Error("Old Password is wrong");
        if (!validator.isStrongPassword(inputData.newPassword))
            throw new Error("New password is not strong");

        const newHashedPassword = await bcrypt.hash(inputData.newPassword, 10);
        loggedInUser.password = newHashedPassword;
        loggedInUser.save();
        res.status(200).json({ "message": "password updated successfully" });
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

profileRouter.delete("/profile/delete", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const userAfterDeletion = await User.findByIdAndDelete(loggedInUser._id);
        res.status(200).json({
            "message": "user deleted successfully",
            "user": {
                userFirstName: userAfterDeletion.firstName
            }
        })
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

// Why forget password is post and updating password is patch.
profileRouter.post("/forgetPassword", async (req, res) => {
    try {
        const emailId = req.body.emailId;
        const user = await User.findOne({ emailId: emailId });
        //TO DO Mobile Number based OTP authentication
        if (!user) {
            throw new Error("User not found");
        }
        const newPassword = req.body.newPassword;
        if (!validator.isStrongPassword(newPassword)) {
            throw new Error("Entered password is not strong");
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = newHashedPassword;
        await user.save();
        res.status(200).send("Password changed successfully");
    }
    catch (err) {
        res.status(404).send("Something went wrong " + err.message);
    }
})

module.exports = profileRouter;