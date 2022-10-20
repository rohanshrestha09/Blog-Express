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
exports.unfollow = exports.follow = exports.bookmarks = exports.blogs = exports.following = exports.followers = exports.logout = exports.deleteProfile = exports.deleteImage = exports.updateProfile = exports.authHandler = void 0;
const moment_1 = __importDefault(require("moment"));
const cookie_1 = require("cookie");
const uploadFile_1 = __importDefault(require("../middleware/uploadFile"));
const deleteFile_1 = __importDefault(require("../middleware/deleteFile"));
const User_1 = __importDefault(require("../model/User"));
const Blog_1 = __importDefault(require("../model/Blog"));
const asyncHandler = require('express-async-handler');
exports.authHandler = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ auth: res.locals.auth, message: 'Authentication Success' });
}));
exports.updateProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: authId, image, imageName } = res.locals.auth;
    const { fullname, bio, website, dateOfBirth } = req.body;
    try {
        if (req.files) {
            const file = req.files.image;
            if (!file.mimetype.startsWith('image/'))
                return res.status(403).json({ message: 'Please choose an image' });
            if (image && imageName)
                (0, deleteFile_1.default)(`users/${imageName}`);
            const filename = file.mimetype.replace('image/', `${authId}.`);
            const fileUrl = yield (0, uploadFile_1.default)(file.data, file.mimetype, `users/${filename}`);
            yield User_1.default.findByIdAndUpdate(authId, {
                image: fileUrl,
                imageName: filename,
            });
        }
        yield User_1.default.findByIdAndUpdate(authId, {
            fullname,
            bio,
            website,
            dateOfBirth: new Date((0, moment_1.default)(dateOfBirth).format()),
        });
        return res.status(200).json({ message: 'Profile Updated Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.deleteImage = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: authId, image, imageName } = res.locals.auth;
    try {
        if (image && imageName)
            (0, deleteFile_1.default)(imageName);
        yield User_1.default.findByIdAndUpdate(authId, {
            image: null,
            imageName: null,
        });
        return res.status(200).json({ message: 'Profile Image Removed Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.deleteProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: authId, image, imageName } = res.locals.auth;
    try {
        if (image && imageName)
            (0, deleteFile_1.default)(`users/${imageName}`);
        yield User_1.default.findByIdAndDelete(authId);
        return res.status(200).json({ message: 'Profile Deleted Successfully' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.logout = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const serialized = (0, cookie_1.serialize)('token', '', {
            maxAge: 0,
            path: '/',
        });
        res.setHeader('Set-Cookie', serialized);
        return res.status(200).json({ message: 'Logout Successful' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.followers = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { followers } = res.locals.auth;
    const { pageSize, search } = req.query;
    let query = { _id: followers };
    if (search)
        query = Object.assign({
            $text: { $search: typeof search === 'string' && search.toLowerCase() },
        }, query);
    try {
        return res.status(200).json({
            message: 'Followers fetched successfully',
            data: yield User_1.default.find(query)
                .select('-password')
                .limit(Number(pageSize || 20)),
            count: yield User_1.default.countDocuments(query),
        });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.following = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { following } = res.locals.auth;
    const { pageSize, search } = req.query;
    let query = { _id: following };
    if (search)
        query = Object.assign({
            $text: { $search: typeof search === 'string' && search.toLowerCase() },
        }, query);
    try {
        return res.status(200).json({
            message: 'Following fetched successfully',
            data: yield User_1.default.find(query)
                .select('-password')
                .limit(Number(pageSize || 20)),
            count: yield User_1.default.countDocuments(query),
        });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.blogs = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { blogs } = res.locals.auth;
    const { sort, sortOrder, pageSize, genre, isPublished, search } = req.query;
    let query = { _id: blogs };
    if (genre)
        query = Object.assign({
            genre: {
                $in: Array.isArray(genre) ? genre : typeof genre === 'string' && genre.split(','),
            },
        }, query);
    if (isPublished)
        query = Object.assign({ isPublished: isPublished === 'true' }, query);
    if (search)
        query = Object.assign({
            $text: { $search: typeof search === 'string' && search.toLowerCase() },
        }, query);
    try {
        return res.status(200).json({
            data: yield Blog_1.default.find(query)
                .sort({ [(typeof sort === 'string' && sort) || 'likes']: sortOrder === 'asc' ? 1 : -1 })
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
exports.bookmarks = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookmarks } = res.locals.auth;
    const { pageSize, genre, search } = req.query;
    let query = { _id: bookmarks, isPublished: true };
    if (genre)
        query = Object.assign({
            genre: {
                $in: Array.isArray(genre) ? genre : typeof genre === 'string' && genre.split(','),
            },
        }, query);
    if (search)
        query = Object.assign({
            $text: { $search: typeof search === 'string' && search.toLowerCase() },
        }, query);
    try {
        return res.status(200).json({
            data: yield Blog_1.default.find(query)
                .limit(Number(pageSize || 20))
                .populate('author', '-password'),
            count: yield Blog_1.default.countDocuments(query),
            message: 'Bookmarks Fetched Successfully',
        });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.follow = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auth: { _id: authId, followingCount }, user: { _id: userId, followersCount }, } = res.locals;
    if (authId === userId)
        return res.status(403).json({ message: "Can't follow same user" });
    try {
        const followingExists = yield User_1.default.findOne({
            $and: [{ _id: authId }, { following: userId }],
        });
        if (followingExists)
            return res.status(403).json({ message: 'Already Following' });
        yield User_1.default.findByIdAndUpdate(authId, {
            $push: { following: userId },
            followingCount: followingCount + 1,
        });
        yield User_1.default.findByIdAndUpdate(userId, {
            $push: { followers: authId },
            followersCount: followersCount + 1,
        });
        return res.status(200).json({ message: 'Follow Successful' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.unfollow = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { auth: { _id: authId, followingCount }, user: { _id: userId, followersCount }, } = res.locals;
    if (authId === userId)
        return res.status(403).json({ message: "Can't unfollow same user" });
    try {
        const followingExists = yield User_1.default.findOne({
            $and: [{ _id: authId }, { following: userId }],
        });
        if (!followingExists)
            return res.status(403).json({ message: 'Not following' });
        yield User_1.default.findByIdAndUpdate(authId, {
            $pull: { following: userId },
            followingCount: followingCount - 1,
        });
        yield User_1.default.findByIdAndUpdate(userId, {
            $pull: { followers: authId },
            followersCount: followersCount - 1,
        });
        return res.status(200).json({ message: 'Unfollow Successful' });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
