const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email address is required"],
        unique: true
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profilePicture: {
        type: String, // path to the profile picture
        default: 'uploads/profile-pics/default.jpg'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date, // token expiration time
    isVerified: { // tracks if user is verified
        type: Boolean,
        default: false
    },
    signupToken: String,
    signupTokenExpires: Date // token expiration time
});

// password encryption
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour expiration time

    return resetToken;
};

// generate signup token
userSchema.methods.generateSignupToken = function () {
    const signupToken = crypto.randomBytes(32).toString('hex');

    this.signupToken = crypto.createHash('sha256').update(signupToken).digest('hex');
    this.signupTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours expiration time

    return signupToken;
};

module.exports = mongoose.model("User", userSchema);