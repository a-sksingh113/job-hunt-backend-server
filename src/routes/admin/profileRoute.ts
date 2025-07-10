import express from "express";
import { getProfile, updateProfile } from "../../controllers/profileController/admin";

const router = express.Router();

router.get("/", getProfile);
router.put("/",  updateProfile);

export default router;
