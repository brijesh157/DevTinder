const express = require("express");
const validator = require("validator");
const app = express();
const User = require("./models/user")
const { connectDB } = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

//Middle ware to parse to JS object
app.use(express.json());

app.post("/user", async (req, res) => {

    const data = req.body;
    const saltRounds = 10;
    // Creating a new instance of the User model.

    try {
        validateSignUpData(data);
        const password = data.password;
        const hashedPassword = await bcrypt.hash(password, 10);
        data.password = hashedPassword;
        const user = new User(data);
        await user.save();
        res.send("User created successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

app.post("/login", async (req, res) => {

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
        res.send("Login Successful!!");
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }

})

app.get("/user", async (req, res) => {

    try {
        const userId = req.query?.userId;
        const users = await User.find({ $or: [{ _id: userId }, {}] });
        res.send(users);
    }
    catch (err) {
        res.status(404).send("Something went wrong " + err.message);
    }
})


app.patch("/user", async (req, res) => {
    const data = req.body;
    const ALLOWED_UPDATES = [
        "firstName",
        "emailId",
        "Age",
        "Gender"
    ];
    try {
        const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
        if (!isUpdateAllowed) {
            throw new Error("Update Not allowed");
        }
        //While querying DB, we always pass data in form of js object;
        const user = await User.findOneAndUpdate({ emailId: data.emailId }, data, { runValidators: true });

        if (!user) { // When user try to update emailId as well
            throw new Error("User not found");
        }
        res.send(user.firstName + " User updated successfully");
    }
    catch (err) {
        res.status(400).send("Someting went wrong " + err);
    }
})

app.delete("/user", async (req, res) => {

    const emailId = req.body.emailId;
    try {
        const user = await User.findOneAndDelete({ emailId: emailId });
        if (!user) {
            throw new Error("User not found");
        }
        res.send(user + " User deleted successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

connectDB().
    then(() => {
        console.log("DB connected successfully");
        app.listen(3000, () => {
            console.log("Listening on port 3000");
        })
    }).
    catch((err) => {
        console.error("Error connecting DB" + err.message);
    })
