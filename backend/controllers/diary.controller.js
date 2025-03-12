const Diary = require("../models/diary.model");
const Entry = require("../models/entry.model");
const { generateShortDiaryId, generateShortEntryId } = require("../utils/generateId");

// get all diaries
module.exports.getAllDiaries = async (req, res) => {
    try {
        const diaries = await Diary.find();
        res.status(200).json({ success: true, diaries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error retrieving all diaries' });
    }
};

// get 25 diaries that have been recently added to
module.exports.getRecentDiaries = async (req, res) => {
    try {
        const uniqueDiaryIds = await Entry.distinct('diary').sort({ createdAt: -1 });

        const diaries = await Diary.find({ diaryId: { $in: uniqueDiaryIds } })
            .sort({ createdAt: -1 })
            .limit(25)
            .populate({
                path: 'author',
                select: 'username',
                model: 'User'
            });

        //console.log(diaries); // DEBUG
        res.status(200).json({ success: true, diaries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error retrieving recent entries' });
    }
};


// get diary by id
module.exports.getDiaryById = async (req, res) => {
    try {
        const { diaryId } = req.params;

        const diary = await Diary.findOne({ diaryId: diaryId });
        if (!diary) {
            return res.status(404).json({ error: 'diary not found' });
        }

        res.status(200).json({ success: true, diary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error retrieving diary' });
    }
};


// get diary's entries
module.exports.getAllEntriesForDiary = async (req, res) => {
    try {
        const { diaryId } = req.params;

        const entries = await Entry.find({ diary: diaryId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, entries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error retrieving entries for diary' });
    }
};

// get entry by id
module.exports.getEntryById = async (req, res) => {
    try {
        const { diaryId, entryId } = req.params;

        const entry = await Entry.findOne({ entryId: entryId, diary: diaryId });
        if (!entry) {
            return res.status(404).json({ error: 'entry not found' });
        }

        res.status(200).json({ success: true, entry });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error retrieving entry' });
    }
};


// create new diary
module.exports.createDiary = async (req, res) => {
    try {
        const { title, description, author } = req.body;
        const diaryId = await generateShortDiaryId();

        // create a new diary
        const newDiary = new Diary({
            diaryId,
            title,
            description,
            author,
            entries: [] // initialize with an empty array of entries
        });

        const savedDiary = await newDiary.save();
        res.status(201).json({ message: "diary created successfully", success: true, savedDiary });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "error creating diary" });
    }
};


// add entry to an existing diary
module.exports.addEntryToDiary = async (req, res) => {
    try {
        const { diaryId, title, content } = req.body;

        const diary = await Diary.findOne({ diaryId: diaryId });
        if (!diary) {
            return res.status(404).json({ error: 'diary not found' });
        }

        const entryId = await generateShortEntryId();

        // create a new diary entry
        const newEntry = new Entry({
            entryId,
            title,
            content,
            diary: diaryId
        });

        const savedEntry = await newEntry.save();
        diary.entries.push(savedEntry.entryId);

        const updatedDiary = await diary.save();
        res.status(201).json({ message: "diary entry created successfully, saved to diary", success: true, updatedDiary, entryId: savedEntry.entryId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "error creating diary entry or adding it to diary" });
    }
};


// delete entry by id 
module.exports.deleteEntry = async (req, res) => {
    try {
        const { entryId, diaryId } = req.params;

        const deletedEntry = await Entry.findOneAndDelete({ entryId: entryId });
        if (!deletedEntry) {
            return res.status(404).json({ message: "entry not found", success: false });
        }

        const diary = await Diary.findOne({ diaryId: diaryId });
        if (!diary) {
            return res.status(404).json({ message: "diary not found", success: false });
        }

        diary.entries.pull(entryId); // remove entry ID from the array
        await diary.save();

        res.status(200).json({ message: "entry deleted successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "error deleting diary entry" });
    }
};


// delete diary by id
module.exports.deleteDiary = async (req, res) => {
    try {
        const { diaryId } = req.params;

        const deletedDiary = await Diary.findOneAndDelete({ diaryId: diaryId });
        const deletedDiaryEntries = await Entry.deleteMany({ diary: diaryId });

        res.status(200).json({ success: true, message: "diary and its entries deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "error deleting diary" });
    }
};

// like a diary
module.exports.likeDiary = async (req, res) => {
    try {
        const { diaryId } = req.params;

        const diary = await Diary.findOne({ diaryId: diaryId });
        if (!diary) {
            return res.status(404).json({ error: 'diary not found' });
        }

        diary.likes += 1;
        await diary.save();

        res.status(200).json({ success: true, likes: diary.likes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error liking diary' });
    }
};

// dislike a diary
module.exports.dislikeDiary = async (req, res) => {
    try {
        const { diaryId } = req.params;

        const diary = await Diary.findOne({ diaryId: diaryId });
        if (!diary) {
            return res.status(404).json({ error: 'diary not found' });
        }

        diary.dislikes += 1;
        await diary.save();

        res.status(200).json({ success: true, dislikes: diary.dislikes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error disliking diary' });
    }
};

// like an entry
module.exports.likeEntry = async (req, res) => {
    try {
        const { entryId } = req.params;

        const entry = await Entry.findOne({ entryId: entryId });
        if (!entry) {
            return res.status(404).json({ error: 'entry not found' });
        }

        entry.likes += 1;
        await entry.save();

        res.status(200).json({ success: true, likes: entry.likes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error liking entry' });
    }
};

// dislike an entry
module.exports.dislikeEntry = async (req, res) => {
    try {
        const { entryId } = req.params;

        const entry = await Entry.findOne({ entryId: entryId });
        if (!entry) {
            return res.status(404).json({ error: 'entry not found' });
        }

        entry.dislikes += 1;
        await entry.save();

        res.status(200).json({ success: true, dislikes: entry.dislikes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error disliking entry' });
    }
};