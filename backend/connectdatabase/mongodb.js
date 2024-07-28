const mongoose = require("mongoose");
const dotenv = require('dotenv');


dotenv.config({ path: "backend/env/cong.env" });

const URL = "mongodb+srv://hiteshreddyai:OQpE5fmBmplG3vHz@cluster0.7y2jqod.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const Connect = async () => {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            connectTimeoutMS: 30000, 
            socketTimeoutMS: 45000,
        });
        console.log(`MongoDB connected successfully: ${URL}`);
        
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`); // Log the actual error message
    }
};

module.exports = Connect;
