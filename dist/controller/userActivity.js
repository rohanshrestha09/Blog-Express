"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
module.exports.follow = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { toFollowId } = req.body;
    try {
        const followingExists = yield User.findOne({
            $and: [
                { _id: new mongoose_1.default.Types.ObjectId(_id) },
                { following: [new mongoose_1.default.Types.ObjectId(toFollowId)] },
            ],
        });
        if (followingExists)
            return res.status(403).json({ message: "Already Following" });
        yield User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(_id), {
            $push: { following: new mongoose_1.default.Types.ObjectId(toFollowId) },
        });
        yield User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(toFollowId), {
            $push: { followers: new mongoose_1.default.Types.ObjectId(_id) },
        });
        return res.status(200).json({ message: "Follow Successful" });
    }
    catch (err) {
        return res.status(404).json(err.message);
    }
}));
module.exports.unfollow = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { toUnfollowId } = req.body;
    try {
        yield User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(_id), {
            $pull: { following: new mongoose_1.default.Types.ObjectId(toUnfollowId) },
        });
        yield User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(toUnfollowId), {
            $pull: { followers: new mongoose_1.default.Types.ObjectId(_id) },
        });
        return res.status(200).json({ message: "Unfollow Successful" });
    }
    catch (err) {
        return res.status(404).json(err.message);
    }
}));
