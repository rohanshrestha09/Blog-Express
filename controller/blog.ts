import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  uploadBytes,
  ref,
  getDownloadURL,
  getStorage,
  deleteObject,
} from "firebase/storage";
const asyncHandler = require("express-async-handler");
const Blog = require("../model/Blog");
const User = require("../model/User");

const storage = getStorage();

module.exports.getAllBlogs = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { sort, pageSize } = req.query;

    try {
      switch (sort) {
        case "likes":
          return res.status(200).json({
            blogs: await Blog.find({})
              .sort({ likes: -1 })
              .limit(pageSize || 10),
            message: "Blogs Fetched Successfully",
          });

        case "views":
          return res.status(200).json({
            blogs: await Blog.find({})
              .sort({ views: -1 })
              .limit(pageSize || 10),
            message: "Blogs Fetched Successfully",
          });

        default:
          return res.status(200).json({
            blogs: await Blog.find({}).limit(pageSize || 10),
            message: "Blogs Fetched Successfully",
          });
      }
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.getBlog = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _blogId } = req.params;

    try {
      const blog = await Blog.findById(new mongoose.Types.ObjectId(_blogId));

      if (!blog)
        return res.status(403).json({ message: "Blog does not exist" });

      return res
        .status(200)
        .json({ blog, message: "Blog Fetched Successfully" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.postBlog = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _authorId } = req.params;

    const { title, content } = req.body;

    try {
      if (!title)
        return res.status(403).json({ message: "Title field missing" });

      if (!req.files)
        return res.status(403).json({ message: "Image required" });

      const blog = await Blog.create({
        author: new mongoose.Types.ObjectId(_authorId),
        title,
        content,
      });

      const file = req.files.image as any;

      if (!file.mimetype.startsWith("image/"))
        return res.status(403).json({ message: "Please choose an image" });

      const filename = file.mimetype.replace("image/", `${blog._id}.`);

      const storageRef = ref(storage, `blogs/${filename}`);

      const metadata = {
        contentType: file.mimetype,
      };

      await uploadBytes(storageRef, file.data, metadata);

      const url = await getDownloadURL(storageRef);

      await Blog.findByIdAndUpdate(new mongoose.Types.ObjectId(blog._id), {
        image: url,
        imageName: filename,
      });

      /*   await User.findByIdAndUpdate(new mongoose.Types.ObjectId(_authorId), {
        $push: {
          blogs: await Blog.findById(new mongoose.Types.ObjectId(blog._id)),
        },
      }); */

      return res.status(200).json({ message: "Blog Posted Successfully" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.updateBlog = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _blogId } = req.params;

    const { title, content } = req.body;

    try {
      if (!title)
        return res.status(403).json({ message: "Title field missing" });

      if (!req.files)
        return res.status(403).json({ message: "Image required" });

      const blog = await Blog.findById(new mongoose.Types.ObjectId(_blogId));

      /* await User.findByIdAndUpdate(new mongoose.Types.ObjectId(blog.author), {
        $pull: {
          blogs: blog,
        },
      }); */

      const file = req.files.image as any;

      if (!file.mimetype.startsWith("image/"))
        return res.status(403).json({ message: "Please choose an image" });

      if (blog.image) deleteObject(ref(storage, `blogs/${blog.imageName}`));

      const filename = file.mimetype.replace("image/", `${_blogId}.`);

      const storageRef = ref(storage, `blogs/${filename}`);

      const metadata = {
        contentType: file.mimetype,
      };

      await uploadBytes(storageRef, file.data, metadata);

      const url = getDownloadURL(storageRef);

      await Blog.findByIdAndUpdate(new mongoose.Types.ObjectId(_blogId), {
        image: url,
        imageName: filename,
        title,
        content,
      });

      /*   await User.findByIdAndUpdate(new mongoose.Types.ObjectId(_authorId), {
        $push: {
          blogs: await Blog.findById(new mongoose.Types.ObjectId(_blogId)),
        },
      }); */

      return res.status(200).json({ message: "Blog Posted Successfully" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.deleteBlog = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _blogId } = req.params;

    try {
      const blog = await Blog.findById(new mongoose.Types.ObjectId(_blogId));

      if (!blog)
        return res.status(403).json({ message: "Blog does not exist" });

      if (blog.image) deleteObject(ref(storage, `blogs/${blog.imageName}`));

      await Blog.findByIdAndDelete(new mongoose.Types.ObjectId(_blogId));

      return res.status(200).json({ message: "Blog Deleted Successfully" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
