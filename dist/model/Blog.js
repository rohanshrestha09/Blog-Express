"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const misc_1 = require("../misc");
const BlogSchema = new mongoose_1.Schema({
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: [true, 'Author missing'] },
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
                return val.length <= 4;
            },
            'Only 4 genre allowed',
        ],
        enum: {
            values: misc_1.genre,
            message: '{VALUE} not supported',
        },
    },
    likers: { type: [mongoose_1.Schema.Types.ObjectId], default: [] },
    likesCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
    comments: { type: [{ commenter: mongoose_1.Schema.Types.ObjectId, comment: String }], default: [] },
    commentsCount: { type: Number, default: 0 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Blog', BlogSchema);
