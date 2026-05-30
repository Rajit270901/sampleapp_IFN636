# MediTrack - Medical Appointment Scheduler
> Medical Appointment Scheduler — A team project for IFN636 Software Lifecycle Management.

**IFN636 - Software Lifecycle Management - Assessment 2.1**  
Developed by Rajit Ravindra Bhargava, Hayden Koomans, Pratham Hariani and Takshak Rajvanshi

MediTrack is a medical appointment scheduling system extending the team's earlier Assessment 1.2 deliverables. The application implements design patterns, OOP principles, automated testing, CI/CD pipelines, AWS load balancing and CloudWatch monitoring. 

**Live Application URL:**  
http://MediTrack-ALB-291180955.ap-southeast-2.elb.amazonaws.com

---

## Team

This project was developed for IFN636 Software Lifecycle Management Assessment 2.1 by the following team members:

| Name | Student ID | Primary Contribution |
|------|-----------|---------------------|
| Rajit Ravindra Bhargava | n12483371 | Backend architecture, AWS EC2 Deployment & Load Balancing, README, design patterns, testing, report|
| Hayden Koomans | n11435895 | README documentation, Windows setup, technology stack docs, design patterns, testing, report|
| Pratham Hariani | n12262757 | QA testing, UI improvements, application screenshots, design patterns, testing, report|
| Takshak Rajvanshi | n12131326 | CONTRIBUTORS.md, architecture overview, design patterns, testing, report|

**GitHub Repository:** https://github.com/Rajit270901/sampleapp_IFN636

---

## Technology Stack

### Backend
- **Node.js v22 LTS** 
- **Express.js v4** 
- **MongoDB Atlas** 
- **Mongoose v6** 
- **JSON Web Tokens (JWT)** 
- **bcrypt** 
- **mocha + chai + sinon** 

### Frontend
- **React.js v18** 
- **Tailwind CSS** 
- **axios** 
- **React Router** 

### System Deployment and Infrastructure
- **GitHub Actions** 
- **AWS EC2** 
- **AWS Application Load Balancer** 
- **AWS CloudWatch** 
- **PM2** 
- **Nginx** 

### Testing & QA
- **Postman** 
- **GitHub Actions CI** 
- **Apache Bench (ab)** 
- **Application Test Cases** 

### Design Patterns Implemented
- **Singleton** — Database connection management (`backend/config/db.js`)
- **Factory** — Notification creation (`backend/services/NotificationFactory.js`)
- **Facade** — Appointment booking workflow (`backend/services/AppointmentFacade.js`)
- **Middleware** — Request logging, validation, authentication chain (`backend/middleware/`)
- **Adapter** — Date format bridging for slot search (`backend/adapters/SlotDateAdapter.js`)

---

## Project Overview (Assessment 2.1)

MediTrack is a medical appointment scheduling platform with separate workflows for patients and admins.

**Patients can:**
- Register and log in
- Browse doctors by specialisation
- View doctor specific available slots filtered by date range
- Book, reschedule and cancel appointments
- View and manage notifications
- Update profile details

**Admins can:**
- Log in to admin dashboard
- Manage doctor records (add, edit, delete)
- Manage appointment slots (add, edit, delete)
- View all appointments across the system
- Update appointment statuses (with patient notification)

---

## Application Features

### Patient Features
- User registration and login (JWT-based)
- Doctor browsing with search and filter
- Slot viewing with date range filter
- Appointment booking, rescheduling and cancellation
- Real time notifications for appointment updates
- Profile management

### Admin Features
- Admin authentication
- CRUD operations for doctors and slots
- All appointments view with status management
- Notifications to patients on status changes

### Technical Features
- JWT based authentication with role based authorization
- Protected frontend routes by role (patient/admin)
- Automated backend tests using mocha + chai + sinon
- API assertions in a Postman collection
- GitHub Actions CI workflow
- Continuous Deployment to production EC2 instances on every merge to main
- Load-balanced production deployment across two EC2 instances
- CloudWatch monitoring with configured CPU alarm and SNS email notifications

---

## Project Structure

```text
sampleapp_IFN636/
│
├── backend/
│   ├── config/
│   │   └── db.js (Singleton pattern)
│   ├── controllers/
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── requestLogger.js
│   │   └── validateBody.js
│   ├── models/
│   ├── routes/
│   ├── services/
│   │   ├── AppointmentFacade.js (Facade pattern)
│   │   └── NotificationFactory.js (Factory pattern)
│   ├── adapters/
│   │   └── SlotDateAdapter.js (Adapter pattern)
│   ├── tests/ 
│   └── server.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── App.js
│       ├── axiosConfig.jsx
│       └── index.js
│
├── postman/
│   └── MediTrack_API.postman_collection.json
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Node.js v22 LTS — https://nodejs.org/en/download/
- Git — https://git-scm.com/
- Visual Studio Code (recommended) — https://code.visualstudio.com/

### Clone the Repository

```bash
git clone https://github.com/Rajit270901/sampleapp_IFN636.git
cd sampleapp_IFN636
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

Start the backend server:

```bash
npm run dev
```

You should see:

```bash
Server running on port 5001
MongoDB connected successfully
```

### Frontend Setup

In a separate terminal:

```bash
cd frontend
npm install
npm start
```

The application opens at http://localhost:3000

---

### Setup Instructions for Windows

**Prerequisites:**
- Node.js v22 LTS (https://nodejs.org/en/download/)
- Git for Windows (https://git-scm.com/download/win)
- Visual Studio Code (https://code.visualstudio.com/)

**Clone the Repository:**

Open Command Prompt or PowerShell:

```cmd
git clone https://github.com/Rajit270901/sampleapp_IFN636.git
cd sampleapp_IFN636
```

**Backend Setup (Windows):**

```cmd
cd backend
npm install
```

Create a file named `.env` in the backend folder. In File Explorer, right-click → New → Text Document → rename to `.env` (remove the .txt extension; click Yes if Windows warns).

Open `.env` in Notepad and paste:

```env
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
PORT=5001
```

Start the backend:

```cmd
node server.js
```

You should see "Server running on port 5001" and "MongoDB connected successfully". Leave the window open.

**Frontend Setup (Windows):**

Open a SECOND Command Prompt or PowerShell window:

```cmd
cd sampleapp_IFN636\frontend
npm install
npm start
```

The application opens at http://localhost:3000

**Common Windows Issues:**

| Issue | Resolution |
|-------|-----------|
| "node is not recognized" | Restart terminal after Node.js install |
| Port 5001 already in use | Task Manager → end node.exe processes |
| Permission errors | Run terminal as Administrator |
| Frontend doesn't auto-open | Manually navigate to http://localhost:3000 |
| .env file shows as test.txt | View → File name extensions in Explorer |

---

## Test Credentials

The following test accounts are available at the live application URL:

**Patient Account:**
- Email: `patient@meditrack.com`
- Password: `patient1234`

**Admin Account:**
- Email: `admin@meditrack.com`
- Password: `admin1234`

Patients can browse doctors, view slots, book/manage appointments and access notifications. Admins can manage doctors, slots and appointments.

---

## Authentication and Authorization

MediTrack uses JWT based authentication.

**Roles:**
- `patient` — access to patient dashboard, doctor browsing and booking functions
- `admin` — access to admin dashboard, doctor/slot management and all appointments view

Route protection is enforced both on the backend (middleware) and the frontend (route guards in `App.js`).

---

## GitHub Version Control and Branching

Development followed a feature-branch workflow with pull requests required for all merges to `main`:

- All changes were made on feature branches 
- Pull requests were opened against `main` with clear commit messages
- The GitHub Actions CI workflow ran on every push to feature branches and on every PR to `main`
- Each merge to `main` automatically triggered deployment to the production EC2 instances via the self-hosted GitHub Actions runner

---

## CI/CD Pipeline

A GitHub Actions workflow named "Backend CI" is defined in `.github/workflows/ci.yml`.

**Triggers:**
- Push to `main` branch
- Push to any `feature/**` branch
- Pull requests targeting `main`

**Workflow Steps:**
1. Checkout the repository
2. Setup Node.js v22 with dependency caching
3. Install backend dependencies
4. Run the mocha test suite 
5. Build the frontend
6. Stop, restart and verify PM2 processes on the production EC2

Deployment to EC2 is automated through a self-hosted GitHub Actions runner installed on Server 1. This enables continuous delivery — code merged to main is automatically deployed to the load balanced production environment.

---

## Production Deployment

The application is deployed on AWS using two EC2 instances behind an Application Load Balancer with CloudWatch monitoring.

**Live Application URL (Application Load Balancer):**  
http://MediTrack-ALB-291180955.ap-southeast-2.elb.amazonaws.com

## Architecture Overview

MediTrack follows a three tier architecture deployed on AWS with horizontal scaling and automated CI/CD.

### Tier 1: Client (React Single Page Application)

The frontend is a React application built with Tailwind CSS. It uses React Router for client side routing and React Context for state management. axios is used as the HTTP client with interceptors for JWT token injection.

### Tier 2: Application Server (Node.js + Express)

The backend is an Express.js REST API running on Node.js 22 LTS. It implements:
- JWT based authentication with role based authorisation
- Five design patterns (Singleton, Factory, Facade, Middleware, Adapter)
- Mocha test suite with chai and sinon
- A request middleware chain (logging → validation → authentication)

### Tier 3: Data (MongoDB Atlas)

A MongoDB Atlas free tier (M0) cluster provides the data layer. Mongoose is used as the object data modelling layer.

### Production Deployment Topology

User requests flow through the system as follows:

```text
[User Browser]
      ↓
[AWS Application Load Balancer]
Port 80: distributes incoming HTTP traffic
      ↓
[Target Group]
Performs health checks every 30 seconds
      ↓
┌──────────────────────────────────────────────┐
│ EC2 Server 1                                 │
│ Nginx → React Frontend (port 3000)           │
│       → Express Backend (port 5001)          │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ EC2 Server 2                                 │
│ Nginx → React Frontend (port 3000)           │
│       → Express Backend (port 5001)          │
└──────────────────────────────────────────────┘
      ↓
[MongoDB Atlas]
Cloud database connected using TLS
```

### CI/CD Flow

1. Developer pushes to feature branch
2. GitHub Actions runs the test suite on a self-hosted runner
3. PR is opened against main and reviewer approves after CI passes
4. Merge to main triggers automatic deployment to both EC2 instances
5. PM2 restarts the backend and frontend processes with the new code

### Monitoring

CloudWatch metrics capture CPU and network utilisation for both EC2 instances. A configured CPU alarm (HighCPUAlarm) notifies the operator via an SNS mediated email when sustained CPU elevation is detected.

**Load Testing Results:**
- Baseline (100 requests, 10 concurrent): ~80 RPS, 127 ms mean latency, 0 failures
- Stress (1000 requests, 100 concurrent): ~80 RPS, 1237 ms mean latency, 0 failures

The throughput remained constant under stress while latency increased linearly with concurrency demonstrating behaviour of a properly load balanced system.

