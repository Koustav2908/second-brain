const Joi = require("joi");

module.exports.chatSessionSchema = Joi.object({
    title: Joi.string().trim().max(100).optional().messages({
        "string.max": "Session title cannot exceed 100 characters.",
    }),
});
