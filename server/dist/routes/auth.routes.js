"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_1 = __importDefault(require("multer"));
const authRouter = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: "uploads/profiles/" });
authRouter.post("/signup", auth_controller_1.signUp);
authRouter.post("/login", auth_controller_1.login);
authRouter.post("/logout", auth_controller_1.logout);
authRouter.get("/user-info", auth_middleware_1.verifyToken, auth_controller_1.getUserInfo);
authRouter.put("/update-user-info", auth_middleware_1.verifyToken, auth_controller_1.updateProfile);
authRouter.put("/update-user-image", auth_middleware_1.verifyToken, upload.single("profile-image"), auth_controller_1.updateImage);
authRouter.delete("/remove-user-image", auth_middleware_1.verifyToken, auth_controller_1.removeImage);
exports.default = authRouter;
