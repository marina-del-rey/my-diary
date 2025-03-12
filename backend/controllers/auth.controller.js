const User = require("../models/user.model");
const { createAuthToken } = require("../utils/authToken");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
const Mailgun = require('mailgun.js');
const formData = require('form-data');

// read .env file
require("dotenv").config();

module.exports.signup = async (req, res, next) => {
    try {
        const { email, username, password, createdAt } = req.body;

        // check if email already exists 
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.json({ message: "email already in use" });
        }

        // check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.json({ message: "username already in use" });
        }

        const user = await User.create({ email, username, password, createdAt });

        const signupToken = user.generateSignupToken();
        await user.save();

        // send verification email
        const verificationUrl = `https://mydiary.digital/verify-email/${signupToken}`;
        // console.log(verificationUrl); // DEBUG

        // mailgun setup
        const { MAILGUN_API_KEY, DOMAIN } = process.env;

        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY, url: 'https://api.eu.mailgun.net' });

        mg.messages.create(`${DOMAIN}`, {
            from: `No-reply <no-reply@${DOMAIN}>`,
            to: user.email,
            subject: "Complete your My Diary registration",
            text: `To activate your My Diary account, please register through the link below:
            ${verificationUrl}
            If you did not initiate this request, you can safely ignore this email.`,
            html: `
                <p>Hello ${user.username},</p>
                <p>To activate your My Diary account, please register through the link below:</p>
                <p><a href="${verificationUrl}">Click here to register</a></p>
                <p>If you did not initiate this request, you can safely ignore this email.</p>`
        })
            .then(msg => console.log(msg)) // logs response data
            .catch(err => console.log(err)); // logs any error

        return res.status(201).json({ message: "user signed up successfully. please verify your email to log in.", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "error with user sign up" });
    }
};


module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // check if no fields are empty
        if (!email || !password) {
            return res.json({ message: "all fields are required" });
        }

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "wrong email" });
        }

        if (!user.isVerified) {
            return res.json({ message: "email isn't verified" });
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            return res.json({ message: "wrong password" });
        }

        const token = createAuthToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
            path: '/',
            sameSite: 'lax'
        });
        res.status(201).json({ message: "user logged in successfully", success: true, user });
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "error with user login" });
    }
};


module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', { path: '/' });
        res.status(200).json({ message: 'user logged out successfully', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error logging out user' });
    }
};


module.exports.recoverPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'user with that email not found' });
        }

        // generate a reset token
        const resetToken = user.generatePasswordResetToken();
        await user.save();
        const resetUrl = `https://mydiary.digital/reset-password/${resetToken}`;

        // mailgun setup
        const { MAILGUN_API_KEY, DOMAIN } = process.env;

        const mailgun = new Mailgun(formData);
        const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY, url: 'https://api.eu.mailgun.net' });

        mg.messages.create(`${DOMAIN}`, {
            from: `No-reply <no-reply@${DOMAIN}>`,
            to: user.email,
            subject: "My Diary password reset",
            text: `You are receiving this email because you (or someone else) requested the reset of a password.
            Please click on the following link, or paste this into your browser to complete the process:
            ${resetUrl}`,
            html: `
                <p>Hello ${user.username},</p>
                <p>You are receiving this email because you (or someone else) requested the reset of a password.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <p><a href="${resetUrl}">Reset Password</a></p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
        })
            .then(msg => console.log(msg)) // logs response data
            .catch(err => console.log(err)); // logs any error

        return res.json({ success: true, message: 'password reset email sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error with password recovery' });
    }
};


module.exports.validateRecoveryToken = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.json({ success: false, message: 'token is invalid or has expired.' });
    }

    // update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ success: true, message: 'password has been reset successfully.' });
};


module.exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            signupToken: hashedToken,
            signupTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'token is invalid or has expired.' });
        }

        // mark the user as verified
        user.isVerified = true;
        user.signupToken = undefined;
        user.signupTokenExpires = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'email verified successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error verifying email.' });
    }
};
