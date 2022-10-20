"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uncomment = exports.comment = exports.unbookmark = exports.bookmark = exports.unlike = exports.like = exports.unpublish = exports.publish = exports.genre = exports.deleteBlog = exports.updateBlog = exports.postBlog = exports.blog = exports.blogs = void 0;
const uploadFile_1 = __importDefault(require("../middleware/uploadFile"));
const deleteFile_1 = __importDefault(require("../middleware/deleteFile"));
const Blog_1 = __importDefault(require("../model/Blog"));
const User_1 = __importDefault(require("../model/User"));
const misc_1 = require("../misc");
const asyncHandler = require('express-async-handler');
exports.blogs = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort, pageSize, genre } = req.query;
    let query = { isPublished: true };
    if (genre)
        query = Object.assign({
            genre: {
                $in: Array.isArray(genre) ? genre : typeof genre === 'string' && genre.split(','),
            },
        }, query);
    try {
        return res.status(200).json({
            data: yield Blog_1.default.find(query)
                .sort({ [(typeof sort === 'string' && sort) || 'likes']: -1 })
                .limit(Number(pageSize || 20))
                .populate('author', '-password'),
            count: yield Blog_1.default.countDocuments(query),
            message: 'Blogs Fetched Successfully',
        });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.blog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({ blog: res.locals.blog, message: 'Blog Fetched Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.postBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: authId } = res.locals.auth;
    const { title, content, genre, isPublished } = req.body;
    try {
        if (!req.files)
            return res.status(403).json({ message: 'Image required' });
        const { _id: blogId } = yield Blog_1.default.create({
            author: authId,
            title,
            content,
            genre,
            isPublished,
        });
        const file = req.files.image;
        if (!file.mimetype.startsWith('image/'))
            return res.status(403).json({ message: 'Please choose an image' });
        const filename = file.mimetype.replace('image/', `${blogId}.`);
        const fileUrl = yield (0, uploadFile_1.default)(file.data, file.mimetype, `blogs/${filename}`);
        yield Blog_1.default.findByIdAndUpdate(blogId, {
            image: fileUrl,
            imageName: filename,
        });
        yield User_1.default.findByIdAndUpdate(authId, { $push: { blogs: blogId } });
        return res.status(200).json({ message: 'Blog Posted Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.updateBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: blogId, image, imageName } = res.locals.blog;
    const { title, content, genre } = req.body;
    try {
        if (req.files) {
            const file = req.files.image;
            if (!file.mimetype.startsWith('image/'))
                return res.status(403).json({ message: 'Please choose an image' });
            if (image && imageName)
                (0, deleteFile_1.default)(`blogs/${imageName}`);
            const filename = file.mimetype.replace('image/', `${blogId}.`);
            const fileUrl = yield (0, uploadFile_1.default)(file.data, file.mimetype, `blogs/${filename}`);
            yield Blog_1.default.findByIdAndUpdate(blogId, {
                image: fileUrl,
                imageName: filename,
            });
        }
        yield Blog_1.default.findByIdAndUpdate(blogId, {
            title,
            content,
            genre,
        });
        return res.status(200).json({ message: 'Blog Updated Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.deleteBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: authId } = res.locals.auth;
    const { _id: blogId, image, imageName } = res.locals.blog;
    try {
        if (image && imageName)
            (0, deleteFile_1.default)(`blogs/${imageName}`);
        yield Blog_1.default.findByIdAndDelete(blogId);
        yield User_1.default.findByIdAndUpdate(authId, { $pull: { blogs: blogId } });
        return res.status(200).json({ message: 'Blog Deleted Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.genre = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Cache-Control', 'public,max-age=86400');
    return res.status(200).json({ genre: misc_1.genre, message: 'Genre Fetched Successfully' });
}));
exports.publish = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: blogId } = res.locals.blog;
    try {
        yield Blog_1.default.findByIdAndUpdate(blogId, { isPublished: true });
        return res.status(200).json({ message: 'Blog Published Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.unpublish = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: blogId } = res.locals.blog;
    try {
        yield Blog_1.default.findByIdAndUpdate(blogId, { isPublished: false });
        return res.status(200).json({ message: 'Blog Unpublished Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.like = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auth: { _id: authId }, blog: { _id: blogId, likesCount }, } = res.locals;
    try {
        const likeExist = yield Blog_1.default.findOne({
            $and: [{ _id: blogId }, { likers: authId }],
        });
        if (likeExist)
            return res.status(403).json({ message: 'Already Liked' });
        yield Blog_1.default.findByIdAndUpdate(blogId, {
            $push: { likers: authId },
            likes: likesCount + 1,
        });
        yield User_1.default.findByIdAndUpdate(authId, {
            $push: { liked: blogId },
        });
        return res.status(200).json({ message: 'Liked' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.unlike = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auth: { _id: authId }, blog: { _id: blogId, likesCount }, } = res.locals;
    try {
        const likeExist = yield Blog_1.default.findOne({
            $and: [{ _id: blogId }, { likers: authId }],
        });
        if (!likeExist)
            return res.status(403).json({ message: 'ALready Unliked' });
        yield Blog_1.default.findByIdAndUpdate(blogId, {
            $pull: { likers: authId },
            likes: likesCount - 1,
        });
        yield User_1.default.findByIdAndUpdate(authId, {
            $pull: { liked: blogId },
        });
        return res.status(200).json({ message: 'Unliked' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.bookmark = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auth: { _id: authId }, blog: { _id: blogId }, } = res.locals;
    try {
        const bookmarkExist = yield User_1.default.findOne({
            $and: [{ _id: authId }, { bookmarks: blogId }],
        });
        if (bookmarkExist)
            return res.status(403).json({ message: 'Already Bookmarked' });
        yield User_1.default.findByIdAndUpdate(authId, { $push: { bookmarks: blogId } });
        return res.status(200).json({ message: 'Bookmarked Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.unbookmark = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auth: { _id: authId }, blog: { _id: blogId }, } = res.locals;
    try {
        const bookmarkExist = yield User_1.default.findOne({
            $and: [{ _id: authId }, { bookmarks: blogId }],
        });
        if (!bookmarkExist)
            return res.status(403).json({ message: 'Already Unbookmarked' });
        yield User_1.default.findByIdAndUpdate(authId, { $pull: { bookmarks: blogId } });
        return res.status(200).json({ message: 'Unbookmarked Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.comment = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auth: { _id: authId }, blog: { _id: blogId, commentsCount }, } = res.locals;
    const { comment } = req.body;
    try {
        yield Blog_1.default.findByIdAndUpdate(blogId, {
            $push: { comments: { commenter: authId, comment } },
            commentsCount: commentsCount + 1,
        });
        return res.status(200).json({ message: 'Comment Successfull' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.uncomment = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auth: { _id: authId }, blog: { _id: blogId, commentsCount }, } = res.locals;
    const { comment } = req.body;
    try {
        yield Blog_1.default.findByIdAndUpdate(blogId, {
            $pull: { comments: { commenter: authId, comment } },
            commentsCount: commentsCount - 1,
        });
        return res.status(200).json({ message: 'Comment Deleted Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
