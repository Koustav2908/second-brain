const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        parentFolder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            default: null,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("Folder", folderSchema);
