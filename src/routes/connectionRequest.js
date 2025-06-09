const express = require('express');
const connectionRequestRouter = express.Router();
const connectionRequest = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/userAuth");
const User = require("../models/user");

connectionRequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const status = req.params.status;
        const toUserId = req.params.toUserId;
        const loggedInUser = req.user;

        const allowedStatuses = ["ignored", "interested"];
        if (!allowedStatuses.includes(status)) {
            throw new Error("Please give valid status");
        }
        const toUser = await User.findOne({ _id: toUserId });
        if (!toUser) {
            throw new Error("toUser not found");
        }
        const query = {
            $or: [{
                fromUserId: loggedInUser._id,
                toUserId: toUserId._id
            }, {
                fromUserId: toUserId._id,
                toUserId: loggedInUser._id
            }]
        };
        const existingConnectionRequest = await connectionRequest.findOne(query);
        if (existingConnectionRequest) {
            throw new Error("Connection already exist");
        }
        if (loggedInUser._id.toString() === toUser._id.toString()) {
            throw new Error("LoggedIn User can't be same as toUser");
        }
        const connectionrequest = {
            fromUserId: loggedInUser._id,
            toUserId: toUser._id,
            status: status
        }
        const Connection = new connectionRequest(connectionrequest);
        await Connection.save();
        res.status(200).send(loggedInUser.firstName + " is interested in " + toUser.firstName);
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

module.exports = connectionRequestRouter;