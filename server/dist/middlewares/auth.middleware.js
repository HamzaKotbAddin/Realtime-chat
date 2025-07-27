"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        res.status(401).json({ error: "Unauthorized access" });
        return;
    }
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_Key, (error, payload) => {
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
exports.verifyToken = verifyToken;
