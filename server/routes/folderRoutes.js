const express = require("express");
const folderController = require("../controllers/folderController.js");

const {
    validateFolder,
} = require("../middlewares/validateFolderMiddleware.js");
const { isAuthenticated } = require("../middlewares/authMiddleware.js");
const { isFolderOwner } = require("../middlewares/ownershipMiddleware.js");

const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router();

// Create a new folder
router.post(
    "/",
    isAuthenticated,
    validateFolder,
    wrapAsync(folderController.create),
);

// Show all folders for a particular authenticated user
router.get("/", isAuthenticated, wrapAsync(folderController.index));

// Rename folder name
router.patch(
    "/:id",
    isAuthenticated,
    isFolderOwner,
    wrapAsync(folderController.update),
);

// Delete folder
router.delete(
    "/:id",
    isAuthenticated,
    isFolderOwner,
    wrapAsync(folderController.destroy),
);

module.exports = router;
