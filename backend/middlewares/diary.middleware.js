const User = require("../models/user.model");
const Diary = require("../models/diary.model");
require("dotenv").config();
const jwt = require("jsonwebtoken");

// ensures that the user is authenticated, authorized, and that 
// the author in the request body matches the authenticated user
module.exports.createDiaryVerification = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false, message: "token not found" });
    }

    // check if tokens match 
    jwt.verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
        if (err) {
            return res.json({ status: false, message: "couldn't verify token" });
        } else {
            const userId = decodedToken.id;
            const user = await User.findById(userId);
            if (user) {
                // check if user's id matches the author id in the request body
                if (req.body.author !== userId) {
                    return res.json({ status: false, message: "user does not have permission to create this diary" });
                }

                // user is authenticated and authorized, and diary exists and is owned by the user
                next();
            } else {
                return res.json({ status: false, message: "user not found" });
            }
        }
    })
}

// checks if the user is authenticated, authorized, and if the specified 
// diary exists and is owned by the user before allowing the addition of an entry to the diary
module.exports.addEntryVerification = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false, message: "token not found" });
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
        if (err) {
            return res.json({ status: false, message: "couldn't verify token" });
        } else {
            const userId = decodedToken.id;
            const user = await User.findById(userId);
            if (user) {
                // check if diary exists and is owned by the user
                const diaryId = req.body.diaryId;
                const diary = await Diary.findOne({ diaryId: diaryId, author: userId });
                if (!diary) {
                    return res.json({ status: false, message: "diary not found or user does not have permission to add an entry to this diary" });
                }

                // user is authenticated and authorized, and diary exists and is owned by the user
                next();
            } else {
                return res.json({ status: false, message: "user not found" });
            }
        }

    })
}


// verifies that the user is authenticated, authorized, the specified diary exists and is owned by 
// the user, and that the entry to be deleted exists within the diary before permitting the deletion
module.exports.deleteEntryVerification = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false, message: "token not found" });
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
        if (err) {
            return res.json({ status: false, message: "couldn't verify token" });
        } else {
            const userId = decodedToken.id;
            const user = await User.findById(userId);
            if (user) {
                // check if diary exists and is owned by the user
                const diaryId = req.params.diaryId;
                const diary = await Diary.findOne({ diaryId: diaryId, author: userId });
                if (!diary) {
                    return res.json({ status: false, message: "diary not found or user does not have permission to delete entries from this diary" });
                }

                // check if the entry to be deleted exists within the diary
                const entryId = req.params.entryId;
                const entryExistsInDiary = diary.entries.includes(entryId);
                if (!entryExistsInDiary) {
                    return res.json({ status: false, message: "entry not found in the specified diary" });
                }

                // user is authenticated and authorized, and diary is owned by the user and entry exists in diary
                next();
            } else {
                return res.json({ status: false, message: "user not found" });
            }
        }
    })
}



module.exports.deleteDiaryVerification = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false, message: "token not found" });
    }

    jwt.verify(token, process.env.TOKEN_KEY, async (err, decodedToken) => {
        if (err) {
            return res.json({ status: false, message: "couldn't verify token" });
        } else {
            const userId = decodedToken.id;
            const user = await User.findById(userId);
            if (user) {
                // check if diary exists and is owned by the user
                const diaryId = req.params.diaryId;
                const diary = await Diary.findOne({ diaryId: diaryId, author: userId });
                if (!diary) {
                    return res.json({ status: false, message: "diary not found or user does not have permission to delete entries from this diary" });
                }

                // user is authenticated and authorized, and diary exists and is owned by the user 
                next();
            } else {
                return res.json({ status: false, message: "user not found" });
            }
        }
    })
}