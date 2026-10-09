# 📊 Attendance Management SaaS

<p align="center">
  <img src="https://img.shields.io/badge/Project-Attendance%20Management-blue?style=for-the-badge" alt="Project"/>
  <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-green?style=for-the-badge" alt="Backend"/>
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge" alt="Database"/>
  <img src="https://img.shields.io/badge/Authentication-JWT-orange?style=for-the-badge" alt="Authentication"/>
</p>

<p align="center">
  <b>Smart Attendance. Easy Management. Better Productivity.</b>
</p>

<p align="center">
  A role-based attendance management system designed to simplify student attendance tracking, assignment monitoring, and academic record management.
</p>

---

## 📌 About the Project

**Attendance Management SaaS** is a web-based application designed to digitize and simplify attendance management for educational institutions.

The system provides separate access for Admins, Teachers, and Class Representatives (CRs), allowing them to manage students, classes, subjects, attendance records, and assignments according to their permissions.

The primary goal is to reduce manual paperwork, minimize attendance-recording errors, and provide an efficient way to monitor student attendance and academic activities.

The backend is developed using Node.js, Express.js, MongoDB, and Mongoose, with JWT-based authentication and role-based authorization.

## ✨ Key Features

### 📅 Attendance Management
- Mark students as Present or Absent.
- Maintain date-wise attendance records.
- Organize attendance by class and subject.
- View student attendance percentages.
- Search for individual students.
- Support past attendance editing for authorized teachers.
- Restrict CRs to marking attendance for the current day.

### 👥 Role-Based Access Control

| Role | Responsibilities |
|---|---|
| Admin | Manage users and oversee academic records. |
| Teacher | Manage attendance, view student records, and handle assignments. |
| Class Representative (CR) | Mark daily attendance within assigned permissions. |

### 📝 Assignment Management
- Create and manage assignments.
- Associate assignments with classes and subjects.
- Set assignment deadlines and total marks.
- Track student submission status.
- Record submission dates and marks.
- Support Not Submitted, Submitted, and Late statuses.

### 🔐 Authentication & Security
- User registration and login.
- Password hashing with bcrypt.
- JWT-based authentication.
- Role-based route authorization.
- Protected API endpoints.
- Environment variables for sensitive configuration.

### 📈 Reports & Academic Tracking
- Calculate attendance percentages.
- Retrieve attendance records by date.
- Track assignment submissions.
- Support future monthly and semester-wise reports.
- Plan for Excel and PDF report exports.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime for backend development |
| Express.js | REST API development |
| MongoDB Atlas | Cloud database |
| Mongoose | Database schemas and data modeling |
| JSON Web Token (JWT) | Authentication |
| bcrypt | Password hashing |
| dotenv | Environment variable management |
| CORS | Cross-origin request handling |
| Postman | API testing and debugging |
| Git & GitHub | Version control |

### Frontend (Planned / In Development)

- React.js
- Vite
- Tailwind CSS
- React Router
- Context API for authentication state

*Update this section based on the actual implementation status of your frontend.*

## 🏗️ System Architecture

```text
                    ┌────────────────────┐
                    │    React Frontend  │
                    │   (Vite + Tailwind)│
                    └─────────┬──────────┘
                              │ HTTP Requests
                              ▼
                    ┌────────────────────┐
                    │   Express.js API   │
                    └─────────┬──────────┘
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
       ┌──────────────────┐     ┌──────────────────┐
       │ Authentication & │     │ Controllers and  │
       │ Role Middleware  │     │ Business Logic   │
       └──────────────────┘     └─────────┬────────┘
                                          │
                                          ▼
                                ┌──────────────────┐
                                │ MongoDB Atlas    │
                                │ + Mongoose       │
                                └──────────────────┘
```

## 📂 Project Structure

```text
attendance-management-saas/
│
├── server.js
├── package.json
├── .env
├── .gitignore
│
└── src/
    ├── config/
    │   └── db.js
    │
    ├── models/
    │   ├── User.js
    │   ├── Student.js
    │   ├── Class.js
    │   ├── Subject.js
    │   ├── Attendance.js
    │   └── Assignment.js
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── attendanceController.js
    │   ├── studentController.js
    │   └── assignmentController.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── attendanceRoutes.js
    │   ├── studentRoutes.js
    │   └── assignmentRoutes.js
    │
    └── middleware/
        ├── authMiddleware.js
        └── roleMiddleware.js
```

*Note: This is a representative structure. Adjust filenames to match your actual project.*

## 🚀 Getting Started

### Prerequisites

Install the following tools before running the project:

- Node.js and npm
- MongoDB Atlas account or a local MongoDB instance
- Postman
- Visual Studio Code

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project Folder

```bash
cd attendance-management-saas
```

### 3. Install Dependencies

```bash
npm install
```

Make sure the project includes the required dependencies, such as Express, Mongoose, dotenv, cors, bcrypt, and jsonwebtoken.

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Replace the placeholder values with your actual configuration.

**Security:** Never upload your `.env` file, MongoDB credentials, or JWT secret to GitHub.

### 5. Start the Server

For a standard Node.js setup:

```bash
node server.js
```

If Nodemon is installed and configured:

```bash
npm run dev
```

The server should start on port `5000`, provided that the database connection and environment variables are configured correctly.

### 6. Test the APIs

Open Postman and test the available endpoints.

Base URL:

```text
http://localhost:5000
```

Example API groups:

| Module | Endpoint Prefix |
|---|---|
| Authentication | `/api/auth` |
| Students | `/api/students` |
| Attendance | `/api/attendance` |
| Assignments | `/api/assignments` |

Use the HTTP methods and request bodies defined by your actual routes.

## 🔄 Application Workflow

1. The user logs in with valid credentials.
2. The backend verifies the credentials and issues a JWT.
3. Middleware validates the token and checks the user's role.
4. Authorized users access their permitted features.
5. Attendance and assignment data are processed through controllers.
6. Mongoose stores and retrieves records from MongoDB.
7. The API returns the result to the client.

## 🎯 Project Objectives

- Digitize the traditional attendance process.
- Reduce paperwork and manual calculation errors.
- Provide role-based access to academic records.
- Track attendance at student, class, subject, and date levels.
- Monitor assignment submission status.
- Build a scalable foundation for academic management.

## 🔮 Future Enhancements

- 📱 Fully responsive React dashboard.
- 📊 Attendance analytics and visual reports.
- 📥 Export reports to Excel and PDF.
- 📧 Email notifications and password reset.
- 🔄 Real-time dashboard updates.
- 📅 Monthly and semester attendance summaries.
- 🎓 Student portal to view attendance and assignments.
- ☁️ Production deployment with secure configuration.
- 🧪 Automated API and integration testing.
- 🛡️ Audit logs and enhanced security controls.

## 📚 Learning Outcomes

This project provides practical experience in:

- RESTful API development using Node.js and Express.
- MongoDB database design with Mongoose.
- JWT authentication and role-based authorization.
- Password hashing and secure configuration.
- CRUD operations and API testing with Postman.
- Designing academic data models and relationships.
- Debugging backend errors and managing environment variables.
- Planning a full-stack SaaS application.

## 👨‍💻 Developer

**Avinash Mani Tiwari**

B.Tech – Computer Science and Engineering

- GitHub: [AvinashManiTiwari](https://github.com/AvinashManiTiwari)
- LinkedIn: [Connect with me](https://www.linkedin.com/in/avinash-mani-tripathi-502748303)

## 📄 License

This project is developed for educational and academic purposes. Add an appropriate open-source license if you intend to distribute or permit reuse of the code.

---

<p align="center">
  <b>Built with 💻 and ❤️ by Avinash Mani Tiwari</b>
  <br/>
  <i>Making academic management simpler through technology.</i>
</p>
