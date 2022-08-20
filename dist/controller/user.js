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
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const User = require("../model/User");
module.exports.register = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, confirmPassword, dateOfBirth } = req.body;
    try {
        const userExists = yield User.findOne({ email });
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
        const salt = yield bcrypt.genSalt(10);
        const encryptedPassword = yield bcrypt.hash(password, salt);
        const user = yield User.create({
            fullname,
            email,
            password: encryptedPassword,
            dateOfBirth,
        });
        if (req.files) {
            const file = req.files.image;
            //@ts-ignore
            if (!file.mimetype.startsWith("image/"))
                return res.status(403).json({ message: "Please choose an image" });
            //@ts-ignore
            const filename = file.mimetype.replace("image/", `${user._id}.`);
            //@ts-ignore
            file.mv(path.join(__dirname, "/../uploads/users/", filename), function (err) {
                if (err)
                    throw err;
                else {
                    user.image = `/uploads/users/${filename}`;
                    user.save();
                }
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, {
            expiresIn: "20d",
        });
        return res.status(200).json({ token, message: "Signup Successful" });
    }
    catch (err) {
        return res.status(404).json(err.message);
    }
}));
module.exports.login = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User.findOne({ email }).select("+password");
        if (!user)
            return res.status(403).json({ message: "User does not exist." });
        const isMatched = yield bcrypt.compare(password, user.password);
        if (!isMatched)
            return res.status(403).json({ message: "Incorrect Password" });
        const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, {
            expiresIn: "20d",
        });
        return res.status(200).json({ token, message: "Login Successful" });
    }
    catch (err) {
        return res.status(404).json(err.message);
    }
}));
module.exports.getProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json(res.locals.user);
}));
module.exports.updateProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { fullname, password, bio, dateOfBirth } = req.body;
    try {
        if (!password)
            return res.status(403).json({ message: "Please input password" });
        const user = yield User.findById(new mongoose_1.default.Types.ObjectId(_id)).select("+password");
        if (!user)
            return res.status(403).json({ message: "User does not exist" });
        const isMatched = yield bcrypt.compare(password, user.password);
        if (!isMatched)
            return res.status(403).json({ message: "Incorrect Password" });
        if (req.files) {
            const file = req.files.image;
            //@ts-ignore
            if (!file.mimetype.startsWith("image/"))
                return res.status(403).json({ message: "Please choose an image" });
            if (user.image)
                fs.unlink(path.join(__dirname, "/..", user.image), (err) => {
                    if (err)
                        throw err;
                });
            //@ts-ignore
            const filename = file.mimetype.replace("image/", `${user._id}.`);
            //@ts-ignore
            file.mv(path.join(__dirname, "/../uploads/users/", filename), (err) => {
                if (err)
                    throw err;
                else {
                    user.image = `/uploads/users/${filename}`;
                    user.save();
                }
            });
        }
        yield User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(_id), {
            fullname,
            bio,
            dateOfBirth,
        });
        return res.status(200).json({ message: "Profile Updated Successfully" });
    }
    catch (err) {
        return res.status(404).json(err.message);
    }
}));
module.exports.deleteProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { password } = req.body;
    try {
        if (!password)
            return res.status(403).json({ message: "Please input password" });
        const user = yield User.findById(new mongoose_1.default.Types.ObjectId(_id)).select("+password");
        if (!user)
            return res.status(403).json({ message: "User does not exist" });
        const isMatched = yield bcrypt.compare(password, user.password);
        if (!isMatched)
            return res.status(403).json({ message: "Incorrect Password" });
        if (user.image)
            fs.unlink(path.join(__dirname, "/..", user.image), (err) => {
                if (err)
                    throw err;
            });
        yield User.findByIdAndDelete(new mongoose_1.default.Types.ObjectId(_id));
        return res.status(200).json({ message: "Profile Deleted Successfully" });
    }
    catch (err) {
        return res.status(404).json(err.message);
    }
}));
module.exports.deleteProfileImage = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    try {
        const user = yield User.findById(new mongoose_1.default.Types.ObjectId(_id));
        if (!user)
            return res.status(403).json({ message: "User does not exist" });
        if (user.image)
            fs.unlink(path.join(__dirname, "/..", user.image), (err) => {
                if (err)
                    throw err;
            });
        yield User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(_id), {
            image: "",
        });
        return res
            .status(200)
            .json({ message: "Profile Image Removed Successfully" });
    }
    catch (err) {
        return res.status(404).json(err.message);
    }
}));
