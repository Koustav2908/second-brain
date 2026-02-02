const express = require("express");
const userController = require("../controllers/userController.js");

const { validateUser } = require("../middlewares/validateUserMiddleware.js");

const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router();

// Signup a user
router.post("/signup", validateUser, wrapAsync(userController.signup));

// Login a user
router.post("/login", wrapAsync(userController.login));

// Logout a user
router.post("/logout", userController.logout);

module.exports = router;
