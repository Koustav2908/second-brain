const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT;
const dbUrl = process.env.MONGO_URI;

main()
    .then(() => console.log("Connected to database"))
    .catch((err) => console.error(err));

async function main() {
    await mongoose.connect(dbUrl);
}

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello, World! 🤖");
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
