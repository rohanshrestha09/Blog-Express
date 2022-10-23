import { Request, Response } from 'express';
import moment from 'moment';
import { serialize } from 'cookie';
import uploadFile from '../middleware/uploadFile';
import deleteFile from '../middleware/deleteFile';
import User from '../model/User';
import Blog from '../model/Blog';
const asyncHandler = require('express-async-handler');

export const authHandler = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).json({ data: res.locals.auth, message: 'Authentication Success' });
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: authId, image, imageName } = res.locals.auth;

    const { fullname, bio, website, dateOfBirth } = req.body;

    try {
      if (req.files) {
        const file = req.files.image as any;

        if (!file.mimetype.startsWith('image/'))
          return res.status(403).json({ message: 'Please choose an image' });

        if (image && imageName) deleteFile(`users/${imageName}`);

        const filename = file.mimetype.replace('image/', `${authId}.`);

        const fileUrl = await uploadFile(file.data, file.mimetype, `users/${filename}`);

        await User.findByIdAndUpdate(authId, {
          image: fileUrl,
          imageName: filename,
        });
      }

      await User.findByIdAndUpdate(authId, {
        fullname,
        bio,
        website,
        dateOfBirth: new Date(moment(dateOfBirth).format()),
      });

      return res.status(200).json({ message: 'Profile Updated Successfully' });
    } catch (err: Error | any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

export const deleteImage = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { _id: authId, image, imageName } = res.locals.auth;

  try {
    if (image && imageName) deleteFile(imageName);

    await User.findByIdAndUpdate(authId, {
      image: null,
      imageName: null,
    });

    return res.status(200).json({ message: 'Profile Image Removed Successfully' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const deleteProfile = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id: authId, image, imageName } = res.locals.auth;

    try {
      if (image && imageName) deleteFile(`users/${imageName}`);

      await User.findByIdAndDelete(authId);

      return res.status(200).json({ message: 'Profile Deleted Successfully' });
    } catch (err: Error | any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

export const logout = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  try {
    const serialized = serialize('token', '', {
      maxAge: 0,
      path: '/',
    });

    res.setHeader('Set-Cookie', serialized);

    return res.status(200).json({ message: 'Logout Successful' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const followers = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { followers } = res.locals.auth;

  const { pageSize, search } = req.query;

  let query = { _id: followers };

  if (search) query = Object.assign({ $text: { $search: String(search).toLowerCase() } }, query);

  try {
    return res.status(200).json({
      message: 'Followers fetched successfully',
      data: await User.find(query)
        .select('-password')
        .limit(Number(pageSize || 20)),
      count: await User.countDocuments(query),
    });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const following = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { following } = res.locals.auth;

  const { pageSize, search } = req.query;

  let query = { _id: following };

  if (search) query = Object.assign({ $text: { $search: String(search).toLowerCase() } }, query);

  try {
    return res.status(200).json({
      message: 'Following fetched successfully',
      data: await User.find(query)
        .select('-password')
        .limit(Number(pageSize || 20)),
      count: await User.countDocuments(query),
    });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const blogs = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { blogs } = res.locals.auth;

  const { sort, sortOrder, pageSize, genre, isPublished, search } = req.query;

  let query = { _id: blogs };

  if (genre) query = Object.assign({ genre: { $in: String(genre).split(',') } }, query);

  if (isPublished) query = Object.assign({ isPublished: isPublished === 'true' }, query);

  if (search) query = Object.assign({ $text: { $search: String(search).toLowerCase() } }, query);

  try {
    return res.status(200).json({
      data: await Blog.find(query)
        .sort({ [String(sort || 'likes')]: sortOrder === 'asc' ? 1 : -1 })
        .limit(Number(pageSize || 20))
        .populate('author', '-password'),
      count: await Blog.countDocuments(query),
      message: 'Blogs Fetched Successfully',
    });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const bookmarks = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { bookmarks } = res.locals.auth;

  const { pageSize, genre, search } = req.query;

  let query = { _id: bookmarks, isPublished: true };

  if (genre) query = Object.assign({ genre: { $in: String(genre).split(',') } }, query);

  if (search) query = Object.assign({ $text: { $search: String(search).toLowerCase() } }, query);

  try {
    return res.status(200).json({
      data: await Blog.find(query)
        .limit(Number(pageSize || 20))
        .populate('author', '-password'),
      count: await Blog.countDocuments(query),
      message: 'Bookmarks Fetched Successfully',
    });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const followingBlogs = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { following } = res.locals.auth;

    const { pageSize } = req.query;

    let query = { author: following, isPublished: true };

    try {
      return res.status(200).json({
        data: await Blog.find(query)
          .limit(Number(pageSize || 20))
          .populate('author', '-password'),
        count: await Blog.countDocuments(query),
        message: 'Following Blogs Fetched Successfully',
      });
    } catch (err: Error | any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

export const follow = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const {
    auth: { _id: authId, followingCount },
    user: { _id: userId, followersCount },
  } = res.locals;

  if (authId.toString() === userId.toString())
    return res.status(403).json({ message: "Can't follow same user" });

  try {
    const followingExists = await User.findOne({
      $and: [{ _id: authId }, { following: userId }],
    });

    if (followingExists) return res.status(403).json({ message: 'Already Following' });

    await User.findByIdAndUpdate(authId, {
      $push: { following: userId },
      followingCount: followingCount + 1,
    });

    await User.findByIdAndUpdate(userId, {
      $push: { followers: authId },
      followersCount: followersCount + 1,
    });

    return res.status(200).json({ message: 'Follow Successful' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const unfollow = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const {
    auth: { _id: authId, followingCount },
    user: { _id: userId, followersCount },
  } = res.locals;

  if (authId.toString() === userId.toString())
    return res.status(403).json({ message: "Can't unfollow same user" });

  try {
    const followingExists = await User.findOne({
      $and: [{ _id: authId }, { following: userId }],
    });

    if (!followingExists) return res.status(403).json({ message: 'Not following' });

    await User.findByIdAndUpdate(authId, {
      $pull: { following: userId },
      followingCount: followingCount - 1,
    });

    await User.findByIdAndUpdate(userId, {
      $pull: { followers: authId },
      followersCount: followersCount - 1,
    });

    return res.status(200).json({ message: 'Unfollow Successful' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});
