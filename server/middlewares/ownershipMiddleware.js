const Folder = require("../models/folderModel.js");
const File = require("../models/fileModel.js");

module.exports.isFolderOwner = async (req, res, next) => {
    let { id } = req.params;
    let folder = await Folder.findById(id);

    if (!folder) {
        return res.status(404).json({ message: "Folder not found." });
    }

    if (!folder.owner.equals(req.user.id)) {
        return res.status(403).json({ message: "Access denied." });
    }

    req.folder = folder;

    next();
};

module.exports.isFileOwner = async (req, res, next) => {
    let { id } = req.params;
    let file = await File.findById(id);

    if (!file) {
        return res.status(404).json({ message: "File not found." });
    }

    if (!file.owner.equals(req.user.id)) {
        return res.status(403).json({ message: "Access denied." });
    }

    req.file = file;

    next();
};
