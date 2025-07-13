import express from "express";
import { getProfile, updateProfile } from "../../controllers/profileController/admin.js";

const router = express.Router();

router.get("/profile", getProfile);
router.put("/profile/update",  updateProfile);

export default router;
