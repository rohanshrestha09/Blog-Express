import { Request, Response } from 'express';
import uploadFile from '../middleware/uploadFile';
import deleteFile from '../middleware/deleteFile';
import Blog from '../model/Blog';
import User from '../model/User';
import { genre as genreCollection } from '../misc';
const asyncHandler = require('express-async-handler');

export const blogs = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { sort, pageSize, genre, search } = req.query;

  let query = { isPublished: true };

  if (genre) query = Object.assign({ genre: { $in: String(genre).split(',') } }, query);

  if (search) query = Object.assign({ $text: { $search: String(search).toLowerCase() } }, query);

  try {
    return res.status(200).json({
      data: await Blog.find(query)
        .sort({ [String(sort || 'likes')]: -1 })
        .limit(Number(pageSize || 20))
        .populate('author', '-password'),
      count: await Blog.countDocuments(query),
      message: 'Blogs Fetched Successfully',
    });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const blog = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json({ data: res.locals.blog, message: 'Blog Fetched Successfully' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const postBlog = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { _id: authId } = res.locals.auth;

  const { title, content, genre, isPublished } = req.body;

  try {
    if (!req.files) return res.status(403).json({ message: 'Image required' });

    const { _id: blogId } = await Blog.create({
      author: authId,
      title,
      content,
      genre,
      isPublished,
    });

    const file = req.files.image as any;

    if (!file.mimetype.startsWith('image/'))
      return res.status(403).json({ message: 'Please choose an image' });

    const filename = file.mimetype.replace('image/', `${blogId}.`);

    const fileUrl = await uploadFile(file.data, file.mimetype, `blogs/${filename}`);

    await Blog.findByIdAndUpdate(blogId, {
      image: fileUrl,
      imageName: filename,
    });

    await User.findByIdAndUpdate(authId, { $push: { blogs: blogId } });

    return res.status(200).json({ message: 'Blog Posted Successfully' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const updateBlog = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { _id: blogId, image, imageName } = res.locals.blog;

  const { title, content, genre } = req.body;

  try {
    if (req.files) {
      const file = req.files.image as any;

      if (!file.mimetype.startsWith('image/'))
        return res.status(403).json({ message: 'Please choose an image' });

      if (image && imageName) deleteFile(`blogs/${imageName}`);

      const filename = file.mimetype.replace('image/', `${blogId}.`);

      const fileUrl = await uploadFile(file.data, file.mimetype, `blogs/${filename}`);

      await Blog.findByIdAndUpdate(blogId, {
        image: fileUrl,
        imageName: filename,
      });
    }

    await Blog.findByIdAndUpdate(blogId, {
      title,
      content,
      genre,
    });

    return res.status(200).json({ message: 'Blog Updated Successfully' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const deleteBlog = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { _id: authId } = res.locals.auth;

  const { _id: blogId, image, imageName } = res.locals.blog;

  try {
    if (image && imageName) deleteFile(`blogs/${imageName}`);

    await Blog.findByIdAndDelete(blogId);

    await User.findByIdAndUpdate(authId, { $pull: { blogs: blogId } });

    return res.status(200).json({ message: 'Blog Deleted Successfully' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const genre = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  res.setHeader('Cache-Control', 'public,max-age=86400');

  return res.status(200).json({ data: genreCollection, message: 'Genre Fetched Successfully' });
});

export const publish = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { _id: blogId } = res.locals.blog;

  try {
    await Blog.findByIdAndUpdate(blogId, { isPublished: true });

    return res.status(200).json({ message: 'Blog Published Successfully' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const unpublish = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { _id: blogId } = res.locals.blog;

  try {
    await Blog.findByIdAndUpdate(blogId, { isPublished: false });

    return res.status(200).json({ message: 'Blog Unpublished Successfully' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const like = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const {
    auth: { _id: authId },
    blog: { _id: blogId, likesCount },
  } = res.locals;

  try {
    const likeExist = await Blog.findOne({
      $and: [{ _id: blogId }, { likers: authId }],
    });

    if (likeExist) return res.status(403).json({ message: 'Already Liked' });

    await Blog.findByIdAndUpdate(blogId, {
      $push: { likers: authId },
      likes: likesCount + 1,
    });

    await User.findByIdAndUpdate(authId, {
      $push: { liked: blogId },
    });

    return res.status(200).json({ message: 'Liked' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const unlike = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const {
    auth: { _id: authId },
    blog: { _id: blogId, likesCount },
  } = res.locals;

  try {
    const likeExist = await Blog.findOne({
      $and: [{ _id: blogId }, { likers: authId }],
    });

    if (!likeExist) return res.status(403).json({ message: 'ALready Unliked' });

    await Blog.findByIdAndUpdate(blogId, {
      $pull: { likers: authId },
      likes: likesCount - 1,
    });

    await User.findByIdAndUpdate(authId, {
      $pull: { liked: blogId },
    });

    return res.status(200).json({ message: 'Unliked' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const bookmark = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const {
    auth: { _id: authId },
    blog: { _id: blogId },
  } = res.locals;

  try {
    const bookmarkExist = await User.findOne({
      $and: [{ _id: authId }, { bookmarks: blogId }],
    });

    if (bookmarkExist) return res.status(403).json({ message: 'Already Bookmarked' });

    await User.findByIdAndUpdate(authId, { $push: { bookmarks: blogId } });

    return res.status(200).json({ message: 'Bookmarked Successfully' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const unbookmark = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const {
    auth: { _id: authId },
    blog: { _id: blogId },
  } = res.locals;

  try {
    const bookmarkExist = await User.findOne({
      $and: [{ _id: authId }, { bookmarks: blogId }],
    });

    if (!bookmarkExist) return res.status(403).json({ message: 'Already Unbookmarked' });

    await User.findByIdAndUpdate(authId, { $pull: { bookmarks: blogId } });

    return res.status(200).json({ message: 'Unbookmarked Successfully' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const comment = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const {
    auth: { _id: authId },
    blog: { _id: blogId, commentsCount },
  } = res.locals;

  const { comment } = req.body;

  try {
    await Blog.findByIdAndUpdate(blogId, {
      $push: { comments: { commenter: authId, comment } },
      commentsCount: commentsCount + 1,
    });

    return res.status(200).json({ message: 'Comment Successfull' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const uncomment = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const {
    auth: { _id: authId },
    blog: { _id: blogId, commentsCount },
  } = res.locals;

  const { comment } = req.body;

  try {
    await Blog.findByIdAndUpdate(blogId, {
      $pull: { comments: { commenter: authId, comment } },
      commentsCount: commentsCount - 1,
    });

    return res.status(200).json({ message: 'Comment Deleted Successfully' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});
