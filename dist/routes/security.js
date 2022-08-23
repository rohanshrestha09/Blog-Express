"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { resetPassword, resetLink, changePassword, } = require("../controller/security");
const userValidator = require("../middleware/userValidator");
const auth = require("../middleware/auth");
const passwordValidator = require("../middleware/passwordValidator");
const router = express_1.default.Router();
router.get("/security/reset-password", resetLink);
router.post("/security/reset-password/:_queryUserId/:token", userValidator, resetPassword);
router.post("/security/change-password", auth, passwordValidator, changePassword);
module.exports = router;
