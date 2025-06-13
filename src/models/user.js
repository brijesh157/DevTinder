const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    emailId: {
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
        required: true,
        enum: {
            values: ["Male", "Female", "Others"],
            message: (props) => `${props.value} is not correct gender type`
        }
        // validate(data) {
        //     if (!["Male", "Female", "Others"].includes(data)) {
        //         throw new Error("Gender data is not correct");
        //     }
        // }
    }
}, { timestamps: true });

const UserModel = mongoose.model("user", UserSchema);
// Here we are passing the collection name. Mongoose automatically pluralises and lowercases collection name.

module.exports = UserModel;