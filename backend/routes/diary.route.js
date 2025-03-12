module.exports = app => {
    const diary = require("../controllers/diary.controller");
    const dmw = require("../middlewares/diary.middleware");
    const router = require("express").Router();

    // get 
    router.get("/", diary.getAllDiaries); // get all diaries
    router.get("/diary/:diaryId", diary.getDiaryById); // get diary by id
    router.get("/diary/:diaryId/entries", diary.getAllEntriesForDiary); // get all entries for a specific diary
    router.get("/diary/:diaryId/entries/:entryId", diary.getEntryById); // get entry by id
    router.get("/recent", diary.getRecentDiaries); // get recently added entries

    // post
    router.post("/create", dmw.createDiaryVerification, diary.createDiary); // create new diary
    router.post("/entries/add", dmw.addEntryVerification, diary.addEntryToDiary); // add entry to specific diary
    router.post("/diary/:diaryId/like", diary.likeDiary); // like a diary
    router.post("/diary/:diaryId/dislike", diary.dislikeDiary); // dislike a diary
    router.post("/diary/:diaryId/entries/:entryId/like", diary.likeEntry); // like an entry
    router.post("/diary/:diaryId/entries/:entryId/dislike", diary.dislikeEntry); // dislike an entry

    // delete
    router.delete("/diary/:diaryId/entries/:entryId", dmw.deleteEntryVerification, diary.deleteEntry); // delete entry
    router.delete("/diary/:diaryId", dmw.deleteDiaryVerification, diary.deleteDiary); // delete diary

    app.use("/diaries", router);
}