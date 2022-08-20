import express, { Router } from "express";

const auth = require("../middleware/auth");

const { follow, unfollow } = require("../controller/userActivity");

const router: Router = express.Router();

router.use(auth);

router.post("/follow/:_id", follow);

router.delete("/follow/:_id", unfollow);

module.exports = router;
