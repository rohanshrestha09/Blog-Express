"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { register, login, getProfile, getUserProfile, updateProfile, deleteProfile, deleteProfileImage, } = require("../controller/user");
const auth = require("../middleware/auth");
const passwordValidator = require("../middleware/passwordValidator");
const router = express_1.default.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.get("/profile/:_id", auth, getUserProfile);
router.put("/profile/:_id", auth, passwordValidator, updateProfile);
router.delete("/profile/:_id", auth, passwordValidator, deleteProfile);
router.delete("/profile/image/:_id", auth, deleteProfileImage);
module.exports = router;
