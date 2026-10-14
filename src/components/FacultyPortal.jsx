import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  FileText, 
  Briefcase, 
  CalendarCheck2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserPlus, 
  Sparkles, 
  MessageSquare, 
  User, 
  ExternalLink,
  BookOpen,
  Award,
  Edit,
  Save,
  CheckCircle2
} from 'lucide-react';

export default function FacultyPortal({
  students,
  setStudents,
  faculty,
  applications,
  setApplications,
  assignments,
  setAssignments,
  attendance,
  progressReports,
  setProgressReports,
  onLogSql
}) {
  const [activeTab, setActiveTab] = useState('student_profiles'); // 'student_profiles' | 'applications' | 'active_internships' | 'attendance_progress'
  const [attendanceSubTab, setAttendanceSubTab] = useState('reports'); // 'attendance' | 'reports'

  // Search & Filter state for Students list
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  // New Student Registration Modal state
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    roll_no: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    semester: 7,
    cgpa: 3.5,
    skills: 'React, Node.js, Python, SQL',
    resume_url: 'https://example.com/resumes/student_cv.pdf'
  });

  // Application Filter state
  const [appStatusFilter, setAppStatusFilter] = useState('ALL');

  // Selected Application for Assigning Faculty & Creating Assignment
  const [selectedAppForAssignment, setSelectedAppForAssignment] = useState(null);
  const [assignedFacultyId, setAssignedFacultyId] = useState(faculty[0]?.faculty_id || 301);

  // Review Report State
  const [selectedReportToReview, setSelectedReportToReview] = useState(null);
  const [feedbackComment, setFeedbackComment] = useState('');

  // Toast message
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. ADD NEW STUDENT HANDLER
  const handleAddStudent = (e) => {
    e.preventDefault();
    const newStudentId = 100 + Date.now() % 1000;
    const newStudent = {
      student_id: newStudentId,
      user_id: 10 + Date.now() % 100,
      ...newStudentForm
    };

    setStudents(prev => [...prev, newStudent]);
    setIsAddStudentOpen(false);
    setNewStudentForm({
      roll_no: '',
      name: '',
      email: '',
      phone: '',
      department: 'Computer Science',
      semester: 7,
      cgpa: 3.5,
      skills: 'React, Node.js, Python, SQL',
      resume_url: 'https://example.com/resumes/student_cv.pdf'
    });

    const sql = `INSERT INTO students (student_id, user_id, roll_no, name, email, phone, department, semester, cgpa, skills, resume_url) VALUES (${newStudentId}, ${newStudent.user_id}, '${newStudent.roll_no}', '${newStudent.name.replace(/'/g, "''")}', '${newStudent.email}', '${newStudent.phone}', '${newStudent.department}', ${newStudent.semester}, ${newStudent.cgpa}, '${newStudent.skills.replace(/'/g, "''")}', '${newStudent.resume_url}');`;
    onLogSql && onLogSql(sql, 'INSERT', 'students');
    showToast(`New student ${newStudent.name} registered in database!`);
  };

  // 2. CHANGE APPLICATION STATUS
  const handleUpdateAppStatus = (appId, newStatus) => {
    setApplications(prev => prev.map(a => a.application_id === appId ? { ...a, status: newStatus } : a));

    const sql = `UPDATE applications SET status = '${newStatus}' WHERE application_id = ${appId};`;
    onLogSql && onLogSql(sql, 'UPDATE', 'applications');
    showToast(`Application #${appId} status set to ${newStatus}`);
  };

  // 3. CREATE ACTIVE INTERNSHIP ASSIGNMENT
  const handleCreateAssignment = (e) => {
    e.preventDefault();
    if (!selectedAppForAssignment) return;

    const selectedFacultyObj = faculty.find(f => f.faculty_id === parseInt(assignedFacultyId)) || faculty[0];
    const newAssignId = 600 + Date.now() % 1000;

    const newAssignment = {
      assignment_id: newAssignId,
      application_id: selectedAppForAssignment.application_id,
      student_id: selectedAppForAssignment.student_id,
      student_name: selectedAppForAssignment.student_name,
      company_name: selectedAppForAssignment.company_name,
      internship_title: selectedAppForAssignment.internship_title,
      faculty_id: selectedFacultyObj.faculty_id,
      faculty_name: selectedFacultyObj.name,
      company_supervisor: 'Industry Lead',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      status: 'ONGOING'
    };

    // Update application to SELECTED
    setApplications(prev => prev.map(a => a.application_id === selectedAppForAssignment.application_id ? { ...a, status: 'SELECTED' } : a));
    // Add to assignments
    setAssignments(prev => [newAssignment, ...prev]);

    setSelectedAppForAssignment(null);

    const sql = `INSERT INTO internship_assignments (assignment_id, application_id, faculty_id, start_date, end_date, status) VALUES (${newAssignId}, ${selectedAppForAssignment.application_id}, ${selectedFacultyObj.faculty_id}, '${newAssignment.start_date}', '${newAssignment.end_date}', 'ONGOING');`;
    onLogSql && onLogSql(sql, 'INSERT', 'internship_assignments');
    showToast(`Active internship assignment created & assigned to ${selectedFacultyObj.name}!`);
  };

  // 4. REVIEW PROGRESS REPORT
  const handleReviewReport = (reportId, statusVal) => {
    setProgressReports(prev => prev.map(r => r.report_id === reportId ? {
      ...r,
      status: statusVal,
      company_feedback: feedbackComment || (statusVal === 'APPROVED' ? 'Report reviewed and approved by faculty mentor.' : 'Please revise Section 3 and resubmit.')
    } : r));

    const sql = `UPDATE progress_reports SET status = '${statusVal}', company_feedback = '${(feedbackComment || 'Faculty review completed').replace(/'/g, "''")}' WHERE report_id = ${reportId};`;
    onLogSql && onLogSql(sql, 'UPDATE', 'progress_reports');

    setSelectedReportToReview(null);
    setFeedbackComment('');
    showToast(`Progress report #${reportId} status updated to ${statusVal}!`);
  };

  // Filtering Students
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.roll_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'ALL' || s.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  // Filtering Applications
  const filteredApplications = applications.filter(a => appStatusFilter === 'ALL' || a.status === appStatusFilter);

  const departments = ['ALL', ...new Set(students.map(s => s.department).filter(Boolean))];

  return (
    <div className="space-y-6">
      
      {/* Faculty Portal Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-sky-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-600 via-blue-700 to-sky-900 p-0.5 shadow-lg shadow-sky-600/25 flex items-center justify-center shrink-0">
              <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center">
                <Users className="h-7 w-7 text-sky-700" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
                  Faculty & Department Portal
                </span>
                <span className="text-xs text-sky-700 font-mono">Coordinator Mode</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                Faculty Internship Control Dashboard
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Manage all student profiles, approve applications, oversee active internships, and evaluate attendance & progress reports.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold bg-white/80 p-2.5 rounded-xl border border-sky-200">
            <span className="text-slate-500">Total Students:</span>
            <span className="text-sky-800 font-mono text-sm">{students.length}</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Active Internships:</span>
            <span className="text-emerald-700 font-mono text-sm">{assignments.length}</span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-sky-100 border border-sky-300 text-sky-950 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <Sparkles className="h-4 w-4 text-sky-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Faculty Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-sky-100/70 rounded-2xl border border-sky-200">
        <button
          onClick={() => setActiveTab('student_profiles')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'student_profiles'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 scale-[1.01]'
              : 'text-slate-700 hover:text-slate-900 hover:bg-sky-200/60'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>1. Profiles of All Students ({students.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'applications'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 scale-[1.01]'
              : 'text-slate-700 hover:text-slate-900 hover:bg-sky-200/60'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>2. Applications ({applications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('active_internships')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'active_internships'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 scale-[1.01]'
              : 'text-slate-700 hover:text-slate-900 hover:bg-sky-200/60'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>3. Active Internships ({assignments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance_progress')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'attendance_progress'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 scale-[1.01]'
              : 'text-slate-700 hover:text-slate-900 hover:bg-sky-200/60'
          }`}
        >
          <CalendarCheck2 className="h-4 w-4" />
          <span>4. Attendance & Progress ({attendance.length + progressReports.length})</span>
        </button>
      </div>

      {/* MODAL: REGISTER NEW STUDENT */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-xl w-full p-6 rounded-3xl border border-sky-300 shadow-2xl bg-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-sky-600" />
                  Register New Student Profile
                </h3>
                <p className="text-xs text-slate-500">Insert a new student record into the <code className="font-mono">students</code> table.</p>
              </div>
              <button 
                onClick={() => setIsAddStudentOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Student Name</label>
                  <input
                    type="text"
                    value={newStudentForm.name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                    placeholder="e.g. Rahul Verma"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={newStudentForm.roll_no}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, roll_no: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input font-mono"
                    placeholder="CS2024105"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={newStudentForm.email}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                    placeholder="rahul@university.edu"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={newStudentForm.phone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                    placeholder="+1 (555) 000-1122"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <input
                    type="text"
                    value={newStudentForm.department}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Semester</label>
                  <input
                    type="number"
                    value={newStudentForm.semester}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, semester: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newStudentForm.cgpa}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, cgpa: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl glass-input font-bold text-sky-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Skills</label>
                <textarea
                  rows={2}
                  value={newStudentForm.skills}
                  onChange={(e) => setNewStudentForm({ ...newStudentForm, skills: e.target.value })}
                  className="w-full p-2.5 rounded-xl glass-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md"
                >
                  Insert Student into Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ASSIGN FACULTY & CREATE ASSIGNMENT */}
      {selectedAppForAssignment && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-3xl border border-sky-300 shadow-2xl bg-white space-y-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-sky-700 uppercase">Approve & Assign Faculty</span>
                <h3 className="text-base font-extrabold text-slate-900">{selectedAppForAssignment.student_name}</h3>
                <p className="text-xs text-sky-800">{selectedAppForAssignment.internship_title} at {selectedAppForAssignment.company_name}</p>
              </div>
              <button 
                onClick={() => setSelectedAppForAssignment(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select University Faculty Mentor</label>
                <select
                  value={assignedFacultyId}
                  onChange={(e) => setAssignedFacultyId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl glass-input font-bold text-sky-900"
                >
                  {faculty.map(f => (
                    <option key={f.faculty_id} value={f.faculty_id}>
                      {f.name} ({f.department} - {f.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-800">Assignment SQL Action:</div>
                <div className="text-[11px]">1. Update application status to <span className="font-bold text-emerald-700">SELECTED</span></div>
                <div className="text-[11px]">2. Create active contract record in <span className="font-mono text-sky-800">internship_assignments</span> table</div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAppForAssignment(null)}
                  className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md"
                >
                  Approve & Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SECTION 1: PROFILES OF ALL STUDENTS */}
      {activeTab === 'student_profiles' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="glass-card p-5 rounded-2xl border border-sky-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-sky-500" />
                <input
                  type="text"
                  placeholder="Search students by name, roll no, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-xs"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-3 py-2 rounded-xl glass-input text-xs font-bold text-sky-800"
              >
                {departments.map(d => (
                  <option key={d} value={d}>
                    Department: {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Add New Student Action */}
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 shrink-0"
            >
              <Plus className="h-4 w-4" />
              <span>Register New Student Profile</span>
            </button>
          </div>

          {/* Students Grid / Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((st) => {
              const hasAssignment = assignments.some(a => a.student_id === st.student_id);
              const appCount = applications.filter(a => a.student_id === st.student_id).length;

              return (
                <div key={st.student_id} className="glass-panel p-5 rounded-2xl border border-sky-200 space-y-4 hover:border-sky-400 transition-all">
                  <div className="flex items-start justify-between border-b border-sky-100 pb-3">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">{st.name}</h4>
                      <span className="text-xs font-mono text-sky-800 font-bold">{st.roll_no}</span>
                    </div>

                    <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 border border-sky-300">
                      CGPA {st.cgpa}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div><strong className="text-slate-800">Email:</strong> {st.email}</div>
                    <div><strong className="text-slate-800">Phone:</strong> {st.phone || 'N/A'}</div>
                    <div><strong className="text-slate-800">Department:</strong> {st.department} (Sem {st.semester})</div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-700">Skills:</span>
                    <div className="flex flex-wrap gap-1">
                      {st.skills?.split(',').slice(0, 4).map((sk, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 font-mono border border-sky-200">
                          {sk.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sky-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono">ID: #{st.student_id}</span>

                    {hasAssignment ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        Active Intern
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-300">
                        {appCount} Applications
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: APPLICATIONS MANAGEMENT */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          
          {/* Header & Filter */}
          <div className="glass-card p-5 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-sky-600" />
                Student Applications Queue
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Review student applications, change status, and assign university faculty mentors.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-slate-600">Filter Status:</span>
              <select
                value={appStatusFilter}
                onChange={(e) => setAppStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl glass-input text-xs font-bold text-sky-800"
              >
                <option value="ALL">ALL ({applications.length})</option>
                <option value="APPLIED">APPLIED</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                <option value="SELECTED">SELECTED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center text-xs text-slate-400">
                No applications matching current status filter.
              </div>
            ) : (
              filteredApplications.map((app) => (
                <div key={app.application_id} className="glass-panel p-5 rounded-2xl border border-sky-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-slate-900">{app.student_name}</h4>
                        <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                          CGPA {app.student_cgpa}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Applied for <strong className="text-slate-900">{app.internship_title}</strong> at <strong className="text-sky-800">{app.company_name}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        app.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                        app.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                        'bg-sky-100 text-sky-800 border border-sky-300'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {app.cover_letter && (
                    <div className="p-3 bg-sky-50 rounded-xl text-xs text-slate-700 space-y-1 border border-sky-100">
                      <span className="font-bold text-slate-600">Cover Letter:</span>
                      <p className="italic leading-relaxed">"{app.cover_letter}"</p>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                    <span className="text-slate-500 font-mono">App ID: #{app.application_id} | Applied: {app.applied_date}</span>

                    <div className="flex items-center gap-2">
                      {app.status === 'APPLIED' && (
                        <button
                          onClick={() => handleUpdateAppStatus(app.application_id, 'UNDER_REVIEW')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300"
                        >
                          Mark Under Review
                        </button>
                      )}

                      {app.status !== 'SELECTED' && (
                        <button
                          onClick={() => setSelectedAppForAssignment(app)}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow"
                        >
                          Approve & Assign Faculty
                        </button>
                      )}

                      {app.status !== 'REJECTED' && app.status !== 'SELECTED' && (
                        <button
                          onClick={() => handleUpdateAppStatus(app.application_id, 'REJECTED')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: ACTIVE INTERNSHIPS MONITOR */}
      {activeTab === 'active_internships' && (
        <div className="space-y-6">
          <div className="glass-card p-5 rounded-2xl border border-sky-200">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-sky-600" />
              Active Ongoing Student Internships ({assignments.length})
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Overview of all active internship contracts in the <code className="font-mono">internship_assignments</code> table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((as) => (
              <div key={as.assignment_id} className="glass-panel p-6 rounded-2xl border border-sky-200 space-y-4">
                <div className="flex items-start justify-between border-b border-sky-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ONGOING
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-1">{as.student_name}</h4>
                    <div className="text-xs text-sky-800 font-bold">{as.internship_title}</div>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-500">#{as.assignment_id}</span>
                </div>

                <div className="text-xs space-y-2 text-slate-600">
                  <div><strong className="text-slate-800">Company:</strong> {as.company_name}</div>
                  <div><strong className="text-slate-800">Faculty Mentor:</strong> {as.faculty_name || 'Dr. Sarah Jenkins'}</div>
                  <div><strong className="text-slate-800">Company Supervisor:</strong> {as.company_supervisor}</div>
                  <div className="font-mono text-[11px] pt-1 text-slate-500">
                    Duration: {as.start_date} to {as.end_date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: ATTENDANCE & PROGRESS VERIFICATION */}
      {activeTab === 'attendance_progress' && (
        <div className="space-y-6">
          
          <div className="glass-card p-5 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck2 className="h-5 w-5 text-sky-600" />
                Attendance Verification & Progress Report Review
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Track daily attendance entries logged by students and evaluate weekly progress report submissions.
              </p>
            </div>

            <div className="flex p-1 bg-sky-100/70 rounded-xl border border-sky-200 text-xs font-bold">
              <button
                onClick={() => setAttendanceSubTab('reports')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  attendanceSubTab === 'reports' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Weekly Progress Reports ({progressReports.length})
              </button>
              <button
                onClick={() => setAttendanceSubTab('attendance')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  attendanceSubTab === 'attendance' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                All Attendance Logs ({attendance.length})
              </button>
            </div>
          </div>

          {/* REPORTS REVIEW */}
          {attendanceSubTab === 'reports' && (
            <div className="space-y-4">
              {progressReports.map((report) => {
                const as = assignments.find(a => a.assignment_id === report.assignment_id);
                return (
                  <div key={report.report_id} className="glass-panel p-6 rounded-2xl border border-sky-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">
                            WEEK #{report.report_week}
                          </span>
                          <h4 className="font-extrabold text-slate-900 text-sm">{as?.student_name || 'Student'}</h4>
                          <span className="text-xs text-sky-800 font-semibold">• {as?.company_name}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">Submitted: {report.submitted_date}</div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        report.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        report.status === 'NEEDS_REVISION' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                        'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {report.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed">{report.summary}</p>

                    <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Faculty Review & Feedback:</span>
                        <a href={report.report_file_url} target="_blank" rel="noreferrer" className="text-sky-700 font-mono text-[11px] underline">
                          View Report PDF
                        </a>
                      </div>
                      
                      {selectedReportToReview === report.report_id ? (
                        <div className="space-y-2 pt-1">
                          <textarea
                            rows={2}
                            value={feedbackComment}
                            onChange={(e) => setFeedbackComment(e.target.value)}
                            placeholder="Enter review feedback for the student..."
                            className="w-full p-2 rounded-lg glass-input text-xs"
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleReviewReport(report.report_id, 'NEEDS_REVISION')}
                              className="px-3 py-1 rounded-lg font-bold bg-rose-100 text-rose-800 hover:bg-rose-200 text-xs"
                            >
                              Request Revision
                            </button>
                            <button
                              onClick={() => handleReviewReport(report.report_id, 'APPROVED')}
                              className="px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white hover:bg-emerald-700 text-xs shadow"
                            >
                              Approve Report
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="italic">{report.company_feedback}</span>
                          <button
                            onClick={() => {
                              setSelectedReportToReview(report.report_id);
                              setFeedbackComment(report.company_feedback || '');
                            }}
                            className="px-3 py-1 rounded-lg font-bold bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300 text-xs"
                          >
                            Edit Review Feedback
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ALL ATTENDANCE LOGS */}
          {attendanceSubTab === 'attendance' && (
            <div className="glass-panel p-6 rounded-2xl border border-sky-200 space-y-4">
              <h3 className="text-base font-bold text-slate-900 border-b border-sky-100 pb-3">
                All Recorded Student Daily Attendance Logs
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-sky-50 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3 rounded-l-lg">Student</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 rounded-r-lg">Tasks Completed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-100">
                    {attendance.map((log) => {
                      const as = assignments.find(a => a.assignment_id === log.assignment_id);
                      return (
                        <tr key={log.attendance_id} className="hover:bg-sky-50/60">
                          <td className="p-3 font-bold text-slate-900">{as?.student_name || 'Student'}</td>
                          <td className="p-3 font-mono text-slate-700">{log.date}</td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              log.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-700">{log.tasks_completed}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
