module.exports = app => {
    const auth = require("../controllers/auth.controller");
    const authmw = require("../middlewares/auth.middleware");
    const router = require("express").Router();

    router.post("/signup", auth.signup);
    router.post("/login", auth.login);
    router.post("/logout", authmw.logoutVerification, auth.logout);
    router.post("/", authmw.userAuthVerification);
    router.post("/forgot-password", auth.recoverPassword);
    router.post("/reset-password/:token", auth.validateRecoveryToken);
    router.get("/verify-email/:token", auth.verifyEmail);

    app.use("/auth", router);
}