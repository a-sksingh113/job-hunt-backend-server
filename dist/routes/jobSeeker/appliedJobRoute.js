import express from "express";
import { getAppliedJobById, getAppliedJobs } from "../../controllers/jobSeekerController/allAppliedJob.js";
import cache from "../../redisService/redisMiddleware.js";
const router = express.Router();
router.get("/jobs/applied", cache(10), getAppliedJobs);
router.get("/jobs/applied/:jobId", getAppliedJobById);
export default router;
