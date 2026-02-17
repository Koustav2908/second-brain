const express = require("express");
const chatSessionController = require("../controllers/chatSessionController.js");

const { validate } = require("../middlewares/validateMiddleware.js");
const { chatSessionSchema } = require("../schemas/chatSessionSchema.js");
const { isAuthenticated } = require("../middlewares/authMiddleware.js");
const { isSessionOwner } = require("../middlewares/ownershipMiddleware.js");
const { validateObjectId } = require("../middlewares/objectIdMiddleware.js");

const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router();

// Create new chat session
router.post(
    "/",
    isAuthenticated,
    validate(chatSessionSchema),
    wrapAsync(chatSessionController.create),
);

// Get all chats of a user
router.get("/", isAuthenticated, wrapAsync(chatSessionController.index));

// Get all soft-deleted chats of a user
router.get(
    "/trash",
    isAuthenticated,
    wrapAsync(chatSessionController.trashIndex),
);

// Get a single chat session
router.get(
    "/:sessionId",
    isAuthenticated,
    validateObjectId("sessionId"),
    isSessionOwner,
    wrapAsync(chatSessionController.show),
);

// Rename session
router.patch(
    "/:sessionId",
    isAuthenticated,
    validateObjectId("sessionId"),
    isSessionOwner,
    validate(chatSessionSchema),
    wrapAsync(chatSessionController.rename),
);

// Soft delete a session
router.delete(
    "/:sessionId",
    isAuthenticated,
    validateObjectId("sessionId"),
    isSessionOwner,
    wrapAsync(chatSessionController.softDestroy),
);

// Restore a session if deleted softly
router.patch(
    "/:sessionId/restore",
    isAuthenticated,
    validateObjectId("sessionId"),
    isSessionOwner,
    wrapAsync(chatSessionController.restore),
);

// Permanent delete a session
router.delete(
    "/:sessionId/permanent",
    isAuthenticated,
    validateObjectId("sessionId"),
    isSessionOwner,
    wrapAsync(chatSessionController.destroy),
);

module.exports = router;
