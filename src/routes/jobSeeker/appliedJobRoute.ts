import express from "express";
import { getAppliedJobById, getAppliedJobs } from "../../controllers/jobSeekerController/allAppliedJob";
import cache from "../../redisService/redisMiddleware";
const router = express.Router();


router.get("/jobs/applied",cache(30), getAppliedJobs);            
router.get("/jobs/applied/:jobId",  getAppliedJobById); 

export default router;
