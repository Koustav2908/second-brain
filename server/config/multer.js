const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary.js");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "second-brain",
        resource_type: "raw",
        allowed_formats: ["pdf"],
    },
});

module.exports = multer({ storage });
