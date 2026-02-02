const { folderSchema } = require("../schemas/folderSchema.js");

module.exports.validateFolder = (req, res, next) => {
    let { error } = folderSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: error.details.map((el) => el.message).join(", "),
        });
    }
    next();
};
