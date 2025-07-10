
# Job Portal Backend (Node.js + TypeScript + MongoDB + AI Scoring)

A scalable backend API for a Job Portal platform that connects **Job Seekers** and **Employers**. Includes authentication, job posting & application, resume insights, and AI-based job-applicant scoring using **@xenova/transformers**.

---

##  Tech Stack

| Feature               | Technology                      |
|-----------------------|----------------------------------|
| Backend Framework     | Node.js + Express + TypeScript  |
| Database              | MongoDB (via Mongoose)          |
| AI Scoring Engine     | @xenova/transformers (MiniLM)   |
| Authentication        | JWT + bcrypt                    |
| Cloud Storage         | Cloudinary                      |
| Cache (Optional)      | Redis                           |
| File Uploads          | Multer                          |
| Email Service         | Nodemailer                      |

---

##  Folder Structure

```
src/
│
├── aiInSight/              # AI Scoring logic (MiniLM)
├── authMiddleware/         # JWT, role-based middleware
├── authService/            # Token generation, password encryption
├── cloudinary/             # Cloudinary setup & config
├── config/                 # DB, environment config
├── controllers/            # All business logic controllers
│   ├── adminController/
│   ├── authController/
│   ├── employerController/
│   ├── jobSeekerController/
│   ├── profileController/
├── emailService/             # Email OTPs, verifications    
|── recommendationSystem/    #recommend user to best matching job
├── models/                 # Mongoose schemas
├── redisService/           # Redis config (if used)
├── routes/                 # Route files grouped by user type
│   ├── admin/
│   ├── common/
│   ├── employer/
│   ├── general/
│   ├── jobSeeker/
│   ├── recommendationRoute/
├── types/                  # Global TypeScript types
└── server.ts               # App entry point
```

---

##  Setup Instructions

###  Clone & Install

```bash
git clone https://github.com/your-username/job-portal-backend.git
cd job-portal-backend
npm install
```

###  Configure `.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

---

##  Run Server (Dev)

```bash
npx ts-node-dev src/server.ts
# or if nodemon is configured
npm run dev
```

---

##  API Overview


###  Common Auth (`/api/auth`)
- `POST /signin`
- `POST /logout`
- `POST /forgot-password`
- `POST /verify-otp`
- `POST /verify-email`
- `POST /resend-otp`
- `POST /reset-password`

---

###  Admin Routes (`/api/admin/dashboard`)
- `GET /seekers` — Get all pending job seekers
- `GET /employers` — Get all pending employers
- `PATCH /approve/seeker/:id`
- `PATCH /approve/employer/:id`
- `DELETE /reject/seeker/:id`
- `DELETE /reject/employer/:id`
- `GET /profile`
- `PUT /profile/update`

---

###  Employer Routes (`/api/employer`)
- `POST /employer-signup` — (with company logo(optional))
- `GET /profile`
- `PUT /profile/update`
- `POST /jobs/jobs-create`
- `GET /jobs` — View all posted jobs
- `GET /jobs/:jobId` — View specific job
- `PUT /jobs/:jobId` — Update job
- `DELETE /jobs/:jobId`
- `GET /applications` — All applications to employer's jobs
- `POST /applications` — Applications for a specific job
- `PATCH /applications/:id` — Update job application status

---

###  Job Seeker Routes (`/api/jobseeker`)
- `POST /seeker-signup` — (with resume)
- `GET /profile`
- `PUT /profile/update` — (with resume)
- `POST /jobs/apply` — Apply to job
- `GET /jobs/applied` — View all applied jobs
- `GET /jobs/applied/:jobId` — View specific application

---

###  Public Job Routes (`/api/general`)
- `GET /jobs` — All public jobs
- `GET /jobs/:id` — Public job details

---

###  Job Recommendations (`/api/user`)
- `GET /recommend` — Returns jobs where AI score > 7 for current Jobseeker


---

##  AI Insight Scoring (No Python Needed)

### How it works:

- Uses `@xenova/transformers` to run `MiniLM` locally in Node.js
- On job apply, combines job + seeker info
- Scores similarity & saves to `JobApplication.aiInsightScore`

### Example:
```ts
{
  score: 8.2,          
  similarity: 0.82     
}
```

---

## Features

- Secure Auth (JWT + bcrypt)
- Role-based access (Admin, Employer, Job Seeker)
- AI score-based ranking
- Cloud resume & image upload (Cloudinary)
- Admin approval flow
- OTP-based email verification
- Scalable folder structure

---

##  Testing API

Use Postman or Thunder Client to test endpoints.

---

##  Scripts

```bash
npm run dev      # Start server with ts-node-dev
npm run build    # Compile TS to JS
npm start        # Run compiled JS (for production)
```

---

##  To-Do / Future Features

- Resume Parsing with PDF-to-Text
- AI Feedback on resumes
- Matching jobs for seeker (recommendations)
- Admin Dashboard Analytics (score-wise)

---

##  Contribution

PRs welcome! Follow conventional commits and keep code modular.

---

##  License

All rights reserved @Satish Kumar. 

contact gmail : i.sksingh113@gmail.com

MIT License
