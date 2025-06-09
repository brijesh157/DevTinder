
const mongoose = require("mongoose");

const URI = "mongodb://127.0.0.1:27017/DevTinder"

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
    }
    catch (err) {
        console.log("Error connecting DB" + err.message);
    }
}


module.exports = { connectDB };