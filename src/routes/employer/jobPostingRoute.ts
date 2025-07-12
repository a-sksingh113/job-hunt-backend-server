import express from "express";
import {
  deleteJob,
  getAllMyCreatedJobs,
  getPostedJobById,
  postJob,
  updateJob,
} from "../../controllers/employerController/jobPosting";
import cache from "../../redisService/redisMiddleware";

const router = express.Router();

router.post("/jobs/jobs-create", postJob);
router.get("/jobs",cache(30), getAllMyCreatedJobs);
router.get("/jobs/:jobId", getPostedJobById);
router.put("/jobs/:jobId", updateJob);
router.delete("/jobs/:jobId", deleteJob);

export default router;
