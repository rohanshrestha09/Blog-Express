"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { register, login, getProfile, authSuccess, updateProfile, deleteProfile, deleteProfileImage, } = require("../controller/user");
const auth = require("../middleware/auth");
const passwordValidator = require("../middleware/passwordValidator");
const router = express_1.default.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/auth", auth, authSuccess);
router.get("/profile/:_userId", auth, getProfile);
router.put("/profile/:_userId", auth, passwordValidator, updateProfile);
router.delete("/profile/:_userId", auth, passwordValidator, deleteProfile);
router.delete("/profile/image/:_userId", auth, deleteProfileImage);
module.exports = router;
