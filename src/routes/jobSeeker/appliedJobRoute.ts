import express from "express";
import { getAppliedJobById, getAppliedJobs } from "../../controllers/jobSeekerController/allAppliedJob";
const router = express.Router();


router.get("/jobs/applied", getAppliedJobs);            
router.get("/jobs/applied/:jobId",  getAppliedJobById); 

export default router;
