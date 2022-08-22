import { Response, Request, NextFunction } from "express";
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../model/User");

module.exports = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _id: _userId } = res.locals.user;

    const { password } = req.body;

    try {
      if (!password)
        return res.status(403).json({ message: "Please input password" });

      const user = await User.findById(_userId).select("+password");

      const isMatched: boolean = await bcrypt.compare(password, user.password);

      if (!isMatched)
        return res.status(403).json({ message: "Incorrect Password" });

      next();
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
