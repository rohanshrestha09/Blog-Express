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
const bcrypt = require("bcryptjs");
const User = require("../model/User");
module.exports = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { _userId } = req.params;
    const { password } = req.body;
    try {
        if (!password)
            return res.status(403).json({ message: "Please input password" });
        const user = yield User.findById(new mongoose_1.default.Types.ObjectId(_userId)).select("+password");
        if (!user)
            return res.status(403).json({ message: "User does not exist" });
        const isMatched = yield bcrypt.compare(password, user.password);
        if (!isMatched)
            return res.status(403).json({ message: "Incorrect Password" });
        res.locals.user = user;
        next();
    }
    catch (err) {
        return res.status(404).json({ message: err.message });
    }
}));
