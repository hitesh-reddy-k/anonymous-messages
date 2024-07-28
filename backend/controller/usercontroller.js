const express = require("express");
const User = require("../databasemodel/usermodel");
const sendToken = require("../jwt/jwt");
const crypto = require("crypto");
const Feedback = require('../databasemodel/feedbackmodel');

const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
  try {
      const { Username, password, conformpassword, email, role } = req.body;

      // Basic validation
      if (!Username || !password || !conformpassword || !email) {
          return res.status(400).json({ message: 'All fields are required' });
      }

      if (password !== conformpassword) {
          return res.status(400).json({ message: 'Passwords do not match' });
      }

      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
      }

      // Create new user
      const user = await User.create({ Username, password, conformpassword, email, role });

      // Generate JWT token
      const token = user.getJWTToken();
      res.status(201).json({
          success: true,
          token,
          user,
      });
  } catch (err) {
      console.error('Error creating the account:', err.message);
      res.status(500).json({ message: "Error creating the account", error: err.message });
  }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Please enter valid email and password' });

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({ message: 'Email or password are wrong.' });
        }

        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Email or password are wrong.' });
        }

    
        sendToken(user, 200, res);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.logout = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Your account has been logged out"
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: "An error occurred",
    });
  }
};


exports.getmeUser = async (req, res, next) => {
  const users = await User.findById(req.user.id).select("-password").select("-conformpassword")

  res.status(200).json({
    success: true,
    users, 
  });
};

exports.getallUser = async (req, res, next) => {
  const users = await User.find().select("-password").select("-conformpassword");

  res.status(200).json({
    success: true,
    users,
  });
};

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    // const { token } = req.cookies;
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      console.log("Token not found");
      return res.status(401).send("Unauthorized: Token not found");
    }
    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    
    next();
  } catch (error) {
    console.error("Error in isAuthenticatedUser middleware:", error.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not allowed" });
    }
    next();
  };
};

exports.updateusername = async (req, res, next) => {
  try {
      const { Username } = req.body;

      if (!Username) {
          return res.status(400).json({ message: 'Username is required' });
      }

      req.user.Username = Username;
      const updatedUser = await req.user.save();

      res.status(200).json({ 
          success: true,
          message: 'Username updated successfully',
          user: updatedUser 
      });
  } catch (error) {
      console.error('Error updating username:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

exports.updatepassword = async (req,res,next) =>{
  try {
    const { password } = req.body;
    if (!password) {
        return res.status(400).send({ message: 'Password is required' });
    }
    req.user.password = password;
    await req.user.save();
    res.send({ message: 'Password updated successfully', user: req.user });
} catch (error) {
    res.status(500).send({ message: 'Server error', error });
}
}

exports.makeAdmin = async(req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = 'ADMIN';
    await user.save();
    
    res.status(200).json({ message: 'User promoted to admin successfully' });
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


exports.deleteUser = async (req, res) => {
  try {
      const userId = req.user.id;
      console.log("Deleting user with ID:", userId);
      await User.findByIdAndDelete(userId);
      res.status(200).json({
          success: true,
          message: "Account deleted successfully"
      });
  } catch (error) {
      console.error('Error deleting the account:', error.message);
      res.status(500).json({
          success: false,
          message: "Error deleting the account",
          error: error.message
      });
  }
};



// Feedback submission
exports.feedbackForm = async (req, res) => {
  const userId = req.user.id;
  const { rating, comment } = req.body;

  if (comment.split(' ').length < 10) {
    return res.status(400).json({ success: false, message: 'Feedback must be at least 10 words.' });
  }

  try {
    const existingFeedback = await Feedback.findOne({ user: userId });
    if (existingFeedback) {
      return res.status(400).json({ success: false, message: 'User has already submitted feedback.' });
    }

    const feedback = new Feedback({
      user: userId,
      rating,
      comment,
    });

    await feedback.save();
    res.status(200).json({ success: true, message: 'Feedback submitted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.', error: error.message });
  }
};