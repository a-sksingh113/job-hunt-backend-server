import express from "express";
import { approveEmployerById, approveJobSeekerById,getAllPendingEmployer,getAllPendingSeeker,rejectEmployerById, rejectJobSeekerById } from "../../controllers/adminController/approval";
import cache from ".././../redisService/redisMiddleware";
const router = express.Router();

router.get("/seekers", cache(10), getAllPendingSeeker);
router.get("/employers",  cache(10), getAllPendingEmployer);
router.patch("/approve/employer/:id",  approveEmployerById);
router.patch("/approve/seeker/:id",  approveJobSeekerById);
router.delete("/reject/employer/:id",  rejectEmployerById);
router.delete("/reject/seeker/:id", rejectJobSeekerById);

export default router;
