import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../model/User');
const Blog = require('../model/Blog');

module.exports = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { authorization } = req.headers;

    const [_, token] =
      authorization && authorization.startsWith('Bearer') ? authorization.split(' ') : [];

    if (!token) return res.status(401).json({ message: 'Not authorised' });

    try {
      const { _id } = jwt.verify(token, process.env.JWT_TOKEN);

      const user = await User.findById(new mongoose.Types.ObjectId(_id)).select('-password');

      if (!user) return res.status(404).json({ message: 'User does not exist' });

      res.locals.user = {
        ...user._doc,
        blogs: await Blog.find({ _id: user.blogs }),
        bookmarks: await Blog.find({ _id: user.bookmarks }),
      };

      next();
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
