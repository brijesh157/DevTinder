const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    EmailId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        min: 18,
        max: 35,
        required: true
    },
    gender: {
        type: String,
        min: 18,
        max: 40,
        required: true
    }
}, { timestamps: true });

const UserModel = mongoose.model("user", UserSchema);
// Here we are passing the collection name. Mongoose automatically pluralises and lowercases collection name.

module.exports = UserModel;