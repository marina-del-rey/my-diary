const User = require("../models/user.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userAuthVerification = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false, message: "token not found" });
    }

    // check if tokens match 
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.json({ status: false });
        } else {
            const user = await User.findById(data.id);
            if (user) {
                return res.json({ status: true, user: user.username });
            } else {
                return res.json({ status: false });
            }
        }
    })
}

// verifies if user is authed before logging them out
module.exports.logoutVerification = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false, message: "token not found" });
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.json({ status: false });
        } else {
            const user = await User.findById(data.id);
            if (user) {
                // user is authenticated
                next();
            } else {
                return res.json({ status: false });
            }
        }
    });
}