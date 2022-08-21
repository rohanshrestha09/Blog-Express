import { Request, Response } from "express";
import mongoose from "mongoose";
const asyncHandler = require("express-async-handler");
const User = require("../model/User");

module.exports.follow = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _userId } = req.params;

    const { toFollowId } = req.body;

    try {
      const followingExists = await User.findOne({
        $and: [
          { _id: new mongoose.Types.ObjectId(_userId) },
          { following: [new mongoose.Types.ObjectId(toFollowId)] },
        ],
      });

      if (followingExists)
        return res.status(403).json({ message: "Already Following" });

      await User.findByIdAndUpdate(new mongoose.Types.ObjectId(_userId), {
        $push: { following: new mongoose.Types.ObjectId(toFollowId) },
      });

      await User.findByIdAndUpdate(new mongoose.Types.ObjectId(toFollowId), {
        $push: { followers: new mongoose.Types.ObjectId(_userId) },
      });

      return res.status(200).json({ message: "Follow Successful" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);

module.exports.unfollow = asyncHandler(
  async (req: Request, res: Response): Promise<Response> => {
    const { _userId } = req.params;

    const { toUnfollowId } = req.body;

    try {
      await User.findByIdAndUpdate(new mongoose.Types.ObjectId(_userId), {
        $pull: { following: new mongoose.Types.ObjectId(toUnfollowId) },
      });

      await User.findByIdAndUpdate(new mongoose.Types.ObjectId(toUnfollowId), {
        $pull: { followers: new mongoose.Types.ObjectId(_userId) },
      });

      return res.status(200).json({ message: "Unfollow Successful" });
    } catch (err: any) {
      return res.status(404).json({ message: err.message });
    }
  }
);
