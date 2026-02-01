const express = require("express");
const userController = require("../controllers/userController.js");
const { validateUser } = require("../middlewares/validateUserMiddleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router();

router.post("/signup", validateUser, wrapAsync(userController.signup));
router.post("/login", wrapAsync(userController.login));
router.post("/logout", userController.logout);

module.exports = router;
