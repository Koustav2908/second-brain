const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

// Register a new user
module.exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
        username,
        email,
        password: hashedPassword,
    });

    let savedUser = await user.save();
    console.log(savedUser);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.status(201).json({
        message: "Signup successful",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
};

// Login a user
module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.json({
        message: "Login successful",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        },
    });
};

// Logout a user (in frontend)
module.exports.logout = (req, res) => {
    res.json({ message: "Logout successful" });
};
