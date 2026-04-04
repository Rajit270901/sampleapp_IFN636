# MediTrack - Medical Appointment Scheduler
# Rajit Bhargava
# IFN636 – Software Life Cycle Management

MediTrack is a medical appointment scheduling system developed for Assessment 1.2. The application is a real world CRUD system for managing doctors, appointment slots, patient bookings and administrative scheduling tasks.

## Project Overview

The purpose of MediTrack is to provide a medical appointment booking platform with separate workflows for patients and administrators.

Patients can:
- register and log in
- browse doctors
- view doctor specific available slots
- book appointments
- reschedule appointments
- cancel appointments
- update profile details

Administrators can:
- log in
- manage doctor records
- manage appointment slots
- view all appointments
- update appointment status

The project demonstrates CRUD development using Node.js, Express.js, MongoDB and React.js along with authentication, authorization, GitHub branching, and CI workflow setup.

## Features

Patient Features
- User registration
- User login
- View doctors
- View available slots for a selected doctor
- Book appointment
- View personal appointments
- Reschedule appointment
- Cancel appointment
- Update profile

Admin Features
- Admin login
- Add doctor
- Edit doctor
- Delete doctor
- Add slot
- Edit slot
- Delete slot
- View all appointments
- Update appointment status

Technical Features
- JWT based authentication
- Role based authorization for patient/admin access
- Protected frontend routes
- MongoDB data 
- GitHub Actions backend CI workflow
- PM2 deployment attempt on EC2

## Tools used

Frontend
- React.js
- Tailwind CSS

Backend
- Node.js
- Express.js
- MongoDB
- JWT

### Testing / CI
- Mocha / Chai / Sinon
- GitHub Actions

## Project Structure

sampleapp_IFN636/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── axiosConfig.js
│   │   └── index.js
│   └── .env
│
└── README.md

## Setup Instructions

1. Clone the repository
git clone https://github.com/Rajit270901/sampleapp_IFN636.git
cd sampleapp_IFN636

2. Backend setup
cd backend
npm install

Create a .env file inside the backend folder with:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001

Start the backend server:

npm run dev

3. Frontend setup

Open another terminal:

cd frontend
npm install

Create a .env file inside the frontend folder with:

REACT_APP_API_URL=http://localhost:5001

Start the frontend:

npm start

The frontend should open in the browser at:

http://localhost:3000

## Test Credentials

Patient Access
Email: patient@email.com
Password: patient123

Admin Access
Email: admin@example.com
Password: admin123

## Authentication and Authorization

MediTrack uses JWT based authentication. After successful login, the user token is stored and used for protected API requests. The system supports two roles:

1. patient
2. admin

Access to routes and pages is restricted based on role:

patients can access patient dashboard and booking functions
admins can access management pages for doctors, slots and appointments

## GitHub Version Control and Branching

Development was completed using GitHub version control and a feature branch workflow.

## CI Workflow

A GitHub Actions workflow named Backend CI was configured to:

run on push to main and feature/**
run on pull requests to main
install backend dependencies
execute backend tests

## EC2 Deployment Note

Deployment to the QUT provided EC2 instance was attempted. The backend service, MongoDB connection, frontend build and PM2 process setup were configured and tested on the instance. However, public external access remained unresolved despite troubleshooting EC2 networking and security group configuration.

The application is fully functional in the local development environment.

## Limitations

EC2 public deployment was attempted but not fully accessible externally
Deployment configuration may require additional network/security troubleshooting for full public hosting



