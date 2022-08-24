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
Object.defineProperty(exports, "__esModule", { value: true });
const storage_1 = require("firebase/storage");
const asyncHandler = require("express-async-handler");
const Blog = require("../model/Blog");
const User = require("../model/User");
const storage = (0, storage_1.getStorage)();
module.exports.getAllBlogs = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sort, pageSize } = req.query;
    try {
        switch (sort) {
            case "likes":
                return res.status(200).json({
                    blogs: yield Blog.find({})
                        .sort({ likes: -1 })
                        .limit(pageSize || 10),
                    message: "Blogs Fetched Successfully",
                });
            case "views":
                return res.status(200).json({
                    blogs: yield Blog.find({})
                        .sort({ views: -1 })
                        .limit(pageSize || 10),
                    message: "Blogs Fetched Successfully",
                });
            case "latest":
                return res.status(200).json({
                    blogs: yield Blog.find({})
                        .sort({ createdAt: -1 })
                        .limit(pageSize || 10),
                    message: "Blogs Fetched Successfully",
                });
            default:
                return res.status(200).json({
                    blogs: yield Blog.find({}).limit(pageSize || 10),
                    message: "Blogs Fetched Successfully",
                });
        }
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.getCategorisedBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { genre, sort, pageSize } = req.query;
    try {
        switch (sort) {
            case "likes":
                return res.status(200).json({
                    blogs: yield Blog.find({ genre })
                        .sort({ likes: -1 })
                        .limit(pageSize || 10),
                    message: "Blogs Fetched Successfully",
                });
            case "views":
                return res.status(200).json({
                    blogs: yield Blog.find({ genre })
                        .sort({ views: -1 })
                        .limit(pageSize || 10),
                    message: "Blogs Fetched Successfully",
                });
            case "latest":
                return res.status(200).json({
                    blogs: yield Blog.find({ genre })
                        .sort({ createdAt: -1 })
                        .limit(pageSize || 10),
                    message: "Blogs Fetched Successfully",
                });
            default:
                return res.status(200).json({
                    blogs: yield Blog.find({ genre }).limit(pageSize || 10),
                    message: "Blogs Fetched Successfully",
                });
        }
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.getBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = res.locals.blog;
    try {
        return res
            .status(200)
            .json({ blog, message: "Blog Fetched Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.postBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _authorId } = res.locals.user;
    const { title, content, genre } = req.body;
    try {
        if (!req.files)
            return res.status(403).json({ message: "Image required" });
        const { _id: _blogId } = yield Blog.create({
            author: _authorId,
            title,
            content,
            genre,
        });
        const file = req.files.image;
        if (!file.mimetype.startsWith("image/"))
            return res.status(403).json({ message: "Please choose an image" });
        const filename = file.mimetype.replace("image/", `${_blogId}.`);
        const storageRef = (0, storage_1.ref)(storage, `blogs/${filename}`);
        const metadata = {
            contentType: file.mimetype,
        };
        yield (0, storage_1.uploadBytes)(storageRef, file.data, metadata);
        const url = yield (0, storage_1.getDownloadURL)(storageRef);
        yield Blog.findByIdAndUpdate(_blogId, {
            image: url,
            imageName: filename,
        });
        yield User.findByIdAndUpdate(_authorId, { $push: { blogs: _blogId } });
        return res.status(200).json({ message: "Blog Posted Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.updateBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _blogId, image, imageName } = res.locals.blog;
    const { title, content, genre } = req.body;
    try {
        if (!req.files)
            return res.status(403).json({ message: "Image required" });
        const file = req.files.image;
        if (!file.mimetype.startsWith("image/"))
            return res.status(403).json({ message: "Please choose an image" });
        if (image)
            (0, storage_1.deleteObject)((0, storage_1.ref)(storage, `blogs/${imageName}`));
        const filename = file.mimetype.replace("image/", `${_blogId}.`);
        const storageRef = (0, storage_1.ref)(storage, `blogs/${filename}`);
        const metadata = {
            contentType: file.mimetype,
        };
        yield (0, storage_1.uploadBytes)(storageRef, file.data, metadata);
        const url = yield (0, storage_1.getDownloadURL)(storageRef);
        yield Blog.findByIdAndUpdate(_blogId, {
            image: url,
            imageName: filename,
            title,
            content,
            genre,
        });
        return res.status(200).json({ message: "Blog Updated Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.deleteBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _blogId, image, imageName } = res.locals.blog;
    const { _id: _authorId } = res.locals.user;
    try {
        if (image)
            (0, storage_1.deleteObject)((0, storage_1.ref)(storage, `blogs/${imageName}`));
        yield Blog.findByIdAndDelete(_blogId);
        yield User.findByIdAndUpdate(_authorId, { $pull: { blogs: _blogId } });
        return res.status(200).json({ message: "Blog Deleted Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.publishBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _blogId } = res.locals.blog;
    try {
        yield Blog.findByIdAndUpdate(_blogId, { isPublished: true });
        return res.status(200).json({ message: "Blog Published Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.unpublishBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _blogId } = res.locals.blog;
    try {
        yield Blog.findByIdAndUpdate(_blogId, { isPublished: false });
        return res.status(200).json({ message: "Blog Unpubished Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
