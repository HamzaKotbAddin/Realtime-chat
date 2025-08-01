"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = require("bcrypt");
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: (v) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(v);
            },
            message: (props) => `${props.value} is not a valid email!`,
        },
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    firstName: {
        type: String,
        required: false,
        trim: true,
    },
    lastName: {
        type: String,
        required: false,
        trim: true,
    },
    image: {
        type: String,
        required: false,
    },
    color: {
        type: Number,
        required: false,
        default: 0x000000,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    }
});
userSchema.pre("save", async function hashPassword(next) {
    try {
        if (!this.isModified("password"))
            return next();
        const salt = await (0, bcrypt_1.genSalt)(10);
        this.password = await (0, bcrypt_1.hash)(this.password, salt);
        next();
    }
    catch (error) {
        console.error(" ❌ Error hashing password:", error);
        next(error);
    }
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
