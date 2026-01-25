const dotenv = require("dotenv");
const app = require("./app");
const mongoose = require("mongoose");

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB is connected"))
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
