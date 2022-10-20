import { NextFunction, Request, Response } from 'express';
import { JwtPayload, Secret, verify } from 'jsonwebtoken';
import { serialize } from 'cookie';
import asyncHandler from 'express-async-handler';
import User from '../model/User';

declare global {
  namespace Express {
    interface Request {
      shouldSkip: boolean;
    }
  }
}

export default asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    if (req.shouldSkip) return next();

    const { token } = req.cookies;

    if (!token) return res.status(401).json({ message: 'Not authorised' });

    try {
      const { _id } = verify(token, process.env.JWT_TOKEN as Secret) as JwtPayload;

      const auth = await User.findById(_id).select('-password');

      if (!auth) {
        const serialized = serialize('token', '', {
          maxAge: 0,
          path: '/',
        });

        res.setHeader('Set-Cookie', serialized);

        return res.status(404).json({ message: 'User does not exist' });
      }

      res.locals.auth = auth;

      next();
    } catch (err: Error | any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
