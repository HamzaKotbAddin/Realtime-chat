"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeImage = exports.updateImage = exports.updateProfile = exports.getUserInfo = exports.logout = exports.login = exports.signUp = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const fs_1 = require("fs");
const maxAge = 3 * 24 * 60 * 60 * 1000;
const maxAgeSeconds = maxAge / 1000;
const createToken = (email, userId) => {
    try {
        if (!process.env.JWT_KEY) {
            throw new Error("JWT_KEY is not defined in environment variables");
        }
        return jsonwebtoken_1.default.sign({ email, userId }, process.env.JWT_KEY, {
            expiresIn: maxAgeSeconds
        });
    }
    catch (error) {
        console.error("Error creating token:", error);
        throw error;
    }
};
const signUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: `username, email and password are required` });
        }
        const existingEmail = await user_model_1.default.findOne({ email }).select("+password");
        if (existingEmail) {
            return res.status(400).json({ error: "Email already registered.", message: "Email already registered." });
        }
        const existingUsername = await user_model_1.default.findOne({ username }).select("+password");
        if (existingUsername) {
            return res.status(400).json({ error: "Username already registered.", message: "Username already registered." });
        }
        const user = await user_model_1.default.create({
            username,
            email,
            password
        });
        if (!user) {
            return res.status(400).json({ message: "User creation failed" });
        }
        const token = createToken(email, user.id);
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge,
            secure: true,
            sameSite: "none",
        });
        res.status(201).json({ message: "User created successfully", user: {
                id: user.id,
                username: user.username,
                email: user.email,
                image: user.image,
                profileSetup: user.profileSetup
            } });
    }
    catch (error) {
        console.error("Error during sign up:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
        next(error);
    }
};
exports.signUp = signUp;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        const user = await user_model_1.default.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ error: "no email found" });
        }
        console.log("Raw password:", password);
        console.log("Stored hashed password:", user.password);
        const auth = await (0, bcrypt_1.compare)(password, user.password);
        console.log("Password match result:", auth);
        if (!auth) {
            return res.status(401).json({ error: "Password is incorrect" });
        }
        const token = createToken(email, user.id);
        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                image: user.image,
                profileSetup: user.profileSetup,
                firstName: user.firstName,
                lastName: user.lastName,
                color: user.color
            }
        });
    }
    catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};
exports.logout = logout;
const getUserInfo = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        const user = await user_model_1.default.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log("User info fetched successfully:", user);
        res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                image: user.image,
                profileSetup: user.profileSetup,
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                color: user.color
            }
        });
    }
    catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};
exports.getUserInfo = getUserInfo;
const updateProfile = async (req, res) => {
    try {
        const { userId } = req;
        const { firstName, lastName, color, profileSetup } = req.body;
        if (!firstName && !lastName && color === undefined) {
            return res.status(400).json({
                error: "At least one field (firstName, lastName, color) is required to update"
            });
        }
        const updatedUser = await user_model_1.default.findByIdAndUpdate(userId, {
            $set: {
                ...(firstName && { firstName }),
                ...(lastName && { lastName }),
                ...(color !== undefined && { color }),
                ...(profileSetup !== undefined && { profileSetup }),
            },
        }, { new: true, runValidators: true });
        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                image: updatedUser.image,
                profileSetup: updatedUser.profileSetup,
                firstName: updatedUser.firstName,
                lastName: updatedUser.lastName,
                color: updatedUser.color
            }
        });
    }
    catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};
exports.updateProfile = updateProfile;
const updateImage = async (req, res) => {
    console.log(req.file);
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Image is required" });
        }
        const date = Date.now();
        let fileName = "uploads/profiles/" + date + "-" + req.file.originalname;
        (0, fs_1.renameSync)(req.file.path, fileName);
        const updetedUser = await user_model_1.default.findByIdAndUpdate(req.userId, { $set: { image: fileName } }, { new: true, runValidators: true });
        if (!updetedUser) {
            return res.status(404).json({ error: "Image not found" });
        }
        res.status(200).json({ message: "Image updated successfully", image: updetedUser.image });
    }
    catch (error) {
        console.error("Error updating image:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};
exports.updateImage = updateImage;
const removeImage = async (req, res) => {
    try {
        const { userId } = req;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.image) {
            (0, fs_1.unlinkSync)(user.image);
        }
        user.image = null;
        await user.save();
        res.status(200).json({ message: "Image removed successfully" });
    }
    catch (error) {
        console.error("Error removing image:", error);
        res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
};
exports.removeImage = removeImage;
