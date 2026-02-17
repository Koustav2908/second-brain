const express = require("express");
const folderController = require("../controllers/folderController.js");

const { validate } = require("../middlewares/validateMiddleware.js");
const {
    createFolderSchema,
    renameFolderSchema,
} = require("../schemas/folderSchema.js");
const { isAuthenticated } = require("../middlewares/authMiddleware.js");
const { isFolderOwner } = require("../middlewares/ownershipMiddleware.js");
const { validateObjectId } = require("../middlewares/objectIdMiddleware.js");

const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router();

// Create a new folder
router.post(
    "/",
    isAuthenticated,
    validate(createFolderSchema),
    wrapAsync(folderController.create),
);

// Show all folders for a particular authenticated user
router.get("/", isAuthenticated, wrapAsync(folderController.index));

// Rename folder name
router.patch(
    "/:folderId",
    isAuthenticated,
    validateObjectId("id"),
    isFolderOwner,
    validate(renameFolderSchema),
    wrapAsync(folderController.update),
);

// Delete folder
router.delete(
    "/:folderId",
    isAuthenticated,
    validateObjectId("id"),
    isFolderOwner,
    wrapAsync(folderController.destroy),
);

module.exports = router;
