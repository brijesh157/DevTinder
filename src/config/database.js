
const mongoose = require("mongoose");

const URI = "mongodb+srv://brijeshujcbm:database@cluster0.nt6bnuf.mongodb.net/DevTinder"

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
    }
    catch (err) {
        console.log("Error connecting DB" + err.message);
    }
}


module.exports = { connectDB };