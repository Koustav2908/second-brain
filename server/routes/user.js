const express = require("express");
const userController = require("../controllers/user.js");
const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router();

router.post("/signup", wrapAsync(userController.signup));
router.post("/login", wrapAsync(userController.login));
router.post("/logout", wrapAsync(userController.logout));

module.exports = router;
