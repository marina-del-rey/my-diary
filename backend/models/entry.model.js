const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
    entryId: {
        type: String,
        required: [true, "Entry id is required"],
        unique: true
    },
    title: {
        type: String,
        required: [true, "Entry title is required"],
        maxlength: [100, "Entry title cannot exceed 100 characters"]
    },
    content: {
        type: String,
        required: [true, "Entry content is required"]
    },
    diary: {
        type: String,
        ref: 'Diary', // reference to the Diary model
        required: true
    },
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

module.exports = mongoose.model("Entry", entrySchema);