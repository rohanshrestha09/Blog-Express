"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    author: mongoose_1.Schema.Types.ObjectId,
    image: {
        type: String,
        required: [true, "Please chose an image"],
    },
    title: {
        type: String,
        required: [true, "Please input title"],
    },
    content: {
        type: String,
        required: [true, "Please input content"],
    },
    likers: [mongoose_1.Schema.Types.ObjectId],
    likes: Number,
    views: Number,
    isPublished: { type: Boolean, default: false },
    comments: [{ commenter: mongoose_1.Schema.Types.ObjectId, content: String }],
}, { timestamps: true });
module.exports = (0, mongoose_1.model)("Blog", BlogSchema);
