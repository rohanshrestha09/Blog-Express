import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
const asyncHandler = require("express-async-handler");
const Blog = require("../model/Blog");

module.exports = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _blogId } = req.params;

    try {
      const blog = await Blog.findById(new mongoose.Types.ObjectId(_blogId));

      if (!blog)
        return res.status(404).json({ message: "Blog does not exist" });

      res.locals.blog = blog;

      next();
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
