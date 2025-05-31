const jwt = require("jsonwebtoken");
const User = require("../models/user");

const ValidateToken = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).send("Please login first");
    }
    const decodedMsg = await jwt.verify(token, "DEV@TINDER$123");
    const user = await User.findById({ _id: decodedMsg._id });
    //When user is deleted from DB and we are validating token.(Token is present in cookie)
    if (!user) {
        res.status(400).send("User not found");
    }
    req.user = user;
    next();
}


module.exports = { ValidateToken };
