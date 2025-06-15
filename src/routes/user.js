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

userRouter.get("/requests/receieved", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const data = await ConnectionRequest.find({ toUserId: loggedInUser._id, status: "interested" })
            .populate("fromUserId", ["firstName", "lastName"]);
        const result = data.map(row => row.fromUserId);
        res.status(200).send(result);
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

userRouter.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const query = [{ fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" }]
        const data = await ConnectionRequest.find({ $or: query })
            .populate("fromUserId", ["firstName", "lastName"])
            .populate("toUserId", ["firstName", "lastName"])
            .select('fromUserId toUserId');

        // const result = data.map((row) => {
        //     if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        //         return row.toUserId;
        //     }
        //     else {
        //         return row.fromUserId;
        //     }
        // });

        res.status(200).send(data);
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

module.exports = userRouter;

