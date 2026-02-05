const express = require("express");
const chatController = require("../controllers/chatController.js");

const { isAuthenticated } = require("../middlewares/authMiddleware.js");

const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router();

// Chat route
router.post("/", isAuthenticated, wrapAsync(chatController.chat));

module.exports = router;
