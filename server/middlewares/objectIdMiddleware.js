const mongoose = require("mongoose");

module.exports.validateObjectId = (paramName) => (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    next();
};
