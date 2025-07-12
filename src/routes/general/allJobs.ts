import express from "express";
import { getAllJobs, getJobById } from "../../controllers/jobSeekerController/allJobPosted";
import cache from "../../redisService/redisMiddleware";
const router = express.Router();


router.get("/jobs",cache(300), getAllJobs);               
router.get("/jobs/:id", getJobById);           

export default router;
