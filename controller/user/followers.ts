import { Request, Response } from 'express';
import User from '../../model/User';
const asyncHandler = require('express-async-handler');

export const followers = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
  const { followers } = res.locals.user;

  const { search, pageSize } = req.query;

  let query = { _id: followers };

  if (search) query = Object.assign({ $text: { $search: String(search).toLowerCase() } }, query);

  try {
    return res.status(200).json({
      message: 'Followers fetched successfully',
      data: await User.find(query)
        .select('-password -email')
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
        .select('-password -email')
        .limit(Number(pageSize || 20)),
      count: await User.countDocuments(query),
    });
  } catch (err: Error | any) {
    return res.status(404).json({ message: err.message });
  }
});
