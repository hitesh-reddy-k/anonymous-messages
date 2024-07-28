const Message = require("../databasemodel/messagemodel");
const User = require("../databasemodel/usermodel")
const path = require('path');

exports.uploadMessage = async (req, res) => {
    try {
        const { reserverId } = req.params; 
        const { message } = req.body;
        
        if (!reserverId || !message) {
            console.log("Validation error: missing fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        const newMessage = new Message({ reserverId, message });
        await newMessage.save();

        console.log("Message saved:", newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error uploading message:", error);
        res.status(500).json({ error: "Server error" });
    }
};


exports.getMessages = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log("Fetching messages for user:", userId)

        const messages = await Message.find({ reserverId: userId }).populate('reserverId', 'username email');
        console.log("Fetched messages:", messages);

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error getting messages:", error);
        res.status(500).json({ error: "Server er1ror" });
    }
};

exports.getUsername = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log("Fetching username for User ID:", userId); 

        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found for ID:", userId); 
            return res.status(404).json({ error: "User not found" });
        }

        console.log("User found:", user); // Debugging
        res.status(200).json({ username: user.Username });
    } catch (error) {
        console.error("Error getting username:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.handleLinkClick = async (req, res) => {
    try {
        const { reserverId } = req.params;
        console.log("Redirecting to send message page for User ID:", reserverId);

        const user = await User.findById(reserverId);
        if (!user) {
            console.log("User not found for ID:", reserverId);
            return res.status(404).json({ error: "User not found" });
        }

        res.redirect(`/sendMessage/${reserverId}`);
    } catch (error) {
        console.error("Error handling link click:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.handleLinkClick = async (req, res) => {
    try {
        const { reserverId } = req.params;
        console.log("Redirecting to send message page for User ID:", reserverId);

        const user = await User.findById(reserverId);
        if (!user) {
            console.log("User not found for ID:", reserverId);
            return res.status(404).json({ error: "User not found" });
        }

        res.redirect(`/anyonemessage.html?reserverId=${reserverId}`);
    } catch (error) {
        console.error("Error handling link click:", error);
        res.status(500).json({ error: "Server error" });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { reserverId } = req.params;
        const { message } = req.body;

        if (!reserverId || !message) {
            console.log("Validation error: missing fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        const newMessage = new Message({ reserverId, message });
        await newMessage.save();

        console.log("Message saved:", newMessage);
        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ error: "Server error" });
    }
};




