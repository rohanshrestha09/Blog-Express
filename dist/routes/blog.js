"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_1 = require("../controller/blog");
const auth_1 = __importDefault(require("../middleware/auth"));
const validateBlog_1 = __importDefault(require("../middleware/validateBlog"));
const router = (0, express_1.Router)();
router.use(['/blog', '/blog/*'], (req, _, next) => {
    req.shouldSkip = req.method === 'GET';
    next();
}, auth_1.default);
router.use(['/blog/:blog', '/blog/:blog/*'], validateBlog_1.default);
router.get('/blog', blog_1.blogs);
router.get('/blog/:blog', blog_1.blog);
router.post('/blog', blog_1.postBlog);
router.put('/blog/:blog', blog_1.updateBlog);
router.delete('/blog/:blog', blog_1.deleteBlog);
router.get('/blog/genre', blog_1.genre);
router.post('/blog/:blog/publish', blog_1.publish);
router.delete('/blog/:blog/publish', blog_1.unpublish);
router.post('/blog/:blog/like', blog_1.like);
router.delete('/blog/:blog/like', blog_1.unlike);
router.post('/blog/:blog/comment', blog_1.comment);
router.delete('/blog/:blog/comment', blog_1.uncomment);
module.exports = router;
