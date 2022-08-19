import { NextFunction, Request, Response } from "express";
const User = require("../model/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

module.exports = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    let token;

    const { authorization } = req.headers;

    if (authorization && authorization.startsWith("Bearer"))
      token = authorization.split(" ")[1];

    if (!token) return res.status(403).json({ message: "Not authorised" });

    try {
      const { _id } = jwt.verify(token, process.env.JWT_TOKEN);

      const user = await User.findById(_id).select("-password");

      if (!user) return res.status(404).json({ message: "Not found" });

      res.locals.user = user;
      next();
    } catch (err: any) {
      return res.status(404).json(err.message);
    }
  }
);
