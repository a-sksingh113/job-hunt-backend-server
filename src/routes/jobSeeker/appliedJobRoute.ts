import express from "express";
import { getAppliedJobById, getAppliedJobs } from "../../controllers/jobSeekerController/allAppliedJob";
const router = express.Router();


router.get("/my", getAppliedJobs);            
router.get("/my/:jobId",  getAppliedJobById); 

export default router;
