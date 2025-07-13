import express from "express";
import {
  deleteJob,
  getAllMyCreatedJobs,
  getPostedJobById,
  postJob,
  updateJob,
} from "../../controllers/employerController/jobPosting.js";
import cache from "../../redisService/redisMiddleware.js";

const router = express.Router();

router.post("/jobs/jobs-create", postJob);
router.get("/jobs",cache(10), getAllMyCreatedJobs);
router.get("/jobs/:jobId", getPostedJobById);
router.put("/jobs/:jobId", updateJob);
router.delete("/jobs/:jobId", deleteJob);

export default router;
