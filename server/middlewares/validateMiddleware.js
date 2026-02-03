const { userSchema } = require("../schemas/userSchema.js");
const {
    createFolderSchema,
    renameFolderSchema,
} = require("../schemas/folderSchema.js");
const {
    uploadFileSchema,
    renameFileSchema,
} = require("../schemas/fileSchema.js");

// Validate user schema
module.exports.validateUser = (req, res, next) => {
    let { error } = userSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: error.details.map((el) => el.message).join(", "),
        });
    }
    next();
};

// Validate create folder schema
module.exports.validateCreateFolder = (req, res, next) => {
    let { error } = createFolderSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            message: error.details.map((el) => el.message).join(", "),
        });
    }
    next();
};

// Validate rename folder schema
module.exports.validateRenameFolder = (req, res, next) => {
    let { error } = renameFolderSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            message: error.details.map((el) => el.message).join(", "),
        });
    }
    next();
};

// Validate upload file schema
module.exports.validateUploadFile = (req, res, next) => {
    let { error } = uploadFileSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            message: error.details.map((el) => el.message).join(", "),
        });
    }
    next();
};

// Validate rename file schema
module.exports.validateRenameFile = (req, res, next) => {
    let { error } = renameFileSchema.validate(req.body, {
        abortEarly: false,
    });

    if (error) {
        return res.status(400).json({
            message: error.details.map((el) => el.message).join(", "),
        });
    }
    next();
};
