const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const token = req.headers.token;

    if (!token) {
        return res.status(404).json({ message: "You are not a Signed In User" });
    }
    const verifiedToken = jwt.verify(token, "SecretKeyForTodoApp");
    const verifiedId = verifiedToken.id;

    if (!verifiedId) {
        return res.status(403).json({ message: "Token malformed" });
    }
    req.id = verifiedId;

    next();
}

module.exports = {
    authMiddleware
}