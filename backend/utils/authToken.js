require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.createAuthToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: 3 * 24 * 60 * 60, // token expiration date
    });
};