const express = require("express");
const userController = require("../controllers/userController.js");

const { validate } = require("../middlewares/validateMiddleware.js");
const { userSchema } = require("../schemas/userSchema.js");

const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router();

// Signup a user
router.post("/signup", validate(userSchema), wrapAsync(userController.signup));

// Login a user
router.post("/login", wrapAsync(userController.login));

// Logout a user
router.post("/logout", userController.logout);

module.exports = router;
