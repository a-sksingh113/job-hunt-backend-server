import express from "express";
import { approveEmployerById, approveJobSeekerById, getAllEmployer, getAllSeeker, rejectEmployerById, rejectJobSeekerById } from "../../controllers/adminController/approval";
const router = express.Router();

router.get("/seekers",  getAllSeeker);
router.get("/employers",  getAllEmployer);
router.patch("/approve/employer/:id",  approveEmployerById);
router.patch("/approve/seeker/:id",  approveJobSeekerById);
router.delete("/reject/employer/:id",  rejectEmployerById);
router.delete("/reject/seeker/:id", rejectJobSeekerById);

export default router;
