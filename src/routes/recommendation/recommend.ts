import express from "express";
import { recommendJobs } from "../../recommendation/recommend";

const router = express.Router();


router.get('/recommend', recommendJobs);

export default router;
