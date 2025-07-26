import express from "express";
import { recommendJobs } from "../../recommendation/recommend.js";
import cache from "../../redisService/redisMiddleware.js";
const router = express.Router();
router.get('/recommend', cache(30), recommendJobs);
export default router;
