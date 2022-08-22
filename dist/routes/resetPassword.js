"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { resetPassword, resetLink } = require("../controller/resetPassword");
const userValidator = require("../middleware/userValidator");
const router = express_1.default.Router();
router.get("/reset-password", resetLink);
router.post("/reset-password/:_queryUserId/:token", userValidator, resetPassword);
module.exports = router;
