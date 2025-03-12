const { customAlphabet } = require('nanoid');
const Diary = require('../models/diary.model');
const Entry = require('../models/entry.model');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
const nanoid = customAlphabet(alphabet, 7); // id length 7


module.exports.generateShortDiaryId = async () => {
    let id, exists;
    do {
        id = nanoid();
        // console.log(`generated diary id: ${id}, type of id: ${typeof id}`); // DEBUG
        try {
            exists = await Diary.exists({ diaryId: id }); // check if the id already exists in the db
        } catch (error) {
            console.error('error accessing the database:', error);
            throw error;
        }
    } while (exists);

    return id;
};

module.exports.generateShortEntryId = async () => {
    let id, exists;
    do {
        id = nanoid();
        // console.log(`generated entry id: ${id}, type of id: ${typeof id}`); // DEBUG
        try {
            exists = await Entry.exists({ entryId: id }); // check if the id already exists in the db
        } catch (error) {
            console.error('Error accessing the database:', error);
            throw error;
        }
    } while (exists);

    return id;
};