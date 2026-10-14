// Mock Database State mirroring MySQL Database Schema: internship_management

export const initialUsers = [
  { user_id: 1, username: 'alex_student', role: 'STUDENT', name: 'Alex Johnson' },
  { user_id: 2, username: 'techcorp_hr', role: 'COMPANY', name: 'TechCorp Solutions' },
  { user_id: 3, username: 'dr_sarah_faculty', role: 'FACULTY', name: 'Dr. Sarah Jenkins' },
  { user_id: 4, username: 'admin_user', role: 'ADMIN', name: 'System Administrator' },
  { user_id: 5, username: 'priya_student', role: 'STUDENT', name: 'Priya Sharma' },
  { user_id: 6, username: 'innovate_inc', role: 'COMPANY', name: 'Innovate Labs Inc' }
];

export const initialStudents = [
  {
    student_id: 101,
    user_id: 1,
    roll_no: 'CS2023089',
    name: 'Alex Johnson',
    email: 'alex.j@university.edu',
    phone: '+1 (555) 234-5678',
    department: 'Computer Science',
    semester: 7,
    cgpa: 3.85,
    skills: 'React, Node.js, Python, TypeScript, SQL, TailWind CSS',
    resume_url: 'https://example.com/resumes/alex_johnson_cv.pdf'
  },
  {
    student_id: 102,
    user_id: 5,
    roll_no: 'CS2023104',
    name: 'Priya Sharma',
    email: 'priya.s@university.edu',
    phone: '+1 (555) 876-5432',
    department: 'Information Technology',
    semester: 7,
    cgpa: 3.92,
    skills: 'Python, Machine Learning, Fast API, PostgreSQL, PyTorch',
    resume_url: 'https://example.com/resumes/priya_sharma_resume.pdf'
  }
];

export const initialCompanies = [
  {
    company_id: 201,
    user_id: 2,
    company_name: 'TechCorp Solutions',
    contact_person: 'Marcus Vance',
    email: 'careers@techcorp.com',
    phone: '+1 (800) 555-0199',
    website: 'https://techcorp-example.com',
    location: 'San Francisco, CA (Remote Friendly)',
    industry: 'Software Engineering & Cloud Solutions'
  },
  {
    company_id: 202,
    user_id: 6,
    company_name: 'Innovate Labs Inc',
    contact_person: 'Elena Rostova',
    email: 'internships@innovatelabs.io',
    phone: '+1 (800) 555-0244',
    website: 'https://innovatelabs.io',
    location: 'New York, NY',
    industry: 'Artificial Intelligence & Data Analytics'
  }
];

export const initialFaculty = [
  {
    faculty_id: 301,
    user_id: 3,
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@university.edu',
    department: 'Computer Science',
    designation: 'Associate Professor & Internship Coordinator'
  },
  {
    faculty_id: 302,
    user_id: 4,
    name: 'Prof. Robert Thorne',
    email: 'r.thorne@university.edu',
    department: 'Information Technology',
    designation: 'Head of Department'
  }
];

export const initialInternships = [
  {
    internship_id: 401,
    company_id: 201,
    company_name: 'TechCorp Solutions',
    title: 'Full Stack Software Engineer Intern',
    description: 'Join our dynamic core product team to build scalable microservices and high-performance React web interfaces.',
    requirements: 'Proficiency in JavaScript/TypeScript, React, Node.js, and REST APIs. Familiarity with SQL or MongoDB is a plus.',
    stipend: 2500.00,
    location: 'Remote / San Francisco',
    duration_weeks: 12,
    deadline: '2026-10-15',
    status: 'OPEN'
  },
  {
    internship_id: 402,
    company_id: 202,
    company_name: 'Innovate Labs Inc',
    title: 'AI & Data Science Intern',
    description: 'Work on cutting-edge LLM pipelines and computer vision model optimization for real-world enterprise clients.',
    requirements: 'Strong Python background, PyTorch/TensorFlow, Pandas, and experience with REST API deployment.',
    stipend: 3000.00,
    location: 'New York, NY',
    duration_weeks: 16,
    deadline: '2026-10-30',
    status: 'OPEN'
  },
  {
    internship_id: 403,
    company_id: 201,
    company_name: 'TechCorp Solutions',
    title: 'Cloud DevOps & Infrastructure Intern',
    description: 'Help automate CI/CD pipelines, Docker containerization, and AWS Kubernetes infrastructure setup.',
    requirements: 'Linux fundamentals, Docker, GitHub Actions, basic scripting in Python or Bash.',
    stipend: 2200.00,
    location: 'Remote',
    duration_weeks: 10,
    deadline: '2026-11-05',
    status: 'OPEN'
  }
];

export const initialApplications = [
  {
    application_id: 501,
    student_id: 101,
    student_name: 'Alex Johnson',
    student_email: 'alex.j@university.edu',
    student_cgpa: 3.85,
    internship_id: 401,
    internship_title: 'Full Stack Software Engineer Intern',
    company_name: 'TechCorp Solutions',
    applied_date: '2026-09-15',
    status: 'SELECTED', // Workflow state demo
    cover_letter: 'I am highly passionate about full stack development and eager to contribute to TechCorp with my skills in React and Node.js.'
  },
  {
    application_id: 502,
    student_id: 102,
    student_name: 'Priya Sharma',
    student_email: 'priya.s@university.edu',
    student_cgpa: 3.92,
    internship_id: 402,
    internship_title: 'AI & Data Science Intern',
    company_name: 'Innovate Labs Inc',
    applied_date: '2026-09-18',
    status: 'UNDER_REVIEW',
    cover_letter: 'My focus on Machine Learning and PyTorch model fine-tuning makes me a great candidate for Innovate Labs.'
  },
  {
    application_id: 503,
    student_id: 101,
    student_name: 'Alex Johnson',
    student_email: 'alex.j@university.edu',
    student_cgpa: 3.85,
    internship_id: 402,
    internship_title: 'AI & Data Science Intern',
    company_name: 'Innovate Labs Inc',
    applied_date: '2026-09-20',
    status: 'APPLIED',
    cover_letter: 'I am excited to expand my backend skills into machine learning pipelines.'
  }
];

export const initialAssignments = [
  {
    assignment_id: 601,
    application_id: 501,
    student_id: 101,
    student_name: 'Alex Johnson',
    company_name: 'TechCorp Solutions',
    internship_title: 'Full Stack Software Engineer Intern',
    faculty_id: 301,
    faculty_name: 'Dr. Sarah Jenkins',
    company_supervisor: 'Marcus Vance (Senior Tech Lead)',
    start_date: '2026-09-01',
    end_date: '2026-11-25',
    status: 'ONGOING'
  }
];

export const initialAttendance = [
  {
    attendance_id: 701,
    assignment_id: 601,
    date: '2026-09-22',
    status: 'PRESENT',
    tasks_completed: 'Integrated JWT authentication middleware into Express API endpoints.'
  },
  {
    attendance_id: 702,
    assignment_id: 601,
    date: '2026-09-23',
    status: 'PRESENT',
    tasks_completed: 'Developed dashboard layout components with Tailwind CSS and unit tests.'
  },
  {
    attendance_id: 703,
    assignment_id: 601,
    date: '2026-09-24',
    status: 'PRESENT',
    tasks_completed: 'Fixed backend WebSocket connection drops during data streaming.'
  },
  {
    attendance_id: 704,
    assignment_id: 601,
    date: '2026-09-25',
    status: 'PRESENT',
    tasks_completed: 'Attended sprint review meeting and documented API swagger specifications.'
  }
];

export const initialProgressReports = [
  {
    report_id: 801,
    assignment_id: 601,
    report_week: 1,
    submitted_date: '2026-09-07',
    summary: 'Onboarding completed. Set up development environment, pulled repository, and fixed 3 minor UI bugs.',
    report_file_url: 'https://example.com/reports/week1_alex_johnson.pdf',
    company_feedback: 'Great start! Alex adapted quickly to our repository structure.',
    status: 'APPROVED'
  },
  {
    report_id: 802,
    assignment_id: 601,
    report_week: 2,
    submitted_date: '2026-09-14',
    summary: 'Designed REST API endpoints for user profile management and integrated MySQL connection pool.',
    report_file_url: 'https://example.com/reports/week2_alex_johnson.pdf',
    company_feedback: 'Code quality was clean and well commented.',
    status: 'APPROVED'
  },
  {
    report_id: 803,
    assignment_id: 601,
    report_week: 3,
    submitted_date: '2026-09-21',
    summary: 'Refactored state management in React frontend and implemented progress step indicators.',
    report_file_url: 'https://example.com/reports/week3_alex_johnson.pdf',
    company_feedback: 'Pending review by company mentor.',
    status: 'SUBMITTED'
  }
];

export const initialEvaluations = [
  {
    evaluation_id: 901,
    assignment_id: 601,
    evaluator_type: 'COMPANY',
    evaluator_name: 'Marcus Vance (TechCorp Supervisor)',
    technical_score: 9,
    soft_skills_score: 9,
    punctuality_score: 10,
    overall_score: 9.3,
    comments: 'Alex has shown outstanding technical problem-solving ability and great communication throughout the sprint.',
    evaluated_at: '2026-09-26'
  },
  {
    evaluation_id: 902,
    assignment_id: 601,
    evaluator_type: 'FACULTY',
    evaluator_name: 'Dr. Sarah Jenkins (Faculty Mentor)',
    technical_score: 10,
    soft_skills_score: 9,
    punctuality_score: 9,
    overall_score: 9.5,
    comments: 'Weekly progress reports are exemplary and academic learning outcomes have been thoroughly fulfilled.',
    evaluated_at: '2026-09-27'
  }
];

export const initialCertificates = [
  {
    certificate_id: 1001,
    assignment_id: 601,
    student_name: 'Alex Johnson',
    company_name: 'TechCorp Solutions',
    internship_title: 'Full Stack Software Engineer Intern',
    certificate_code: 'CERT-2026-8942',
    issued_date: '2026-09-28',
    grade: 'A+',
    verification_hash: '0x8f9a7c2e3b1d4a5f6e',
    status: 'ISSUED'
  }
];
