"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const misc_1 = require("../misc/misc");
const BlogSchema = new mongoose_1.Schema({
    author: { type: mongoose_1.Schema.Types.ObjectId, required: [true, 'Author missing'] },
    image: String,
    imageName: String,
    title: {
        type: String,
        required: [true, 'Title missing'],
    },
    content: {
        type: String,
        required: [true, 'Content missing'],
    },
    genre: {
        type: [String],
        required: [true, 'Atleast one genre required'],
        validate: [
            function arrayLimit(val) {
                return val.length <= 5;
            },
            'Only 5 genre allowed',
        ],
        enum: {
            values: misc_1.genre,
            message: '{VALUE} not supported',
        },
    },
    likers: [mongoose_1.Schema.Types.ObjectId],
    likes: { type: Number, default: 0 },
    viewers: [mongoose_1.Schema.Types.ObjectId],
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    comments: [{ commenter: mongoose_1.Schema.Types.ObjectId, comment: String }],
}, { timestamps: true });
module.exports = (0, mongoose_1.model)('Blog', BlogSchema);
