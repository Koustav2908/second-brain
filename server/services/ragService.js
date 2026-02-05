const axios = require("axios");

module.exports.askQuestion = async (userId, query, fileId = null) => {
    const response = await axios.post(
        "http://127.0.0.1:8080/rag/query",
        { userId, query, fileId },
        { timeout: 60000 },
    );

    return response.data;
};
