import express from "express";
import { getAllJobs, getJobById } from "../../controllers/jobSeekerController/allJobPosted.js";
const router = express.Router();


router.get("/jobs", getAllJobs);               
router.get("/jobs/:id", getJobById);           

export default router;
