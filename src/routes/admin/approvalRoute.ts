import express from "express";
import { approveEmployerById, approveJobSeekerById,getAllPendingEmployer,getAllPendingSeeker,rejectEmployerById, rejectJobSeekerById } from "../../controllers/adminController/approval";
const router = express.Router();

router.get("/seekers",  getAllPendingSeeker);
router.get("/employers",  getAllPendingEmployer);
router.patch("/approve/employer/:id",  approveEmployerById);
router.patch("/approve/seeker/:id",  approveJobSeekerById);
router.delete("/reject/employer/:id",  rejectEmployerById);
router.delete("/reject/seeker/:id", rejectJobSeekerById);

export default router;
