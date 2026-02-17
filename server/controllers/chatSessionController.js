const ChatSession = require("../models/chatSessionModel.js");
const ChatMessage = require("../models/chatMessageModel.js");

// Create a new chat session
module.exports.create = async (req, res) => {
    const user = req.user.id;

    const session = new ChatSession({
        user,
    });

    let savedSession = await session.save();
    console.log(`"${savedSession.title}" saved sucessfully.`);

    return res.status(201).json(savedSession);
};

// Show all sessions of a user
module.exports.index = async (req, res) => {
    const user = req.user.id;

    let sessions = await ChatSession.find({ user, isDeleted: false }).sort({
        updatedAt: -1,
    });

    return res.json(sessions);
};

// Show all soft-deleted sessions of a user
module.exports.trashIndex = async (req, res) => {
    const user = req.user.id;

    let sessions = await ChatSession.find({ user, isDeleted: true }).sort({
        deletedAt: -1,
    });

    return res.json(sessions);
};

// Show a single session
module.exports.show = async (req, res) => {
    let chatSession = req.chatSession;
    return res.json(chatSession);
};

// Rename a session
module.exports.rename = async (req, res) => {
    const { title } = req.body;
    const chatSession = req.chatSession;

    const exists = await ChatSession.findOne({
        title,
        user: chatSession.user,
        _id: { $ne: chatSession._id },
    });

    if (exists) {
        return res.status(409).json({
            message: "A chat session with this name already exists.",
        });
    }

    chatSession.title = title;

    let updatedChatSession = await chatSession.save();
    console.log(`Chat Session name renamed to "${updatedChatSession.title}".`);
    return res.json(updatedChatSession);
};

// Soft delete a session
module.exports.softDestroy = async (req, res) => {
    const chatSession = req.chatSession;

    if (chatSession.isDeleted) {
        return res.status(400).json({
            message: "Session already in trash.",
        });
    }

    chatSession.isDeleted = true;
    chatSession.deletedAt = new Date();

    await chatSession.save();

    return res.json({
        message: "Session moved to trash.",
        id: chatSession._id,
    });
};

// Restore a session
module.exports.restore = async (req, res) => {
    const chatSession = req.chatSession;

    if (!chatSession.isDeleted) {
        return res.status(400).json({
            message: "Session is not in trash.",
        });
    }

    chatSession.isDeleted = false;
    chatSession.deletedAt = null;

    await chatSession.save();

    return res.json({
        message: "Session restored successfully.",
        id: chatSession._id,
    });
};

// Permanently delete a session
module.exports.destroy = async (req, res) => {
    const chatSession = req.chatSession;

    if (!chatSession.isDeleted) {
        return res.status(400).json({
            message:
                "Session must be moved to trash before permanent deletion.",
        });
    }

    await ChatMessage.deleteMany({ session: chatSession._id });
    await ChatSession.deleteOne();

    return res.json({
        message: "Session permanently deleted.",
        id: chatSession._id,
    });
};
