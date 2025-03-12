const User = require("../models/user.model");
const Diary = require("../models/diary.model");
const path = require('path');
const fs = require('fs');

// get all users
module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error retrieving all diaries' });
    }
};


// get user by id
module.exports.getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password -email');
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error retrieving user' });
    }
};


// get user's diaries
module.exports.getUserDiaries = async (req, res) => {
    try {
        const { userId } = req.params;

        const diaries = await Diary.find({ author: userId });
        res.status(200).json({ success: true, diaries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error retrieving user\'s diaries' });
    }
};


// get user's diaries by username
module.exports.getDiariesByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const userId = await User.find({ username: username }).select('-password -email');
        if (!userId) {
            return res.status(404).json({ error: 'user not found' });
        }

        const diaries = await Diary.find({ author: userId }).sort({ createdAt: -1 });;
        if (!diaries) {
            return res.status(404).json({ error: 'user\'s diaries not found' });
        }

        res.status(200).json({ success: true, diaries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error retrieving user\'s diaries' });
    }
};


// get user by username
module.exports.getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username }).select('-password -email');
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error retrieving user' });
    }
};


// get user's profile picture
module.exports.getUserProfilePicture = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('profilePicture');

        if (!user || !user.profilePicture) {
            return res.status(404).json({ error: 'profile picture not found' });
        }

        // Return the profile picture URL
        const profilePicturePath = path.join(__dirname, '..', user.profilePicture);
        res.sendFile(profilePicturePath);
    } catch (error) {
        console.error('error fetching profile picture:', error);
        res.status(500).json({ error: 'error fetching profile picture' });
    }
};


// upload profile picture
module.exports.uploadProfilePicture = async (req, res) => {
    try {
        const { username } = req.params;

        // check that file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'profile picture is required' });
        }

        const newProfilePicturePath = req.file.path;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        const oldProfilePicture = user.profilePicture;
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { profilePicture: newProfilePicturePath },
            { new: true }
        ).select('-password -email');

        // delete old profile picture
        if (oldProfilePicture && oldProfilePicture !== 'uploads/profile-pics/default.jpg') {
            const oldFilePath = path.join(__dirname, '..', oldProfilePicture);
            fs.unlink(oldFilePath, (err) => {
                if (err) console.error(`failed to delete old profile picture: ${err}`);
            });
        }

        //res.status(200).json({ success: true, user });
        res.status(200).json({ profilePicture: newProfilePicturePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error uploading profile picture' });
    }
};

module.exports.updateUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const { newUsername } = req.body;

        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
            return res.status(400).json({ error: 'username already taken' });
        }

        const updatedUser = await User.findOneAndUpdate(
            { username: username },
            { username: newUsername },
            { new: true }
        ).select('-password -email');

        if (!updatedUser) {
            return res.status(404).json({ error: 'user not found' });
        }

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('error updating username:', error);
        res.status(500).json({ error: 'error updating username' });
    }
};

module.exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.params;

        // check if a user with the provided username exists
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('error checking username:', error);
        return res.status(500).json({ error: 'error checking username' });
    }
};


/**
// get user's diaries
module.exports.getUserDiaries = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        const diaries = await Diary.find({ author: user._id });
        if (!diaries) {
            return res.status(404).json({ error: 'user has no diaries' });
        }

        res.status(200).json({ success: true, diaries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error retrieving user\'s diaries' });
    }
};
*/