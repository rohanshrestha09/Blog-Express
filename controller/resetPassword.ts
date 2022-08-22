import { Request, Response } from "express";
import mongoose from "mongoose";
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User");

module.exports.resetLink = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) return res.status(404).json({ message: "Invalid Email" });

      const token: string = jwt.sign(
        { _id: user._id },
        `${process.env.JWT_PASSWORD}${user.password}`,
        { expiresIn: "15min" }
      );

      /* const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          user: process.env.MAILING_EMAIL,
          pass: process.env.MAILING_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: '"don't reply 123" <blogsansar0@gmail.com>',
        to: email,
        subject: "Password Reset Link",
        text: "Link",
        html: `<a href={{baseUrl}}/reset-password"/${user._id}/${token}>{{baseUrl}}/reset-password"/${user._id}/${token}</a>`,
      });

      await transporter.sendMail(info);*/

      return res.status(200).json({
        passwordResetLink: `{{baseUrl}}/reset-password"/${user._id}/${token}`,
      });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.resetPassword = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.params;

    const { _id: _userId } = res.locals.queryUser;

    const { password } = req.body;

    if (!token) return res.status(403).json({ message: "Invalid token" });

    if (password < 8)
      return res
        .status(403)
        .json({ message: "Password must contain atleast 8 characters" });

    try {
      const { password: oldPassword } = await User.findById(_userId).select(
        "+password"
      );

      const { _id } = jwt.verify(
        token,
        `${process.env.JWT_PASSWORD}${oldPassword}`
      );

      const salt = await bcrypt.genSalt(10);

      const encryptedPassword: string = await bcrypt.hash(password, salt);

      await User.findByIdAndUpdate(new mongoose.Types.ObjectId(_id), {
        password: encryptedPassword,
      });

      return res.status(200).json({ message: "Password Reset Successful" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
