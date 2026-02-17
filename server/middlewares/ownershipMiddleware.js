const Folder = require("../models/folderModel.js");
const File = require("../models/fileModel.js");
const ChatSession = require("../models/chatSessionModel.js");

module.exports.isFolderOwner = async (req, res, next) => {
    let { folderId } = req.params;
    let folder = await Folder.findById(folderId);

    if (!folder) {
        return res.status(404).json({ message: "Folder not found." });
    }

    if (folder.owner.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Access denied." });
    }

    req.folder = folder;

    next();
};

module.exports.isFileOwner = async (req, res, next) => {
    let { fileId } = req.params;
    let file = await File.findById(fileId);

    if (!file) {
        return res.status(404).json({ message: "File not found." });
    }

    if (file.owner.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Access denied." });
    }

    req.file = file;

    next();
};

module.exports.isSessionOwner = async (req, res, next) => {
    let { sessionId } = req.params;
    let session = await ChatSession.findById(sessionId);

    if (!session) {
        return res.status(404).json({ message: "Chat session not found." });
    }

    if (session.user.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Unauthorized access." });
    }

    req.chatSession = session;

    next();
};
