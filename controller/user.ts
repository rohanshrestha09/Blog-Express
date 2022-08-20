import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

const storage = getStorage();

module.exports.register = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { fullname, email, password, confirmPassword, dateOfBirth } =
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
        const file = req.files.image as any;

        if (!file.mimetype.startsWith("image/"))
          return res.status(403).json({ message: "Please choose an image" });

        const filename = file.mimetype.replace("image/", `${user._id}.`);

        const storageRef = ref(storage, `users/${filename}`);

        const metadata = {
          contentType: file.mimetype,
        };

        uploadBytes(storageRef, file.data, metadata).then(() => {
          getDownloadURL(storageRef).then(
            async (url) =>
              await User.findByIdAndUpdate(
                new mongoose.Types.ObjectId(user._id),
                { image: url, imageName: filename }
              )
          );
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

module.exports.getProfile = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    return res.status(200).json(res.locals.user);
  }
);

module.exports.getUserProfile = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;

    try {
      const user = await User.findById(new mongoose.Types.ObjectId(_id)).select(
        "-password"
      );

      return res
        .status(200)
        .json({ user, message: "User Fetched Successfully" });
    } catch (err: any) {
      return res.status(404).json(err);
    }
  }
);

module.exports.updateProfile = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;

    const { fullname, bio, dateOfBirth } = req.body;

    const user = res.locals.user;

    try {
      if (req.files) {
        const file = req.files.image as any;

        if (!file.mimetype.startsWith("image/"))
          return res.status(403).json({ message: "Please choose an image" });

        if (user.image) deleteObject(ref(storage, `users/${user.imageName}`));

        const filename = file.mimetype.replace("image/", `${user._id}.`);

        const storageRef = ref(storage, `users/${filename}`);

        const metadata = {
          contentType: file.mimetype,
        };

        uploadBytes(storageRef, file.data, metadata).then(() => {
          getDownloadURL(storageRef).then(
            async (url) =>
              await User.findByIdAndUpdate(
                new mongoose.Types.ObjectId(user._id),
                {
                  image: url,
                  imageName: filename,
                }
              )
          );
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

module.exports.deleteProfile = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;

    const user = res.locals.user;

    try {
      if (user.image) deleteObject(ref(storage, `users/${user.imageName}`));

      await User.findByIdAndDelete(new mongoose.Types.ObjectId(_id));

      return res.status(200).json({ message: "Profile Deleted Successfully" });
    } catch (err: any) {
      return res.status(404).json(err.message);
    }
  }
);

module.exports.deleteProfileImage = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _id } = req.params;

    try {
      const user = await User.findById(new mongoose.Types.ObjectId(_id));

      if (!user)
        return res.status(403).json({ message: "User does not exist" });

      if (user.image) deleteObject(ref(storage, `users/${user.imageName}`));

      await User.findByIdAndUpdate(new mongoose.Types.ObjectId(_id), {
        image: "",
        imageName: "",
      });

      return res
        .status(200)
        .json({ message: "Profile Image Removed Successfully" });
    } catch (err: any) {
      return res.status(404).json(err.message);
    }
  }
);
