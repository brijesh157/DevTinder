const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/userAuth");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

// profileRouter.get("/profile/view", ValidateToken, async (req, res) => {
//     try {
//         const userId = req.query?.userId;
//         const users = await User.find({ $or: [{ _id: userId }, {}] });
//         res.send(users);
//     }
//     catch (err) {
//         res.status(400).send("Something went wrong " + err.message);
//     }
// })

profileRouter.get("/profile/view", userAuth, (req, res) => {
    const user = req.user;
    res.send(user);
})


profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        //TO DO refactoring here
        const ALLOWED_UPDATES = [
            "firstName",
            "lastName",
            "age"
        ]
        const data = req.body;
        const flag = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!flag)
            throw new Error("Updation is not allowed");
        const loggedInUser = req.user;

        //Here, loggedInUser is mongoose document and not a plain object. In that case, 
        // hasOwnProperty() may not behave as expected

        // for (let key in data) {
        //     if (key in user) {
        //         loggedInUser[key] = data[key];
        //     }
        // }

        Object.keys(data).forEach((key) => {
            loggedInUser[key] = data[key];
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
        const loggedInUser = req.user;
        const data = req.body;
        const validate = await bcrypt.compare(data.oldPassword, loggedInUser.password);
        if (!validate)
            throw new Error("Old Password is wrong");
        if (!validator.isStrongPassword(data.newPassword))
            throw new Error("New password is not strong");

        const newHashedPassword = await bcrypt.hash(data.newPassword, 10);
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
        const user = req.user;
        const data = await User.findByIdAndDelete(user._id);
        res.status(200).json({
            "message": "user deleted successfully",
            "user": {
                userFirstName: data.firstName
            }
        })
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

module.exports = profileRouter;