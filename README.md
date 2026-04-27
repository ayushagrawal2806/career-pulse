# CareerPulse – Full Stack Job Portal

CareerPulse is a full-stack job portal that connects **Job Seekers** and **Recruiters** through a modern, responsive web application. Users can search jobs, apply instantly, manage applications, and recruiters can post jobs and track applicants.

## Live Demo

Frontend: [job-board-frontend-hazel.vercel.app](https://job-board-frontend-hazel.vercel.app/)

## GitHub Repositories

Frontend: [github.com/ayushagrawal2806/career-pulse](https://github.com/ayushagrawal2806/career-pulse)  
Backend: [github.com/ayushagrawal2806/job-board-backend](https://github.com/ayushagrawal2806/job-board-backend)

---

## Features

### Authentication & Security

- JWT Authentication
- Role-based Authorization (Seeker / Recruiter)
- Protected Routes
- Refresh Token Flow
- Persistent Login Sessions

### Job Seeker Features

- Browse Jobs
- Search & Filter Jobs
- Pagination
- Save / Unsave Jobs
- Apply to Jobs
- View Application History
- Update Profile

### Recruiter Features

- Post Jobs
- Edit Jobs
- Open / Close / Draft Job Status
- View Applicants
- Update Applicant Status
- Recruiter Dashboard

### UI / UX

- Fully Responsive Design
- Reusable Modals
- Loading States
- Pagination UX
- Smooth Navigation
- Render Wake-up Loader for Free Tier Backend

---

## Tech Stack

### Frontend

- React.js
- TypeScript
- React Router
- TanStack Query
- Zustand
- CSS3
- Lucide Icons

### Backend

- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- PostgreSQL

### Deployment

- Vercel (Frontend)
- Render (Backend)
- PostgreSQL Cloud DB

---

## Screenshots

<img width="1667" alt="Home" src="https://github.com/user-attachments/assets/32746588-472c-4f07-b389-dc05546c1541" />
<br><br>
<img width="1654" alt="Login" src="https://github.com/user-attachments/assets/c83fe727-19a4-4068-85e8-e764b6a1e119" />
<br><br>
<img width="1664" alt="Dashboard" src="https://github.com/user-attachments/assets/372c8000-46ff-4ab6-b0d9-15859f894f43" />
<br><br>
<img width="1653" alt="Job Details" src="https://github.com/user-attachments/assets/7df8422b-588d-483a-ab02-e6f30c60eb0c" />

---

## Local Setup

### Frontend

```bash
git clone https://github.com/ayushagrawal2806/career-pulse
cd job-board-frontend
npm install
npm run dev
```

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=10000
```

### Backend

> For full backend setup details, refer to the [Backend Repository](https://github.com/ayushagrawal2806/job-board-backend).

```bash
git clone https://github.com/ayushagrawal2806/job-board-backend
cd job-board-backend
```

---

## Production Note

Backend is hosted on Render free tier.  
First request may take up to 1 minute if the server is sleeping.

---

## Future Improvements

- Email Notifications
- Resume Upload
- Admin Dashboard
- Advanced Analytics
- Interview Scheduling

---

## Author

**Ayush Agrawal**  
LinkedIn: [linkedin.com/in/ayushag2806](https://www.linkedin.com/in/ayushag2806)  
GitHub: [github.com/ayushagrawal2806](https://github.com/ayushagrawal2806)
