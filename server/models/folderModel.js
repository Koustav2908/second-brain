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

folderSchema.index({ parentFolder: 1 });
folderSchema.index({ owner: 1, parentFolder: 1 });
folderSchema.index({ owner: 1, parentFolder: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Folder", folderSchema);
