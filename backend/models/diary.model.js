const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
    diaryId: {
        type: String,
        required: [true, "Diary id is required"],
        unique: true
    },
    title: {
        type: String,
        required: [true, "Diary title is required"],
        maxlength: [100, "Diary title cannot exceed 100 characters"]
    },
    description: {
        type: String,
        maxlength: [200, "Diary description cannot exceed 200 characters"]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    entries: [{
        type: String,
        ref: 'Entry', // reference to the Entry model
    }],
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // reference to the User model
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Diary", diarySchema);