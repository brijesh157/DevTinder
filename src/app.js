const express = require("express");
const validator = require("validator");
const app = express();
const User = require("./models/user")
const { connectDB } = require("./config/database");

//Middle ware to parse to JS object
app.use(express.json());

app.post("/user", async (req, res) => {

    const data = req.body;
    const email = data.emailId;

    // Creating a new instance of the User model.
    const user = new User(data);

    try {
        if (!validator.isEmail(email)) {
            throw new Error("Invalid Email");
        }
        await user.save();
        res.send("User created successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

app.get("/user", async (req, res) => {

    try {
        const users = await User.find({});
        res.send(users);
    }
    catch (err) {
        res.status(404).send("Something went wrong " + err.message);
    }
})


app.delete("/user", async (req, res) => {

    const emailId = req.body.emailId;
    try {
        await User.findOneAndDelete({ emailId: emailId });
        res.send("User deleted successfully");
    }
    catch (err) {
        res.status(400).send("Something went wrong " + err.message);
    }
})

app.patch("/user", async (req, res) => {
    const emailId = req.body.emailId;
    try {
        const user = await User.findOneAndUpdate({ emailId: emailId }, { age: 12 }, { runValidators: true });

        res.send(user + " User updated successfully");
    }
    catch (err) {
        res.status(400).send("Someting went wrong " + err);
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
