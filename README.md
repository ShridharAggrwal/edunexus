# Edunexus (Mini LMS)

## Overview
Edunexus is a mini-LMS (Learning Management System) built with the MERN stack. It supports instructors, students, and admins—offering course management, assignments, lectures (including Cloudinary video upload), real-time chat, Google Meet scheduling for live classes, and more.

## Features
- JWT-based authentication (student, instructor, admin roles)
- Course management (create, edit, delete, enroll)
- Cloudinary-powered video and file uploads (lectures, assignment attachments, submissions)
- Assignments with student upload & instructor/admin grading/feedback
- Google Meet auto-scheduling for live classes (with join links)
- Real-time course chat
- Admin controls (CRUD users, courses, view/delete submissions/content, manage inappropriate content)
- Role-based UI (students: enroll, submit; instructors/admin: manage, grade, schedule live)

## Setup Instructions
### Prerequisites
- Node.js >= 18
- MongoDB running locally or provide connection string via env
- (Optional for live meets) Google Cloud project with Calendar API enabled, OAuth credentials/refresh token

### Backend Setup (`/server`)
1. `cd server`
2. `npm install`
3. Create `.env` with:
   - MONGODB_URI=mongodb://127.0.0.1:27017/edunexus
   - JWT_SECRET=your_strong_secret
   - CLOUDINARY_CLOUD_NAME=your_cloudname
   - CLOUDINARY_API_KEY=your_key
   - CLOUDINARY_API_SECRET=your_secret
   - (Optionally for auto Google Meet):
      - GOOGLE_CLIENT_ID=...
      - GOOGLE_CLIENT_SECRET=...
      - GOOGLE_REDIRECT_URI=http://localhost:5000/api/google/oauth/callback
      - GOOGLE_REFRESH_TOKEN=...
      - GOOGLE_CALENDAR_ID=primary
4. `npm run dev`

### Frontend Setup (`/client`)
1. `cd client`
2. `npm install`
3. Optional: Create `.env` with VITE_API_URL=http://localhost:5000 if needed
4. `npm run dev`

## Demo Credentials
- Admin:
  - Email: admin@edunexus.com
  - Password: admin123
- Instructor:
  - Email: instructor1@edunexus.com
  - Password: instructor123
- Student:
  - Email: student1@edunexus.com
  - Password: student123

(Create users via register or seed manually.)

## Project Layout
- `/server` — Express backend, Mongo models, controllers, routes, configs
- `/client` — React frontend (Vite + TailwindCSS), API helpers, routing, context
- Key env files: `server/.env`, `client/.env` (git-ignored)

## Key Screens
- Login/Register (all roles)
- Course Catalog (students: enroll)
- Instructor Dashboard (manage courses, lectures, assignments, live schedule)
- Admin Dashboard (manage users/courses/content)
- Student Assignment Submissions (with due-date/grade/feedback logic)
- Chat (real-time)
- Live Class: Google Meet auto creation for scheduled lectures

## Additional Notes
- All uploads are via Cloudinary; configure credentials for full video/file support.
- To use Google Meet auto-scheduling, you must set up a Google Cloud project/OAuth and provide the required variables.
- User roles are 'student', 'instructor', 'admin'; controls and visibility change with role.
- All sensitive data is kept out of source—check `.gitignore` for .env handling.

