import express from "express";
import { getApplicationsByEmployer, getApplicationsByJobId, updateApplicationStatus } from "../../controllers/employerController/jobManagement.js";
import cache from "../../redisService/redisMiddleware.js";
const router = express.Router();
router.get("/applications", cache(10), getApplicationsByEmployer);
router.post("/applications", getApplicationsByJobId);
router.patch("/applications/:id", updateApplicationStatus);
export default router;
