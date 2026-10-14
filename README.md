# Intetrnship-Management-System

Database Project that shows internship management at the college level for real-world problem solving.

A full-stack College Internship Management web application built with **React**, **Vite**, **Tailwind CSS**, **Node.js/Express**, and **MySQL**.

---

## 🚀 Features

- **Student Portal**:
  - Browse and apply for internship openings across various partner companies.
  - Track application status in real-time.
  - Submit weekly progress reports and attendance.
  - View mentor allocations, final evaluations, and download certificates.
- **Faculty & Mentor Portal**:
  - Review and verify student applications.
  - Assign academic mentors and monitor student progress reports.
  - Grade and evaluate student internship performance.
  - Issue completion certificates.
- **Database Schema & SQL Viewer**:
  - In-app interactive modal to explore relational schema architecture.
  - Real-time SQL log viewer demonstrating executed database queries.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express, CORS, Dotenv
- **Database**: MySQL (using `mysql2`)
- **Linting**: Oxlint

---

## 📁 Project Structure

```
├── public/
│   └── backend/
│       └── schema.sql       # MySQL database tables & sample seed data
├── src/
│   ├── assets/              # Icons and static assets
│   ├── components/          # StudentPortal, FacultyPortal, Modals, Navbar, etc.
│   ├── data/                # Mock data fallbacks
│   ├── services/            # API service layer for backend connectivity
│   ├── App.jsx              # Main application container
│   ├── index.css            # Tailwind & global styles
│   └── main.jsx             # React entry point
├── .env                     # Database connection environment configuration
├── package.json             # Dependencies and npm scripts
├── server.js                # Express REST API backend
└── vite.config.js           # Vite build configuration
```

---

## ⚙️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

### 2. Database Setup
1. Start your MySQL service.
2. Create and initialize the database using the provided schema:
   ```bash
   mysql -u root -p < public/backend/schema.sql
   ```
3. Update `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=internship_management
   DB_PORT=3306
   ```

### 3. Installation
Install the project dependencies:
```bash
npm install
```

### 4. Running the Application

- **Start the Backend API Server**:
  ```bash
  node server.js
  ```
  Runs at: `http://localhost:5000`

- **Start the Frontend Development Server**:
  ```bash
  npm run dev
  ```
  Runs at: `http://localhost:5173` (or your configured Vite port)

---

## 📄 License
This project is open-source and available for educational use.
