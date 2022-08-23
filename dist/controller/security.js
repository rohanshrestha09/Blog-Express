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
exports.changePassword = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
module.exports.resetLink = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "Invalid Email" });
        const token = jwt.sign({ _id: user._id }, `${process.env.JWT_PASSWORD}${user.password}`, { expiresIn: "15min" });
        const resetUrl = `https://blogsansar.vercel.app/security/reset-password/${user._id}/${token}`;
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: process.env.MAILING_EMAIL,
                pass: process.env.APP_PASSWORD,
            },
            port: "465",
        });
        yield transporter.sendMail({
            from: '"Do not reply to this email (via BlogSansar)" <blogsansar0@gmail.com>',
            to: email,
            subject: "Password Reset Link",
            html: `
          <h1>Click on the link below to reset your password</h1>
          <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        `,
        });
        return res.status(200).json({
            passwordResetLink: resetUrl,
        });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
module.exports.resetPassword = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { _id: _userId } = res.locals.queryUser;
    const { password } = req.body;
    if (!token)
        return res.status(403).json({ message: "Invalid token" });
    if (!password || password < 8)
        return res
            .status(403)
            .json({ message: "Password must contain atleast 8 characters" });
    try {
        const { password: oldPassword } = yield User.findById(_userId).select("+password");
        const { _id } = jwt.verify(token, `${process.env.JWT_PASSWORD}${oldPassword}`);
        const salt = yield bcrypt.genSalt(10);
        const encryptedPassword = yield bcrypt.hash(password, salt);
        yield User.findByIdAndUpdate(new mongoose_1.default.Types.ObjectId(_id), {
            password: encryptedPassword,
        });
        return res.status(200).json({ message: "Password Reset Successful" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
exports.changePassword = asyncHandler((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, confirmNewPassword } = req.body;
    const { _id: _userId } = res.locals.user;
    if (!newPassword || newPassword < 8)
        return res
            .status(403)
            .json({ message: "Password must contain atleast 8 characters." });
    if (newPassword !== confirmNewPassword)
        return res.status(403).json({ message: "Password does not match" });
    try {
        const salt = yield bcrypt.genSalt(10);
        const encryptedPassword = yield bcrypt.hash(newPassword, salt);
        yield User.findByIdAndUpdate(_userId, { password: encryptedPassword });
        return res.status(200).json({ message: "Password Change Successful" });
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
