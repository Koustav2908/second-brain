const jwt = require("jsonwebtoken");

module.exports.isAuthincated = (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Not authincated",
        });
    }

    let token = authHeader.split(" ")[1];

    try {
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid token" });
    }
};
