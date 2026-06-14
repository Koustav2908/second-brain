const express = require("express");
const chatController = require("../controllers/chatController.js");

const { validate } = require("../middlewares/validateMiddleware.js");
const { chatSchema } = require("../schemas/chatSchema.js");
const { isAuthenticated } = require("../middlewares/authMiddleware.js");
const { isSessionOwner } = require("../middlewares/ownershipMiddleware.js");
const { validateObjectId } = require("../middlewares/objectIdMiddleware.js");

const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router();

// Chat route
router.post(
    "/:sessionId/chat",
    isAuthenticated,
    validateObjectId("sessionId"),
    isSessionOwner,
    validate(chatSchema),
    wrapAsync(chatController.chat),
);

router.get(
    "/:sessionId/messages",
    isAuthenticated,
    validateObjectId("sessionId"),
    isSessionOwner,
    wrapAsync(chatController.messages),
);

module.exports = router;
