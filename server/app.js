const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const userRouter = require("./routes/userRoutes.js");
const folderRouter = require("./routes/folderRoutes.js");
const fileRouter = require("./routes/fileRoutes.js");
const chatRouter = require("./routes/chatRoutes.js");
const chatSessionRouter = require("./routes/chatSessionRoutes.js");

const port = process.env.PORT || 5000;
const dbUrl = process.env.MONGO_URI;

if (!dbUrl) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
}

main()
    .then((conn) => console.log("Connected to database: ", conn.name))
    .catch((err) => console.error(err));

async function main() {
    const conn = await mongoose.connect(dbUrl);
    return conn.connection;
}

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Second Brain Backend API is running",
        status: "OK",
    });
});

// User routes
app.use("/api/auth", userRouter);

// Folder routes
app.use("/api/folders", folderRouter);

// File routes
app.use("/api/files", fileRouter);

// Chat routes
app.use("/api/chat", chatRouter);

// Chat Session routes
app.use("/api/chat/sessions", chatSessionRouter);

// Universal Error Handling MiddleWare
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong!" } = err;
    res.status(status).json({
        success: false,
        message,
    });
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
