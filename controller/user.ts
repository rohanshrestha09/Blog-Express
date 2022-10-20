import { Request, Response } from 'express';
import moment from 'moment';
import bcrypt from 'bcryptjs';
import { sign, Secret } from 'jsonwebtoken';
import { serialize } from 'cookie';
import uploadFile from '../middleware/uploadFile';
import User from '../model/User';
import Blog from '../model/Blog';
const asyncHandler = require('express-async-handler');

export const register = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { fullname, email, password, confirmPassword, dateOfBirth } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists)
      return res.status(403).json({ message: 'User already exists. Choose a different email.' });

    if (!password || password < 8)
      return res.status(403).json({ message: 'Password must contain atleast 8 characters.' });

    if (password !== confirmPassword)
      return res.status(403).json({ message: 'Password does not match.' });

    const salt = await bcrypt.genSalt(10);

    const encryptedPassword: string = await bcrypt.hash(password, salt);

    const { _id: authId } = await User.create({
      fullname,
      email,
      password: encryptedPassword,
      dateOfBirth: new Date(moment(dateOfBirth).format()),
    });

    if (req.files) {
      const file = req.files.image as any;

      if (!file.mimetype.startsWith('image/'))
        return res.status(403).json({ message: 'Please choose an image' });

      const filename = file.mimetype.replace('image/', `${authId}.`);

      const fileUrl = await uploadFile(file.data, file.mimetype, `users/${filename}`);

      await User.findByIdAndUpdate(authId, {
        image: fileUrl,
        imageName: filename,
      });
    }

    const token: string = sign({ _id: authId }, process.env.JWT_TOKEN as Secret, {
      expiresIn: '30d',
    });

    const serialized = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    res.setHeader('Set-Cookie', serialized);

    return res.status(200).json({ token, message: 'Signup Successful' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) return res.status(404).json({ message: 'User does not exist.' });

    const isMatched: boolean = await bcrypt.compare(password, user.password as string);

    if (!isMatched) return res.status(403).json({ message: 'Incorrect Password' });

    const token: string = sign({ _id: user._id }, process.env.JWT_TOKEN as Secret, {
      expiresIn: '30d',
    });

    const serialized = serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    res.setHeader('Set-Cookie', serialized);

    return res.status(200).json({ token, message: 'Login Successful' });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const user = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  try {
    return res.status(200).json({
      data: res.locals.user,
      message: 'User Fetched Successfully',
    });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const blog = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { blogs } = res.locals.user;

  const { pageSize } = req.query;

  let query = { _id: blogs, isPublished: true };

  try {
    return res.status(200).json({
      data: await Blog.find(query)
        .sort({ likes: -1 })
        .limit(Number(pageSize || 20))
        .populate('author', '-password'),
      count: await Blog.countDocuments(query),
      message: 'Blogs Fetched Successfully',
    });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});

export const followers = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { followers } = res.locals.user;

  const { search, pageSize } = req.query;

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
  const { following } = res.locals.user;

  const { search, pageSize } = req.query;

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
