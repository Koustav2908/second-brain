const Folder = require("../models/folderModel.js");

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
