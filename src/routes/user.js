const express = require('express');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const User = require("../models/user");
const { userAuth } = require("../middlewares/userAuth");

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const query1 = { "$or": [{ fromUserId: loggedInUser._id.toString() }, { toUserId: loggedInUser._id.toString() }] };
        const data = await ConnectionRequest.find(query1);
        const hashSet = new Set();
        data.forEach(connectionrequest => {
            hashSet.add(connectionrequest.toUserId.toString());
            hashSet.add(connectionrequest.fromUserId.toString());
        });
        hashSet.add(loggedInUser._id.toString());
        const idsArray = Array.from(hashSet);
        const users = await User.find({ _id: { $nin: idsArray } });
        res.status(200).send(users);
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

module.exports = userRouter;

