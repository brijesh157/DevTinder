
const mongoose = require("mongoose");

const URI = "mongodb://127.0.0.1:27017/DevTinder"

const connectDB = async () => {
    await mongoose.connect(URI);
}


module.exports = { connectDB };