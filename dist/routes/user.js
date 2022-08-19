"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { register, login, profile, updateProfile, } = require("../controller/user");
const auth = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", auth, profile);
router.put("/profile/:_id", auth, updateProfile);
module.exports = router;
