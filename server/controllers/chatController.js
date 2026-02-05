const ragService = require("../services/ragService.js");

module.exports.chat = async (req, res) => {
    const userId = req.user.id;
    const { query, fileId } = req.body;

    if (!query) {
        return res.status(400).json({ message: "Query is required" });
    }

    let result = await ragService.askQuestion(userId, query, fileId);

    return res.json(result);
};
