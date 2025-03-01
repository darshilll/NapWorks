import express from "express";
import { handleAddUser } from "../controllers/signup.js";
import { handleLogin } from "../controllers/login.js";
import rateLimit from "express-rate-limit";
import { handleCreatePost, handleFetchPosts } from "../controllers/post.js";
import {auth} from "../middlewares/auth.js"

const router = express.Router();

router.post("/signup", handleAddUser);
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Try again later.",
});

router.post("/login", loginLimiter, handleLogin);
router.post("/posts", auth, handleCreatePost);
router.get("/posts",handleFetchPosts)

export default router;
