/// <reference path="./types/express/index.d.ts" />
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import authenticationToken from "./authMiddleware/authMiddleware.js";
import authorizeRoles from "./authMiddleware/roleMiddleware.js";
import employerAuthRoutes from "./routes/employer/authRoute.js";
import seekerAuthRoutes from "./routes/jobSeeker/authRoute.js";
import adminAuthRoutes from "./routes/admin/authRoute.js";
import commonAuthRoutes from "./routes/common/authRoute.js";
import jobSeekerProfileRoute from "./routes/jobSeeker/profileRoute.js";
import employerProfileRoute from "./routes/employer/profileRoute.js";
import jobPostingRoute from "./routes/employer/jobPostingRoute.js";
import adminApprovalRoute from "./routes/admin/approvalRoute.js";
import allPostedJobRoute from "./routes/general/allJobs.js";
import adminProfileRoute from "./routes/admin/profileRoute.js";
import applyJobRoute from "./routes/jobSeeker/jobApplication.js";
import jobApplicationRoute from "./routes/employer/jobManageRoute.js";
import appliedJobRoute from "./routes/jobSeeker/appliedJobRoute.js";
import recommendJobsRoute from "./routes/recommendation/recommend.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.CLIENT_URL_1,
    process.env.CLIENT_URL_2,
].filter(Boolean);
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS: " + origin));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.get("/", (req, res) => {
    res.send("Hello from server its running fine ");
});
app.use("/api/auth", employerAuthRoutes, seekerAuthRoutes, adminAuthRoutes, commonAuthRoutes);
app.use("/api/admin/dashboard", authenticationToken, authorizeRoles(["admin"]), adminApprovalRoute, adminProfileRoute);
app.use("/api/jobseeker", authenticationToken, authorizeRoles(["job_seeker"]), jobSeekerProfileRoute, applyJobRoute, appliedJobRoute);
app.use("/api/employer", authenticationToken, authorizeRoles(["employer"]), employerProfileRoute, jobPostingRoute, jobApplicationRoute);
app.use("/api/user", authenticationToken, recommendJobsRoute);
app.use("/api/general", allPostedJobRoute);
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})
    .catch((err) => console.error(err));
