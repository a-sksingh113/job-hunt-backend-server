import express from "express";
import { getAllApplications, getApplicationsByJobId, updateApplicationStatus } from "../../controllers/employerController/jobManagement";
import cache from "../../redisService/redisMiddleware";
const router = express.Router();


router.get("/applications",cache(60), getAllApplications);
router.post("/applications", getApplicationsByJobId);
router.patch("/applications/:id", updateApplicationStatus);

export default router;
