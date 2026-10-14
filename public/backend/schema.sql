-- MySQL Database Creation Script for Internship Management System
CREATE DATABASE IF NOT EXISTS internship_management;
USE internship_management;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('STUDENT', 'COMPANY', 'FACULTY', 'ADMIN') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Students Table
CREATE TABLE IF NOT EXISTS students (
  student_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  roll_no VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone VARCHAR(15),
  department VARCHAR(100),
  semester INT,
  cgpa DECIMAL(3,2),
  skills TEXT,
  resume_url VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 3. Companies Table
CREATE TABLE IF NOT EXISTS companies (
  company_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  company_name VARCHAR(100) NOT NULL,
  contact_person VARCHAR(100),
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(15),
  website VARCHAR(255),
  location VARCHAR(100),
  industry VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 4. Faculty Table
CREATE TABLE IF NOT EXISTS faculty (
  faculty_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  department VARCHAR(100),
  designation VARCHAR(100),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- 5. Internships Table
CREATE TABLE IF NOT EXISTS internships (
  internship_id INT PRIMARY KEY AUTO_INCREMENT,
  company_id INT NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT,
  requirements TEXT,
  stipend DECIMAL(10,2),
  location VARCHAR(100),
  duration_weeks INT,
  deadline DATE,
  status ENUM('OPEN', 'CLOSED') DEFAULT 'OPEN',
  FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

-- 6. Applications Table
CREATE TABLE IF NOT EXISTS applications (
  application_id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT NOT NULL,
  internship_id INT NOT NULL,
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('APPLIED', 'UNDER_REVIEW', 'SELECTED', 'REJECTED') DEFAULT 'APPLIED',
  cover_letter TEXT,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (internship_id) REFERENCES internships(internship_id) ON DELETE CASCADE
);

-- 7. Internship Assignments Table
CREATE TABLE IF NOT EXISTS internship_assignments (
  assignment_id INT PRIMARY KEY AUTO_INCREMENT,
  application_id INT NOT NULL UNIQUE,
  faculty_id INT NOT NULL,
  start_date DATE,
  end_date DATE,
  status ENUM('ONGOING', 'COMPLETED', 'TERMINATED') DEFAULT 'ONGOING',
  FOREIGN KEY (application_id) REFERENCES applications(application_id) ON DELETE CASCADE,
  FOREIGN KEY (faculty_id) REFERENCES faculty(faculty_id) ON DELETE CASCADE
);

-- 8. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
  attendance_id INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT NOT NULL,
  date DATE NOT NULL,
  status ENUM('PRESENT', 'ABSENT', 'LEAVE') DEFAULT 'PRESENT',
  tasks_completed TEXT,
  FOREIGN KEY (assignment_id) REFERENCES internship_assignments(assignment_id) ON DELETE CASCADE
);

-- 9. Progress Reports Table
CREATE TABLE IF NOT EXISTS progress_reports (
  report_id INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT NOT NULL,
  report_week INT NOT NULL,
  submitted_date DATE NOT NULL,
  summary TEXT,
  report_file_url VARCHAR(255),
  company_feedback TEXT,
  status ENUM('SUBMITTED', 'APPROVED', 'NEEDS_REVISION') DEFAULT 'SUBMITTED',
  FOREIGN KEY (assignment_id) REFERENCES internship_assignments(assignment_id) ON DELETE CASCADE
);

-- 10. Evaluations Table
CREATE TABLE IF NOT EXISTS evaluations (
  evaluation_id INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT NOT NULL,
  evaluator_type ENUM('COMPANY', 'FACULTY') NOT NULL,
  technical_score INT CHECK (technical_score BETWEEN 1 AND 10),
  soft_skills_score INT CHECK (soft_skills_score BETWEEN 1 AND 10),
  punctuality_score INT CHECK (punctuality_score BETWEEN 1 AND 10),
  overall_score DECIMAL(4,2),
  comments TEXT,
  evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (assignment_id) REFERENCES internship_assignments(assignment_id) ON DELETE CASCADE
);

-- 11. Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
  certificate_id INT PRIMARY KEY AUTO_INCREMENT,
  assignment_id INT NOT NULL UNIQUE,
  certificate_code VARCHAR(50) NOT NULL UNIQUE,
  issued_date DATE NOT NULL,
  grade VARCHAR(5),
  FOREIGN KEY (assignment_id) REFERENCES internship_assignments(assignment_id) ON DELETE CASCADE
);
