const express = require("express");
const fileController = require("../controllers/fileController.js");

const { validate } = require("../middlewares/validateMiddleware.js");
const {
    uploadFileSchema,
    renameFileSchema,
} = require("../schemas/fileSchema.js");
const { isAuthenticated } = require("../middlewares/authMiddleware.js");
const { isFileOwner } = require("../middlewares/ownershipMiddleware.js");
const { validateObjectId } = require("../middlewares/objectIdMiddleware.js");

const wrapAsync = require("../utils/wrapAsync.js");

const upload = require("../config/multer.js");

const router = express.Router();

// Upload a new file
router.post(
    "/upload",
    isAuthenticated,
    upload.single("file"),
    validate(uploadFileSchema),
    wrapAsync(fileController.upload),
);

// Show all files for a folder
router.get("/", isAuthenticated, wrapAsync(fileController.index));

// Rename file
router.patch(
    "/:fileId",
    isAuthenticated,
    validateObjectId("fileId"),
    isFileOwner,
    validate(renameFileSchema),
    wrapAsync(fileController.update),
);

// Delete file
router.delete(
    "/:fileId",
    isAuthenticated,
    validateObjectId("fileId"),
    isFileOwner,
    wrapAsync(fileController.destroy),
);

module.exports = router;
