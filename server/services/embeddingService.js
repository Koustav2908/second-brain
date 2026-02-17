const File = require("../models/fileModel.js");

const axios = require("axios");

module.exports.createEmbeddings = async (userId, fileId, documentUrl) => {
    try {
        let response = await axios.post(
            "http://127.0.0.1:8080/rag/index",
            { userId, fileId, documentUrl },
            { timeout: 300000 },
        );

        await File.findByIdAndUpdate(fileId, {
            status: "embedded",
            pages: response.data.pages,
            chunks: response.data.chunks_indexed,
        });

        console.log(`Embedding completed for file ${fileId}`);
    } catch (err) {
        console.error("Embedding failed:", err.message);

        await File.findByIdAndUpdate(fileId, { status: "failed" });
    }
};

module.exports.deleteEmbeddings = async (userId, fileId) => {
    try {
        await axios.delete("http://127.0.0.1:8080/rag/delete", {
            data: { userId, fileId },
            timeout: 300000,
        });
    } catch (err) {
        console.error("Failed to delete embeddings:", err.message);
    }
};
