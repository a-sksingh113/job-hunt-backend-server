import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import employerAuthRoutes from "./routes/employer/authRoute";
import seekerAuthRoutes from "./routes/jobSeeker/authRoute";
import commonAuthRoutes from "./routes/common/authRoute";
import jobSeekerProfileRoute from "./routes/jobSeeker/profileRoute";
import employerProfileRoute from "./routes/employer/profileRoute";
import authenticationToken from "./authMiddleware/authMiddleware";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 2000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.use("/api/auth", employerAuthRoutes, seekerAuthRoutes, commonAuthRoutes);
app.use("/api/jobseeker", authenticationToken, jobSeekerProfileRoute);
app.use("/api/employer", authenticationToken, employerProfileRoute);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));
