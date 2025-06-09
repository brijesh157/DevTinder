const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParser = require("cookie-parser");


//Middle ware to parse to JS object
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/connectionRequest");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);


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
