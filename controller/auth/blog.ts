import { Request, Response } from 'express';
import Blog from '../../model/Blog';
const asyncHandler = require('express-async-handler');

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
        .populate('author', '-password -email'),
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
        .populate('author', '-password -email'),
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
          .populate('author', '-password -email'),
        count: await Blog.countDocuments(query),
        message: 'Following Blogs Fetched Successfully',
      });
    } catch (err: Error | any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
