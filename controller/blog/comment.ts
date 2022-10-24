import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Blog from '../../model/Blog';
import User from '../../model/User';
const asyncHandler = require('express-async-handler');

export const comments = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { comments }: { comments: { user: Types.ObjectId; comment: string }[] } = res.locals.blog;

  const { pageSize } = req.query;

  try {
    const users = await User.find({ _id: comments.map(({ user }) => user) }).select(
      '-password -email'
    );

    const commentsOutput = comments.map(({ user, comment }) => {
      return { user: users.find(({ _id }) => _id.toString() === user.toString()), comment };
    });

    return res.status(200).json({
      data: commentsOutput.slice(0, Number(pageSize || 20)),
      count: commentsOutput.length,
      message: 'Comments Fetched Successfully',
    });
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
