const ChatMessage = require("../models/chatMessageModel");
const ChatSession = require("../models/chatSessionModel");
const ragService = require("../services/ragService");

module.exports.chat = async (req, res) => {
    const userId = req.user.id;
    const { query, fileId } = req.body;

    if (!query) {
        return res.status(400).json({
            message: "Query is required",
        });
    }

    // Save user message
    await ChatMessage.create({
        session: req.chatSession._id,
        role: "user",
        content: query,
    });

    // Ask RAG
    const result = await ragService.askQuestion(userId, query, fileId);

    // Save bot response
    await ChatMessage.create({
        session: req.chatSession._id,
        role: "bot",
        content: result.answer,
    });

    // Move session to top of recent list
    await ChatSession.findByIdAndUpdate(req.chatSession._id, {
        updatedAt: new Date(),
    });

    return res.json(result);
};

module.exports.messages = async (req, res) => {
    const messages = await ChatMessage.find({
        session: req.chatSession._id,
    }).sort({ createdAt: 1 });

    return res.json(messages);
};
