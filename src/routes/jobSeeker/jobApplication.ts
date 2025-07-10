import express from "express";
import { applyToJob, getAllJobs, getJobById } from "../../controllers/jobSeekerController/allJobPosted";
const router = express.Router();


router.get("/", getAllJobs);               
router.get("/:id", getJobById);           
router.post("/apply" ,applyToJob);

export default router;
