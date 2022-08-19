import { Request, Response } from "express";
import mongoose from "mongoose";
const glob = require("glob");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const User = require("../model/User");

module.exports.register = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { fullname, email, password, confirmPassword, dateOfBirth, image } =
      req.body;

    try {
      const userExists = await User.findOne({ email });

      if (userExists)
        return res
          .status(403)
          .json({ message: "User already exists. Choose a different email." });

      if (password !== confirmPassword)
        return res.status(403).json({ message: "Password does not match." });

      if (password < 8)
        return res
          .status(403)
          .json({ message: "Password must contain atleast 8 characters." });

      const salt = await bcrypt.genSalt(10);

      const encryptedPassword: string = await bcrypt.hash(password, salt);

      const user = await User.create({
        fullname,
        email,
        password: encryptedPassword,
        dateOfBirth,
      });

      if (req.files) {
        const file = req.files.image;

        //@ts-ignore
        if (!file.mimetype.includes("image/"))
          return res.status(403).json({ message: "Please choose an image" });

        //@ts-ignore
        const filename = file.mimetype.replace("image/", `${user._id}.`);

        //@ts-ignore
        file.mv(`${__dirname}/../media/user/${filename}`, function (err: any) {
          if (err) throw err;
          else {
            user.image = `/media/user/${filename}`;
            user.save();
          }
        });
      }

      const token: string = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, {
        expiresIn: "20d",
      });

      return res.status(200).json({ token, message: "Signup Successful" });
    } catch (err: any) {
      return res.status(404).json(err.message);
    }
  }
);

module.exports.login = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select("+password");

      if (!user)
        return res.status(403).json({ message: "User does not exist." });

      const isMatched: boolean = await bcrypt.compare(password, user.password);

      if (!isMatched)
        return res.status(403).json({ message: "Incorrect Password" });

      const token: string = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, {
        expiresIn: "20d",
      });

      return res.status(200).json({ token, message: "Login Successful" });
    } catch (err: any) {
      return res.status(404).json(err.message);
    }
  }
);

module.exports.profile = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json(res.locals.user);
  }
);

module.exports.updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const { _id } = req.params;

    const { fullname, password, bio, dateOfBirth } = req.body;

    try {
      if (!password)
        return res.status(403).json({ message: "Please input password" });

      const user = await User.findById(new mongoose.Types.ObjectId(_id));

      if (!user)
        return res.status(403).json({ message: "User does not exist" });

      const isMatched: boolean = await bcrypt.compare(password, user.password);

      if (!isMatched)
        return res.status(403).json({ message: "Incorrect Password" });

      if (req.files) {
        const file = req.files.image;

        //@ts-ignore
        if (!file.mimetype.includes("image/"))
          return res.status(403).json({ message: "Please choose an image" });

        fs.unlink(
          glob(`**${__dirname}/../media/user/${user._id}.*`),
          (err: any) => {
            if (err) throw err;
          }
        );

        //@ts-ignore
        const filename = file.mimetype.replace("image/", `${user._id}.`);

        //@ts-ignore
        file.mv(`${__dirname}/../media/user/${filename}`, (err: any) => {
          if (err) throw err;
          else {
            user.image = `/media/user/${filename}`;
            user.save();
          }
        });
      }

      await User.findByIdAndUpdate(new mongoose.Types.ObjectId(_id), {
        fullname,
        bio,
        dateOfBirth,
      });

      return res.status(200).json({ message: "Profile Updated Successfully" });
    } catch (err: any) {
      return res.status(404).json(err.message);
    }
  }
);
