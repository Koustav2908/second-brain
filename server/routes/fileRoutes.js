const express = require("express");
const fileController = require("../controllers/fileController.js");

const {
    validateUploadFile,
    validateRenameFile,
} = require("../middlewares/validateMiddleware.js");
const { isAuthenticated } = require("../middlewares/authMiddleware.js");
const { isFileOwner } = require("../middlewares/ownershipMiddleware.js");

const wrapAsync = require("../utils/wrapAsync.js");

const upload = require("../config/multer.js");

const router = express.Router();

// Upload a new file
router.post(
    "/upload",
    isAuthenticated,
    upload.single("file"),
    validateUploadFile,
    wrapAsync(fileController.upload),
);

// Show all files for a folder
router.get("/", isAuthenticated, wrapAsync(fileController.index));

// Rename file
router.patch(
    "/:id",
    isAuthenticated,
    isFileOwner,
    validateRenameFile,
    wrapAsync(fileController.update),
);

// Delete file
router.delete(
    "/:id",
    isAuthenticated,
    isFileOwner,
    wrapAsync(fileController.destroy),
);

module.exports = router;
