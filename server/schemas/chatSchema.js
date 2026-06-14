const Joi = require("joi");

module.exports.chatSchema = Joi.object({
    query: Joi.string().trim().required(),
    fileId: Joi.string().optional(),
});
