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
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const Blog = require("../model/Blog");
module.exports.follow = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _queryUserId } = res.locals.queryUser;
    const { _id: _userId } = res.locals.user;
    if (_userId === _queryUserId)
        return res.status(403).json({ message: "Can't follow same user" });
    try {
        const followingExists = yield User.findOne({
            $and: [{ _id: _userId }, { following: _queryUserId }],
        });
        if (followingExists)
            return res.status(403).json({ message: "Already Following" });
        yield User.findByIdAndUpdate(_userId, {
            $push: { following: _queryUserId },
        });
        yield User.findByIdAndUpdate(_queryUserId, {
            $push: { followers: _userId },
        });
        return res.status(200).json({ message: "Follow Successful" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.unfollow = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _queryUserId } = res.locals.queryUser;
    const { _id: _userId } = res.locals.user;
    if (_userId === _queryUserId)
        return res.status(403).json({ message: "Can't unfollow same user" });
    try {
        const followingExists = yield User.findOne({
            $and: [{ _id: _userId }, { following: _queryUserId }],
        });
        if (!followingExists)
            return res.status(403).json({ message: "Not following" });
        yield User.findByIdAndUpdate(_userId, {
            $pull: { following: _queryUserId },
        });
        yield User.findByIdAndUpdate(_queryUserId, {
            $pull: { followers: _userId },
        });
        return res.status(200).json({ message: "Unfollow Successful" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.likeBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _blogId, likers } = res.locals.blog;
    const { _id: _userId } = res.locals.user;
    try {
        const likeExist = yield Blog.findOne({
            $and: [{ _id: _blogId }, { likers: _userId }],
        });
        if (likeExist)
            return res.status(403).json({ message: "Already Liked" });
        yield Blog.findByIdAndUpdate(_blogId, {
            $push: { likers: _userId },
            likes: likers.length + 1,
        });
        return res.status(200).json({ message: "Liked" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.unlikeBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _blogId, likers } = res.locals.blog;
    const { _id: _userId } = res.locals.user;
    try {
        const likeExist = yield Blog.findOne({
            $and: [{ _id: _blogId }, { likers: _userId }],
        });
        if (!likeExist)
            return res.status(403).json({ message: "ALready Unliked" });
        yield Blog.findByIdAndUpdate(_blogId, {
            $pull: { likers: _userId },
            likes: likers.length - 1,
        });
        return res.status(200).json({ message: "Unliked" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.postComment = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _blogId } = res.locals.blog;
    const { _id: _userId } = res.locals.user;
    const { comment } = req.body;
    try {
        yield Blog.findByIdAndUpdate(_blogId, {
            $push: { comments: { commenter: _userId, comment } },
        });
        return res.status(200).json({ message: "Comment Successfull" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.deleteComment = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _blogId } = res.locals.blog;
    const { _id: _userId } = res.locals.user;
    const { comment } = req.body;
    try {
        yield Blog.findByIdAndUpdate(_blogId, {
            $pull: { comments: { commenter: _userId, comment } },
        });
        return res.status(200).json({ message: "Comment Deleted Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.bookmarkBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _blogId } = res.locals.blog;
    const { _id: _userId } = res.locals.user;
    try {
        const bookmarkExist = yield User.findOne({
            $and: [{ _id: _userId }, { bookmarks: _blogId }],
        });
        if (bookmarkExist)
            return res.status(403).json({ message: "Already Bookmarked" });
        yield User.findByIdAndUpdate(_userId, { $push: { bookmarks: _blogId } });
        return res.status(200).json({ message: "Bookmarked Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.unbookmarkBlog = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _blogId } = res.locals.blog;
    const { _id: _userId } = res.locals.user;
    try {
        const bookmarkExist = yield User.findOne({
            $and: [{ _id: _userId }, { bookmarks: _blogId }],
        });
        if (!bookmarkExist)
            return res.status(403).json({ message: "Already Unbookmarked" });
        yield User.findByIdAndUpdate(_userId, { $pull: { bookmarks: _blogId } });
        return res.status(200).json({ message: "Unbookmarked Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
