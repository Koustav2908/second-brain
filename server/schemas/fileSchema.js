const Joi = require("joi");

module.exports.uploadFileSchema = Joi.object({
    folder: Joi.string().optional().allow(null),
});

module.exports.renameFileSchema = Joi.object({
    name: Joi.string().trim().min(1).max(50).required().messages({
        "string.empty": "File name cannot be empty.",
        "string.max": "File name cannot exceed 15 characters.",
        "any.required": "File name is required.",
    }),
});
