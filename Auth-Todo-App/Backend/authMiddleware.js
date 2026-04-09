const jwt = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(403).json({ message: "You are not Signed-In" });
    }

    const tokenVerify = jwt.verify(token, "secret key for this todo-App");
    const decodedName = tokenVerify.username;

    if (!decodedName) {
        return res.status(403).json({ message: "malformed token" });
    }
    req.username = decodedName;

    next();
}

module.exports = {
    authMiddleware
}