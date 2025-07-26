import jwt from "jsonwebtoken";
export const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401).json({ error: "Unauthorized access" });
        return;
    }
    try {
        jwt.verify(token, process.env.JWT_Key, (error, payload) => {
            if (error) {
                console.error("Token verification error:", error);
                return res.status(401).json({ error: "Invalid token" });
            }
            req.userId = payload.userId;
            next();
        });
    }
    catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ error: "Invalid token" });
        return;
    }
};
