"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BlogSchema = new mongoose_1.Schema({
    author: { type: mongoose_1.Schema.Types.ObjectId, required: [true, "Author missing"] },
    image: String,
    imageName: String,
    title: {
        type: String,
        required: [true, "Title missing"],
    },
    content: {
        type: String,
        required: [true, "Content missing"],
        minLength: [20, "Content must contain atleast 20 characters"],
    },
    likers: [mongoose_1.Schema.Types.ObjectId],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    comments: [{ commenter: mongoose_1.Schema.Types.ObjectId, content: String }],
}, { timestamps: true });
module.exports = (0, mongoose_1.model)("Blog", BlogSchema);
