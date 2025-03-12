const User = require('../models/user.model');
const Diary = require('../models/diary.model');

// search for users
module.exports.searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ success: false, message: 'query is required' });
        }

        const users = await User.find({ username: new RegExp(query, 'i') });
        res.status(200).json({ success: true, results: users });
    } catch (error) {
        console.error('error during user search:', error);
        res.status(500).json({ success: false, message: 'error searching for users' });
    }
};

// search for diaries
module.exports.searchDiaries = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({ success: false, message: 'query is required' });
        }

        // search for diaries based on the title or description
        const diaries = await Diary.find({
            $or: [
                { title: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ]
        }).populate('author', 'username');

        res.status(200).json({ success: true, results: diaries });
    } catch (error) {
        console.error('error during diary search:', error);
        res.status(500).json({ success: false, message: 'error searching for diaries' });
    }
};