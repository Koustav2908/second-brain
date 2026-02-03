const Joi = require("joi");

module.exports.createFolderSchema = Joi.object({
    name: Joi.string().trim().min(1).max(50).required().messages({
        "string.empty": "Folder name cannot be empty.",
        "string.max": "Folder name cannot exceed 15 characters.",
        "any.required": "Folder name is required.",
    }),
    parentFolder: Joi.string().optional().allow(null),
});

module.exports.renameFolderSchema = Joi.object({
    name: Joi.string().trim().min(1).max(50).required().messages({
        "string.empty": "Folder name cannot be empty.",
        "string.max": "Folder name cannot exceed 15 characters.",
        "any.required": "Folder name is required.",
    }),
});
