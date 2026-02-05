const File = require("../models/fileModel.js");
const Folder = require("../models/folderModel.js");

const {
    createEmbeddings,
    deleteEmbeddings,
} = require("../services/embeddingService.js");

const cloudinary = require("../config/cloudinary.js");

// Upload a new file
module.exports.upload = async (req, res) => {
    const owner = req.user.id;
    const folder = req.body.folder || null;

    if (!req.file) {
        return res.status(400).json({
            message: "No file uploaded.",
        });
    }

    if (folder) {
        let parent = await Folder.findOne({
            _id: folder,
            owner,
        });

        if (!parent) {
            return res.status(404).json({
                message: "Folder not found.",
            });
        }
    }

    let exists = await File.findOne({
        owner,
        folder,
        name: req.file.originalname,
    });

    if (exists) {
        return res.status(409).json({
            message: "A file with this name already exists in this folder.",
        });
    }

    const isPdf = req.file.mimetype === "application/pdf";

    const file = new File({
        name: req.file.originalname,
        owner,
        folder,
        cloudUrl: req.file.path,
        cloudPublicId: req.file.filename,
        status: isPdf ? "processing" : "failed",
    });

    let savedFile = await file.save();
    console.log(`File with name ${savedFile.name} saved.`);

    if (isPdf) {
        createEmbeddings(
            owner.toString(),
            savedFile._id.toString(),
            savedFile.cloudUrl,
        ).catch(console.error);
    }

    return res.status(201).json(savedFile);
};

// Show files for a folder
module.exports.index = async (req, res) => {
    const owner = req.user.id;
    const { folder } = req.query;

    const files = await File.find({
        owner,
        folder: folder || null,
    });

    return res.json(files);
};

// Rename file
module.exports.update = async (req, res) => {
    const { name } = req.body;
    const file = req.file;

    const exists = await File.findOne({
        owner: file.owner,
        folder: file.folder,
        name,
        _id: { $ne: file._id },
    });

    if (exists) {
        return res.status(409).json({
            message: "A file with this name already exists in this folder.",
        });
    }

    file.name = name;
    let updatedFile = await file.save();
    console.log(`File name renamed to ${updatedFile.name}.`);

    return res.json(updatedFile);
};

// Delete file
module.exports.destroy = async (req, res) => {
    const file = req.file;
    const fileId = file._id;
    const fileName = file.name;
    const fileOwner = file.owner;

    deleteEmbeddings(fileOwner.toString(), fileId.toString()).catch(
        console.error,
    );

    await cloudinary.uploader.destroy(file.cloudPublicId, {
        resource_type: "raw",
    });

    await file.deleteOne();
    console.log(`File ${fileName} deleted succesfully.`);

    return res.json({
        message: "File deleted successfully.",
        id: fileId,
    });
};
