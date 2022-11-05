import { NextFunction, Request, Response } from 'express';
import { JwtPayload, Secret, verify } from 'jsonwebtoken';
import { serialize } from 'cookie';
import User from '../model/User';
const asyncHandler = require('express-async-handler');

/*declare global {
  namespace Express {
    interface Request {
      shouldSkip: boolean;
    }
  }
}*/

export default asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    const {
      headers: { cookie },
    } = req;

    if (cookie) {
      const values = cookie.split(';').reduce((res, item) => {
        const [name, value] = item.trim().split('=');
        return { ...res, [name]: value };
      }, {});
      res.locals.cookie = values;
    } else res.locals.cookie = {};

    const { token } = res.locals.cookie;

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
