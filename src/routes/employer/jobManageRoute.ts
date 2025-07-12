import express from "express";
import {  getApplicationsByEmployer, getApplicationsByJobId, updateApplicationStatus } from "../../controllers/employerController/jobManagement";
import cache from "../../redisService/redisMiddleware";
const router = express.Router();


router.get("/applications",cache(10), getApplicationsByEmployer);
router.post("/applications", getApplicationsByJobId);
router.patch("/applications/:id", updateApplicationStatus);

export default router;
