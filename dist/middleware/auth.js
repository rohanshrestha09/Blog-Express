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
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const Blog = require("../model/Blog");
module.exports = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer"))
        token = authorization.split(" ")[1];
    if (!token)
        return res.status(403).json({ message: "Not authorised" });
    try {
        const { _id } = jwt.verify(token, process.env.JWT_TOKEN);
        const user = yield User.findById(new mongoose_1.default.Types.ObjectId(_id)).select("-password");
        if (!user)
            return res.status(404).json({ message: "User does not exist" });
        res.locals.user = Object.assign(Object.assign({}, user._doc), { blogs: yield Blog.find({ _id: user.blogs }), bookmarks: yield Blog.find({ _id: user.bookmarks }) });
        next();
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
