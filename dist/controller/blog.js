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
const mongoose_1 = __importDefault(require("mongoose"));
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
module.exports.getBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _blogId } = req.params;
    try {
        const blog = yield Blog.findById(new mongoose_1.default.Types.ObjectId(_blogId));
        if (!blog)
            return res.status(403).json({ message: "Blog does not exist" });
        return res
            .status(200)
            .json({ blog, message: "Blog Fetched Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.postBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _authorId } = req.params;
    const { title, content } = req.body;
    try {
        if (!title)
            return res.status(403).json({ message: "Title field missing" });
        if (!req.files)
            return res.status(403).json({ message: "Image required" });
        const blog = yield Blog.create({
            author: new mongoose_1.default.Types.ObjectId(_authorId),
            title,
            content,
        });
        const file = req.files.image;
        if (!file.mimetype.startsWith("image/"))
            return res.status(403).json({ message: "Please choose an image" });
        const filename = file.mimetype.replace("image/", `${blog._id}.`);
        const storageRef = (0, storage_1.ref)(storage, `blogs/${filename}`);
        const metadata = {
            contentType: file.mimetype,
        };
        yield (0, storage_1.uploadBytes)(storageRef, file.data, metadata);
        const url = yield (0, storage_1.getDownloadURL)(storageRef);
        yield Blog.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(blog._id), {
            image: url,
            imageName: filename,
        });
        /*   await User.findByIdAndUpdate(new mongoose.Types.ObjectId(_authorId), {
          $push: {
            blogs: await Blog.findById(new mongoose.Types.ObjectId(blog._id)),
          },
        }); */
        return res.status(200).json({ message: "Blog Posted Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.updateBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _blogId } = req.params;
    const { title, content } = req.body;
    try {
        if (!title)
            return res.status(403).json({ message: "Title field missing" });
        if (!req.files)
            return res.status(403).json({ message: "Image required" });
        const blog = yield Blog.findById(new mongoose_1.default.Types.ObjectId(_blogId));
        /* await User.findByIdAndUpdate(new mongoose.Types.ObjectId(blog.author), {
          $pull: {
            blogs: blog,
          },
        }); */
        const file = req.files.image;
        if (!file.mimetype.startsWith("image/"))
            return res.status(403).json({ message: "Please choose an image" });
        if (blog.image)
            (0, storage_1.deleteObject)((0, storage_1.ref)(storage, `blogs/${blog.imageName}`));
        const filename = file.mimetype.replace("image/", `${_blogId}.`);
        const storageRef = (0, storage_1.ref)(storage, `blogs/${filename}`);
        const metadata = {
            contentType: file.mimetype,
        };
        yield (0, storage_1.uploadBytes)(storageRef, file.data, metadata);
        const url = (0, storage_1.getDownloadURL)(storageRef);
        yield Blog.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(_blogId), {
            image: url,
            imageName: filename,
            title,
            content,
        });
        /*   await User.findByIdAndUpdate(new mongoose.Types.ObjectId(_authorId), {
          $push: {
            blogs: await Blog.findById(new mongoose.Types.ObjectId(_blogId)),
          },
        }); */
        return res.status(200).json({ message: "Blog Posted Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.deleteBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _blogId } = req.params;
    try {
        const blog = yield Blog.findById(new mongoose_1.default.Types.ObjectId(_blogId));
        if (!blog)
            return res.status(403).json({ message: "Blog does not exist" });
        if (blog.image)
            (0, storage_1.deleteObject)((0, storage_1.ref)(storage, `blogs/${blog.imageName}`));
        yield Blog.findByIdAndDelete(new mongoose_1.default.Types.ObjectId(_blogId));
        return res.status(200).json({ message: "Blog Deleted Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
