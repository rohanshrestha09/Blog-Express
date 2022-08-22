import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const Blog = require("../model/Blog");

module.exports = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _queryUserId } = req.params;

    try {
      const queryUser = await User.findById(
        new mongoose.Types.ObjectId(_queryUserId)
      ).select("-password");

      if (!queryUser)
        return res.status(404).json({ message: "User does not exist" });

      res.locals.queryUser = {
        ...queryUser._doc,
        blogs: await Blog.find({ author: _queryUserId }),
      };

      next();
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
