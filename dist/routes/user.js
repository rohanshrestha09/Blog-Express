"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { register, login, getProfile, updateProfile, deleteProfile, deleteProfileImage, } = require("../controller/user");
const auth = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.put("/profile/:_id", auth, updateProfile);
router.delete("/profile/:_id", auth, deleteProfile);
router.delete("/profile/image/:_id", auth, deleteProfileImage);
module.exports = router;
