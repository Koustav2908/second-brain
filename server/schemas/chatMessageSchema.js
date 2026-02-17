const Joi = require("joi");

module.exports.chatMessageSchema = Joi.object({
    content: Joi.string().min(1).max(4000).required().messages({
        "string.empty": "Chat message cannot be empty.",
        "string.max": "Chat message cannot exceed 4000 characters.",
        "any.required": "Chat message is required.",
    }),
});
