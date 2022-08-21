"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth = require("../middleware/auth");
const { follow, unfollow } = require("../controller/userActivity");
const router = express_1.default.Router();
router.use(auth);
router.post("/follow/:_userId", follow);
router.delete("/follow/:_userId", unfollow);
module.exports = router;
