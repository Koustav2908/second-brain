const { userSchema } = require("../schemas/userSchema.js");

module.exports.validateUser = (req, res, next) => {
    let { error } = userSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(400).json({
            message: error.details.map((el) => el.message).join(", "),
        });
    }
    next();
};
