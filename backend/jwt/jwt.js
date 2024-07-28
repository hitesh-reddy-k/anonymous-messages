const jwt = require('jsonwebtoken');

const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken();

    const options = {
        expiresIn: '140d',
        httpOnly: true,
    };

    res.status(statusCode)
       .cookie("token", token, options)
       .json({
            success: true,
            user: {
                id: user._id,
                username: user.Username,
                email: user.Email,
                role: user.role
            },
            token,
        });
};

module.exports = sendToken;
