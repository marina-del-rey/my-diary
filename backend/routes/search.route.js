module.exports = app => {
    const search = require("../controllers/search.controller");
    const router = require("express").Router();

    // get
    router.get("/users", search.searchUsers); // search for users
    router.get("/diaries", search.searchDiaries); // search for diaries

    app.use("/search", router)
}