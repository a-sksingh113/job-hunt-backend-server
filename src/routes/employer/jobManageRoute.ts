import express from "express";
import { getAllApplications, getApplicationsByJobId, updateApplicationStatus } from "../../controllers/employerController/jobManagement";
const router = express.Router();


router.get("/applications", getAllApplications);
router.post("/applications", getApplicationsByJobId);
router.patch("/applications/:id", updateApplicationStatus);

export default router;
