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
const storage_1 = require("firebase/storage");
const moment_1 = __importDefault(require("moment"));
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
moment_1.default.suppressDeprecationWarnings = true;
const storage = (0, storage_1.getStorage)();
module.exports.register = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, email, password, confirmPassword, dateOfBirth } = req.body;
    try {
        const userExists = yield User.findOne({ email });
        if (userExists)
            return res
                .status(403)
                .json({ message: "User already exists. Choose a different email." });
        if (!password || password < 8)
            return res
                .status(403)
                .json({ message: "Password must contain atleast 8 characters." });
        if (password !== confirmPassword)
            return res.status(403).json({ message: "Password does not match." });
        const salt = yield bcrypt.genSalt(10);
        const encryptedPassword = yield bcrypt.hash(password, salt);
        const { _id: _userId } = yield User.create({
            fullname,
            email,
            password: encryptedPassword,
            dateOfBirth: new Date((0, moment_1.default)(dateOfBirth).format()),
        });
        if (req.files) {
            const file = req.files.image;
            if (!file.mimetype.startsWith("image/"))
                return res.status(403).json({ message: "Please choose an image" });
            const filename = file.mimetype.replace("image/", `${_userId}.`);
            const storageRef = (0, storage_1.ref)(storage, `users/${filename}`);
            const metadata = {
                contentType: file.mimetype,
            };
            yield (0, storage_1.uploadBytes)(storageRef, file.data, metadata);
            const url = yield (0, storage_1.getDownloadURL)(storageRef);
            yield User.findByIdAndUpdate(_userId, {
                image: url,
                imageName: filename,
            });
        }
        const token = jwt.sign({ _id: _userId }, process.env.JWT_TOKEN, {
            expiresIn: "20d",
        });
        return res.status(200).json({ token, message: "Signup Successful" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.login = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield User.findOne({ email }).select("+password");
        if (!user)
            return res.status(404).json({ message: "User does not exist." });
        const isMatched = yield bcrypt.compare(password, user.password);
        if (!isMatched)
            return res.status(403).json({ message: "Incorrect Password" });
        const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, {
            expiresIn: "20d",
        });
        return res.status(200).json({ token, message: "Login Successful" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.authSuccess = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({ user: res.locals.user });
}));
module.exports.getProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({
            user: res.locals.queryUser,
            message: "User Fetched Successfully",
        });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.updateProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, bio, dateOfBirth } = req.body;
    const { _id: _userId, image, imageName } = res.locals.user;
    try {
        if (req.files) {
            const file = req.files.image;
            if (!file.mimetype.startsWith("image/"))
                return res.status(403).json({ message: "Please choose an image" });
            if (image)
                (0, storage_1.deleteObject)((0, storage_1.ref)(storage, `users/${imageName}`));
            const filename = file.mimetype.replace("image/", `${_userId}.`);
            const storageRef = (0, storage_1.ref)(storage, `users/${filename}`);
            const metadata = {
                contentType: file.mimetype,
            };
            yield (0, storage_1.uploadBytes)(storageRef, file.data, metadata);
            const url = yield (0, storage_1.getDownloadURL)(storageRef);
            yield User.findByIdAndUpdate(_userId, {
                image: url,
                imageName: filename,
            });
        }
        yield User.findByIdAndUpdate(_userId, {
            fullname,
            bio,
            dateOfBirth,
        });
        return res.status(200).json({ message: "Profile Updated Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.deleteProfile = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _userId, image, imageName } = res.locals.user;
    try {
        if (image)
            (0, storage_1.deleteObject)((0, storage_1.ref)(storage, `users/${imageName}`));
        yield User.findByIdAndDelete(_userId);
        return res.status(200).json({ message: "Profile Deleted Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.deleteProfileImage = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id: _userId, image, imageName } = res.locals.user;
    try {
        if (image)
            (0, storage_1.deleteObject)((0, storage_1.ref)(storage, `users/${imageName}`));
        yield User.findByIdAndUpdate(_userId, {
            image: "",
            imageName: "",
        });
        return res
            .status(200)
            .json({ message: "Profile Image Removed Successfully" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
