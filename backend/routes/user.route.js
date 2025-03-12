module.exports = app => {
    const user = require("../controllers/user.controller");
    const router = require("express").Router();
    const upload = require("../config/multer.config");

    // get 
    router.get("/", user.getAllUsers); // get all users
    router.get("/:userId", user.getUserById); // get user by id
    router.get("/:userId/diaries", user.getUserDiaries); // get a specific user's diaries
    router.get("/username/:username", user.getUserByUsername); // get user by username
    router.get("/username/:username/diaries", user.getDiariesByUsername); // get a specific user's diaries by username
    router.get("/:username/profile-picture", user.getUserProfilePicture); // get user's profile picture
    router.get('/check-username/:username', user.checkUsername); // check if username exists

    // post
    router.post("/:username/profile-picture", upload.single('profilePicture'), user.uploadProfilePicture); // upload profile picture

    // put
    router.put("/:username/username", user.updateUsername); // update user's username

    // delete
    //router.delete(); // deletes user

    app.use("/users", router);
}