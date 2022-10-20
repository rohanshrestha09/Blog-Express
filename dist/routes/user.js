"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateUser_1 = __importDefault(require("../middleware/validateUser"));
const user_1 = require("../controller/user");
const router = (0, express_1.Router)();
router.use(['/user/*'], validateUser_1.default);
router.post('/register', user_1.register);
router.post('/login', user_1.login);
router.get('/user/:user', user_1.user);
router.get('user/:user/blog', user_1.blog);
module.exports = router;
