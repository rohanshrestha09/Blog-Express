"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
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
    imageName: String,
    bio: String,
    following: [mongoose_1.Schema.Types.ObjectId],
    followers: [mongoose_1.Schema.Types.ObjectId],
    blogs: { type: Array, ref: "Blog" },
}, { timestamps: true });
module.exports = (0, mongoose_1.model)("User", UserSchema);
