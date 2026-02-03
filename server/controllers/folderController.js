const Folder = require("../models/folderModel.js");
const File = require("../models/fileModel.js");

// Show all folders of user
module.exports.index = async (req, res) => {
    const userId = req.user.id;
    const folders = await Folder.find({ owner: userId }).sort({
        parentFolder: 1,
        createdAt: 1,
    });
    return res.json(folders);
};

// Create a new folder
module.exports.create = async (req, res) => {
    const { name, parentFolder } = req.body;
    const owner = req.user.id;

    if (parentFolder) {
        let parent = await Folder.findOne({ _id: parentFolder, owner });

        if (!parent) {
            return res
                .status(404)
                .json({ message: "Parent folder not found." });
        }
    }

    const exists = await Folder.findOne({
        owner,
        parentFolder: parentFolder || null,
        name,
    });

    if (exists) {
        return res
            .status(409)
            .json({
                message:
                    "A folder with this name already exists in this folder.",
            });
    }

    const folder = new Folder({
        name,
        parentFolder: parentFolder || null,
        owner,
    });

    let savedFolder = await folder.save();
    console.log(`Folder ${savedFolder.name} created.`);

    return res.status(201).json(savedFolder);
};

// Rename folder
module.exports.update = async (req, res) => {
    const { name } = req.body;
    const folder = req.folder;

    const exists = await Folder.findOne({
        owner: folder.owner,
        parentFolder: folder.parentFolder,
        name,
        _id: { $ne: folder._id },
    });

    if (exists) {
        return res.status(409).json({
            message: "A folder with this name already exists in this folder.",
        });
    }

    folder.name = name;
    let updatedFolder = await folder.save();
    console.log(`Folder name renamed to ${updatedFolder.name}.`);

    return res.json(updatedFolder);
};

// Delete folder
module.exports.destroy = async (req, res) => {
    const folder = req.folder;

    let hasSubfolders = await Folder.exists({
        parentFolder: folder._id,
        owner: folder.owner,
    });

    let hasFiles = await File.exists({
        folder: folder._id,
        owner: folder.owner,
    });

    if (hasSubfolders || hasFiles) {
        return res.status(400).json({
            message: "Folder is not empty.",
        });
    }

    const folderId = folder._id;
    const folderName = folder.name;

    await folder.deleteOne();
    console.log(`Folder ${folderName} deleted succesfully.`);

    return res.json({
        message: "Folder deleted successfully.",
        id: folderId,
    });
};
