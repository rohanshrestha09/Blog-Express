"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { getAllBlogs, getBlog, postBlog, updateBlog, deleteBlog, } = require("../controller/blog");
const auth = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth);
router.get("/blog", getAllBlogs);
router.get("/blog/:_blogId", getBlog);
router.post("/blog/:_authorId", postBlog);
router.put("/blog/:_blogId", updateBlog);
router.delete("/blog/:_blogId", deleteBlog);
module.exports = router;
