const mongoose = require("mongoose");

const chatMessageSchema = mongoose.Schema(
    {
        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ChatSession",
            required: true,
            index: true,
        },
        role: {
            type: String,
            enum: ["user", "assistant", "system"],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        embedding: {
            type: [Number],
        },
    },
    { timestamps: true },
);

chatMessageSchema.index({ session: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
