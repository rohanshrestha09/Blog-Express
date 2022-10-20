import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import Blog from '../model/Blog';

export default asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { blog: blogId } = req.params || req.query;

    try {
      const blog = await Blog.findById(blogId).populate('author', '-password');

      if (!blog) return res.status(404).json({ message: 'Blog does not exist' });

      res.locals.blog = blog;

      next();
    } catch (err: Error | any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
