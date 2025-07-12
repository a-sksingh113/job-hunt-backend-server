import express from "express";
import { recommendJobs } from "../../recommendation/recommend";
import cache from "../../redisService/redisMiddleware";

const router = express.Router();


router.get('/recommend',cache(30), recommendJobs);

export default router;
