import express from "express";
import {
  deleteJob,
  getAllJobs,
  getPostedJobById,
  postJob,
  updateJob,
} from "../../controllers/employerController/jobPosting";

const router = express.Router();

router.get("/jobs", getAllJobs);
router.get("/jobs/:jobId", getPostedJobById);
router.post("/jobs/jobs-create", postJob);
router.put("/jobs/:jobId", updateJob);
router.delete("/jobs/:jobId", deleteJob);

export default router;
