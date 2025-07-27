"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_controller_1 = require("../controllers/message.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const messageRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: "uploads/files/" });
messageRouter.post("/get-messages", auth_middleware_1.verifyToken, message_controller_1.getMessages);
messageRouter.post("/upload-file", auth_middleware_1.verifyToken, upload.single("file"), message_controller_1.uploadFile);
exports.default = messageRouter;
