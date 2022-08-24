import { Request, Response } from "express";
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const Blog = require("../model/Blog");

module.exports.follow = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: _queryUserId } = res.locals.queryUser;

    const { _id: _userId } = res.locals.user;

    if (_userId === _queryUserId)
      return res.status(403).json({ message: "Can't follow same user" });

    try {
      const followingExists = await User.findOne({
        $and: [{ _id: _userId }, { following: _queryUserId }],
      });

      if (followingExists)
        return res.status(403).json({ message: "Already Following" });

      await User.findByIdAndUpdate(_userId, {
        $push: { following: _queryUserId },
      });

      await User.findByIdAndUpdate(_queryUserId, {
        $push: { followers: _userId },
      });

      return res.status(200).json({ message: "Follow Successful" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.unfollow = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: _queryUserId } = res.locals.queryUser;

    const { _id: _userId } = res.locals.user;

    if (_userId === _queryUserId)
      return res.status(403).json({ message: "Can't unfollow same user" });

    try {
      const followingExists = await User.findOne({
        $and: [{ _id: _userId }, { following: _queryUserId }],
      });

      if (!followingExists)
        return res.status(403).json({ message: "Not following" });

      await User.findByIdAndUpdate(_userId, {
        $pull: { following: _queryUserId },
      });

      await User.findByIdAndUpdate(_queryUserId, {
        $pull: { followers: _userId },
      });

      return res.status(200).json({ message: "Unfollow Successful" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.likeBlog = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: _blogId, likers } = res.locals.blog;

    const { _id: _userId } = res.locals.user;

    try {
      const likeExist = await Blog.findOne({
        $and: [{ _id: _blogId }, { likers: _userId }],
      });

      if (likeExist) return res.status(403).json({ message: "Already Liked" });

      await Blog.findByIdAndUpdate(_blogId, {
        $push: { likers: _userId },
        likes: likers.length + 1,
      });

      return res.status(200).json({ message: "Liked" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.unlikeBlog = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: _blogId, likers } = res.locals.blog;

    const { _id: _userId } = res.locals.user;

    try {
      const likeExist = await Blog.findOne({
        $and: [{ _id: _blogId }, { likers: _userId }],
      });

      if (!likeExist)
        return res.status(403).json({ message: "ALready Unliked" });

      await Blog.findByIdAndUpdate(_blogId, {
        $pull: { likers: _userId },
        likes: likers.length - 1,
      });

      return res.status(200).json({ message: "Unliked" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.postComment = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: _blogId } = res.locals.blog;

    const { _id: _userId } = res.locals.user;

    const { comment } = req.body;

    try {
      await Blog.findByIdAndUpdate(_blogId, {
        $push: { comments: { commenter: _userId, comment } },
      });

      return res.status(200).json({ message: "Comment Successfull" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.deleteComment = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: _blogId } = res.locals.blog;

    const { _id: _userId } = res.locals.user;

    const { comment } = req.body;
    try {
      await Blog.findByIdAndUpdate(_blogId, {
        $pull: { comments: { commenter: _userId, comment } },
      });

      return res.status(200).json({ message: "Comment Deleted Successfully" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.bookmarkBlog = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: _blogId } = res.locals.blog;

    const { _id: _userId } = res.locals.user;
    try {
      const bookmarkExist = await User.findOne({
        $and: [{ _id: _userId }, { bookmarks: _blogId }],
      });

      if (bookmarkExist)
        return res.status(403).json({ message: "Already Bookmarked" });

      await User.findByIdAndUpdate(_userId, { $push: { bookmarks: _blogId } });

      return res.status(200).json({ message: "Bookmarked Successfully" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.unbookmarkBlog = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: _blogId } = res.locals.blog;

    const { _id: _userId } = res.locals.user;
    try {
      const bookmarkExist = await User.findOne({
        $and: [{ _id: _userId }, { bookmarks: _blogId }],
      });

      if (!bookmarkExist)
        return res.status(403).json({ message: "Already Unbookmarked" });

      await User.findByIdAndUpdate(_userId, { $pull: { bookmarks: _blogId } });

      return res.status(200).json({ message: "Unbookmarked Successfully" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.viewsBlog = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: _blogId, viewers } = res.locals.blog;

    const { _id: _userId } = res.locals.user;

    try {
      const viewersExist = await Blog.findOne({
        $and: [{ _id: _blogId }, { viewers: _userId }],
      });

      if (viewersExist) return res.status(201);

      await Blog.findByIdAndUpdate(_blogId, {
        $push: { viewers: _userId },
        views: viewers.length + 1,
      });

      return res.status(200).json({ message: "Success" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
