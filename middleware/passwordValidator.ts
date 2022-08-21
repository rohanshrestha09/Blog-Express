import { Response, Request, NextFunction } from "express";
import mongoose from "mongoose";
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../model/User");

module.exports = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { _userId } = req.params;

    const { password } = req.body;

    try {
      if (!password)
        return res.status(403).json({ message: "Please input password" });

      const user = await User.findById(
        new mongoose.Types.ObjectId(_userId)
      ).select("+password");

      if (!user)
        return res.status(403).json({ message: "User does not exist" });

      const isMatched: boolean = await bcrypt.compare(password, user.password);

      if (!isMatched)
        return res.status(403).json({ message: "Incorrect Password" });

      res.locals.user = user;

      next();
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
