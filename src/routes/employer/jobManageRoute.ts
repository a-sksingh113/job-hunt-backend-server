import express from "express";
import { getAllApplications, getApplicationsByJobId, updateApplicationStatus } from "../../controllers/employerController/jobManagement";
const router = express.Router();


router.get("/", getAllApplications);
router.post("/by-job", getApplicationsByJobId);
router.patch("/:id/status", updateApplicationStatus);

export default router;
