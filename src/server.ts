/// <reference path="./types/express/index.d.ts" />
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authenticationToken from "./authMiddleware/authMiddleware";
import employerAuthRoutes from "./routes/employer/authRoute";
import seekerAuthRoutes from "./routes/jobSeeker/authRoute";
import adminAuthRoutes from "./routes/admin/authRoute";
import commonAuthRoutes from "./routes/common/authRoute";
import jobSeekerProfileRoute from "./routes/jobSeeker/profileRoute";
import employerProfileRoute from "./routes/employer/profileRoute";
import jobPostingRoute from "./routes/employer/jobPostingRoute";
import adminApprovalRoute from "./routes/admin/approvalRoute";
import authorizeRoles from "./authMiddleware/roleMiddleware";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.use(
  "/api/auth",
  employerAuthRoutes,
  seekerAuthRoutes,
  adminAuthRoutes,
  commonAuthRoutes
);
app.use(
  "/api/admin/dashboard",
  authenticationToken,
  authorizeRoles(["admin"]),
  adminApprovalRoute
);
app.use(
  "/api/jobseeker",
  authenticationToken,
  authorizeRoles(["job_seeker"]),
  jobSeekerProfileRoute
);
app.use(
  "/api/employer",
  authenticationToken,
  authorizeRoles(["employer"]),
  employerProfileRoute,
  jobPostingRoute
);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));
