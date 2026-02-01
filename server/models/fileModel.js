const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        folder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            default: null,
        },
        cloudUrl: {
            type: String,
            required: true,
        },
        cloudPublicId: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["uploaded", "processing", "embedded", "failed"],
            default: "uploaded",
        },
        pages: {
            type: Number,
            default: 0,
        },
        chunks: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
);

module.exports = mongoose.model("File", fileSchema);
