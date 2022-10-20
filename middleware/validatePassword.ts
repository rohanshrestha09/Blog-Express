import { Response, Request, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import User from '../model/User';

export default asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id: authId } = res.locals.auth;

    const { password } = req.body;

    try {
      if (!password) return res.status(403).json({ message: 'Please input password' });

      const auth = await User.findById(authId).select('+password');

      if (!auth) return res.status(404).json({ message: 'User does not exist' });

      const isMatched: boolean = await bcrypt.compare(password, auth.password as string);

      if (!isMatched) return res.status(403).json({ message: 'Incorrect Password' });

      next();
    } catch (err: Error | any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
