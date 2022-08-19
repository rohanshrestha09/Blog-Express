"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    fullname: {
        type: String,
        required: [true, "Please input your fullname."],
    },
    email: {
        type: String,
        required: [true, "Please input your email."],
        lowercase: true,
        trim: true,
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "Please input password."],
    },
    dateOfBirth: {
        type: String,
        required: [true, "Please provide Date of Birth."],
    },
    image: String,
    bio: String,
}, { timestamps: true });
module.exports = mongoose_1.default.model("User", UserSchema);
