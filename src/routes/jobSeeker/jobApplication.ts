import express from "express";
import { applyToJob } from "../../controllers/jobSeekerController/allJobPosted.js";
const router = express.Router();
        
router.post("/jobs/apply" ,applyToJob);

export default router;
