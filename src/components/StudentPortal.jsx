import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Award, 
  FileText, 
  CheckCircle2, 
  Save, 
  ExternalLink, 
  Sparkles, 
  GraduationCap,
  Briefcase,
  CalendarCheck2,
  FileSearch,
  Clock,
  Plus,
  Building,
  CheckCircle,
  AlertCircle,
  Clock3,
  MessageSquare
} from 'lucide-react';

export default function StudentPortal({
  students,
  setStudents,
  currentStudentId,
  setCurrentStudentId,
  internships,
  applications,
  setApplications,
  assignments,
  attendance,
  setAttendance,
  progressReports,
  setProgressReports,
  onLogSql
}) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'applications' | 'active_internship' | 'attendance_progress'
  const [attendanceSubTab, setAttendanceSubTab] = useState('attendance'); // 'attendance' | 'reports'

  // Saved profile toast
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Find active student object
  const student = students.find(s => s.student_id === currentStudentId) || students[0] || {};

  // Form states for Student Profile edit
  const [profileForm, setProfileForm] = useState({ ...student });

  // Update profile form state when current student changes
  React.useEffect(() => {
    if (student.student_id) {
      setProfileForm({ ...student });
    }
  }, [student.student_id]);

  // Form states for Applying to Internship
  const [selectedInternshipForApp, setSelectedInternshipForApp] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');

  // Form states for Attendance Entry
  const [newAttendance, setNewAttendance] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    tasks_completed: ''
  });

  // Form states for Weekly Report Entry
  const [newReport, setNewReport] = useState({
    report_week: 1,
    summary: '',
    report_file_url: 'https://example.com/reports/weekly_report.pdf'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // 1. SAVE PROFILE HANDLER
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setStudents(prev => prev.map(s => s.student_id === profileForm.student_id ? profileForm : s));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    const sql = `UPDATE students SET name = '${profileForm.name?.replace(/'/g, "''")}', roll_no = '${profileForm.roll_no}', email = '${profileForm.email}', phone = '${profileForm.phone}', department = '${profileForm.department}', semester = ${profileForm.semester}, cgpa = ${profileForm.cgpa}, skills = '${profileForm.skills?.replace(/'/g, "''")}', resume_url = '${profileForm.resume_url}' WHERE student_id = ${profileForm.student_id};`;
    onLogSql && onLogSql(sql, 'UPDATE', 'students');
    showToast(`Student profile updated in database!`);
  };

  // 2. SUBMIT INTERNSHIP APPLICATION HANDLER
  const handleApplyInternship = (e) => {
    e.preventDefault();
    if (!selectedInternshipForApp) return;

    const newAppId = 500 + Date.now() % 10000;
    const newApp = {
      application_id: newAppId,
      student_id: student.student_id,
      student_name: student.name,
      student_email: student.email,
      student_cgpa: student.cgpa,
      internship_id: selectedInternshipForApp.internship_id,
      internship_title: selectedInternshipForApp.title,
      company_name: selectedInternshipForApp.company_name,
      applied_date: new Date().toISOString().split('T')[0],
      status: 'APPLIED',
      cover_letter: coverLetter
    };

    setApplications(prev => [newApp, ...prev]);
    setSelectedInternshipForApp(null);
    setCoverLetter('');

    const sql = `INSERT INTO applications (application_id, student_id, internship_id, applied_date, status, cover_letter) VALUES (${newAppId}, ${student.student_id}, ${selectedInternshipForApp.internship_id}, '${newApp.applied_date}', 'APPLIED', '${coverLetter.replace(/'/g, "''")}');`;
    onLogSql && onLogSql(sql, 'INSERT', 'applications');
    showToast(`Application submitted for ${selectedInternshipForApp.title}!`);
  };

  // Active student's applications
  const myApplications = applications.filter(a => a.student_id === student.student_id);

  // Active student's assignment
  const myAssignment = assignments.find(a => a.student_id === student.student_id);

  // Active student's attendance & reports
  const myAttendance = myAssignment 
    ? attendance.filter(att => att.assignment_id === myAssignment.assignment_id)
    : [];
  
  const myReports = myAssignment 
    ? progressReports.filter(rep => rep.assignment_id === myAssignment.assignment_id)
    : [];

  // 3. SUBMIT ATTENDANCE LOG
  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    if (!myAssignment) {
      alert('You do not have an active internship assignment to log attendance for.');
      return;
    }

    const attId = 700 + Date.now() % 10000;
    const entry = {
      attendance_id: attId,
      assignment_id: myAssignment.assignment_id,
      ...newAttendance
    };

    setAttendance(prev => [entry, ...prev]);
    setNewAttendance({
      date: new Date().toISOString().split('T')[0],
      status: 'PRESENT',
      tasks_completed: ''
    });

    const sql = `INSERT INTO attendance (attendance_id, assignment_id, date, status, tasks_completed) VALUES (${attId}, ${myAssignment.assignment_id}, '${newAttendance.date}', '${newAttendance.status}', '${newAttendance.tasks_completed.replace(/'/g, "''")}');`;
    onLogSql && onLogSql(sql, 'INSERT', 'attendance');
    showToast(`Daily attendance logged for ${newAttendance.date}`);
  };

  // 4. SUBMIT PROGRESS REPORT
  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!myAssignment) {
      alert('You do not have an active internship assignment to submit reports for.');
      return;
    }

    const reportId = 800 + Date.now() % 10000;
    const reportEntry = {
      report_id: reportId,
      assignment_id: myAssignment.assignment_id,
      submitted_date: new Date().toISOString().split('T')[0],
      ...newReport,
      company_feedback: 'Pending supervisor & faculty review',
      status: 'SUBMITTED'
    };

    setProgressReports(prev => [reportEntry, ...prev]);
    setNewReport({
      report_week: myReports.length + 1,
      summary: '',
      report_file_url: 'https://example.com/reports/weekly_report.pdf'
    });

    const sql = `INSERT INTO progress_reports (report_id, assignment_id, report_week, submitted_date, summary, report_file_url, status) VALUES (${reportId}, ${myAssignment.assignment_id}, ${newReport.report_week}, '${reportEntry.submitted_date}', '${newReport.summary.replace(/'/g, "''")}', '${newReport.report_file_url}', 'SUBMITTED');`;
    onLogSql && onLogSql(sql, 'INSERT', 'progress_reports');
    showToast(`Week #${newReport.report_week} progress report submitted!`);
  };

  return (
    <div className="space-y-6">
      
      {/* Student Portal Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-sky-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 p-0.5 shadow-lg shadow-sky-500/25 flex items-center justify-center shrink-0">
              <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-sky-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
                  Student Portal View
                </span>
                <span className="text-xs text-sky-700 font-mono">Roll: {student.roll_no}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
                Welcome, {student.name}
              </h1>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-3">
                <span>{student.department} • Semester {student.semester}</span>
                <span className="font-bold text-sky-800">CGPA: {student.cgpa}</span>
              </p>
            </div>
          </div>

          {/* Student Selector Switcher */}
          <div className="flex items-center gap-3 bg-white/80 p-2.5 rounded-xl border border-sky-200">
            <span className="text-xs font-bold text-slate-600">Active Student:</span>
            <select
              value={currentStudentId}
              onChange={(e) => setCurrentStudentId(parseInt(e.target.value))}
              className="px-3 py-1.5 rounded-lg glass-input text-xs font-bold text-sky-900"
            >
              {students.map(s => (
                <option key={s.student_id} value={s.student_id}>
                  {s.name} ({s.roll_no})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-sky-100 border border-sky-300 text-sky-950 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <Sparkles className="h-4 w-4 text-sky-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Student Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-sky-100/70 rounded-2xl border border-sky-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 scale-[1.01]'
              : 'text-slate-700 hover:text-slate-900 hover:bg-sky-200/60'
          }`}
        >
          <User className="h-4 w-4" />
          <span>1. Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all relative ${
            activeTab === 'applications'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 scale-[1.01]'
              : 'text-slate-700 hover:text-slate-900 hover:bg-sky-200/60'
          }`}
        >
          <FileSearch className="h-4 w-4" />
          <span>2. Internship Application</span>
          {myApplications.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'applications' ? 'bg-white text-sky-800' : 'bg-sky-200 text-sky-900'
            }`}>
              {myApplications.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('active_internship')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
            activeTab === 'active_internship'
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 scale-[1.01]'
              : 'text-slate-700 hover:text-slate-900 hover:bg-sky-200/60'
          }`}
        >
          <Briefcase className="h-4 w-4" />
          <span>3. Active Internship</span>
          {myAssignment && (
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          )}
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
          <span>4. Attendance & Progress</span>
        </button>
      </div>

      {/* SECTION 1: PROFILE DETAILS */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-sky-200 space-y-6">
            <div className="flex items-center justify-between border-b border-sky-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-sky-600" />
                  Student Profile & Database Information
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fill in your academic and skill information to store in the <code className="font-mono text-sky-700">students</code> database table.
                </p>
              </div>
              {savedSuccess && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-300">
                  <CheckCircle2 className="h-4 w-4 text-sky-600" />
                  Persisted to Database!
                </span>
              )}
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-sky-500" />
                    <input
                      type="text"
                      value={profileForm.name || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number / Student ID</label>
                  <input
                    type="text"
                    value={profileForm.roll_no || ''}
                    onChange={(e) => setProfileForm({ ...profileForm, roll_no: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input text-sm font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-sky-500" />
                    <input
                      type="email"
                      value={profileForm.email || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-sky-500" />
                    <input
                      type="text"
                      value={profileForm.phone || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-2.5 h-4 w-4 text-sky-500" />
                    <input
                      type="text"
                      value={profileForm.department || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                    <input
                      type="number"
                      value={profileForm.semester || 7}
                      onChange={(e) => setProfileForm({ ...profileForm, semester: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-xl glass-input text-sm font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA</label>
                    <div className="relative">
                      <Award className="absolute left-3 top-2.5 h-4 w-4 text-sky-500" />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="4.0"
                        value={profileForm.cgpa || 3.8}
                        onChange={(e) => setProfileForm({ ...profileForm, cgpa: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm font-bold text-sky-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Skills (Comma separated)</label>
                <textarea
                  rows={2}
                  value={profileForm.skills || ''}
                  onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                  className="w-full p-3 rounded-xl glass-input text-sm"
                  placeholder="React, Node.js, Python, SQL, TailWind CSS..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Resume Document URL</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FileText className="absolute left-3 top-2.5 h-4 w-4 text-sky-500" />
                    <input
                      type="url"
                      value={profileForm.resume_url || ''}
                      onChange={(e) => setProfileForm({ ...profileForm, resume_url: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
                      placeholder="https://example.com/my-resume.pdf"
                    />
                  </div>
                  {profileForm.resume_url && (
                    <a
                      href={profileForm.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300 text-xs font-semibold shrink-0"
                    >
                      <span>View Resume</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md shadow-sky-500/30 transition-all"
                >
                  <Save className="h-4 w-4" />
                  <span>Update Profile Info in Database</span>
                </button>
              </div>
            </form>
          </div>

          {/* Side Info & SQL schema helper */}
          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-sky-200 space-y-3">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Profile Summary Card
              </h4>

              <div className="p-4 rounded-xl bg-sky-50/80 border border-sky-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Student ID:</span>
                  <span className="font-mono font-bold text-slate-900">#{student.student_id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Roll No:</span>
                  <span className="font-mono font-bold text-slate-900">{student.roll_no}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">CGPA:</span>
                  <span className="font-bold text-sky-800">{student.cgpa} / 4.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-semibold text-slate-800">{student.department}</span>
                </div>
              </div>

              <div className="text-xs text-slate-600">
                <span className="font-bold text-slate-900">Skills Tags:</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {student.skills?.split(',').map((sk, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-[11px] border border-sky-300">
                      {sk.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-4 rounded-xl border border-sky-200 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>SQL Table Target:</span>
                <span className="font-mono text-[10px] text-sky-700 bg-sky-100 px-2 py-0.5 rounded">students</span>
              </div>
              <p className="text-[11px] text-slate-500">
                All form updates directly reflect in the MySQL relational database schema.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: INTERNSHIP APPLICATION */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          
          {/* Subheader */}
          <div className="glass-card p-5 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-sky-600" />
                Internship Applications Portal
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Browse available company internship openings and submit your application with a cover letter into the database.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-300">
                Submitted Applications: {myApplications.length}
              </span>
            </div>
          </div>

          {/* Modal for Application Form */}
          {selectedInternshipForApp && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="glass-panel max-w-xl w-full p-6 rounded-3xl border border-sky-300 shadow-2xl bg-white space-y-4">
                <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-sky-700 uppercase">Apply for Internship</span>
                    <h3 className="text-base font-extrabold text-slate-900">{selectedInternshipForApp.title}</h3>
                    <p className="text-xs text-sky-800 font-medium">{selectedInternshipForApp.company_name}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedInternshipForApp(null)}
                    className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleApplyInternship} className="space-y-4 text-xs">
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
                    <div className="font-bold text-slate-800">Applying as: {student.name} ({student.roll_no})</div>
                    <div className="text-slate-600">Email: {student.email} | CGPA: {student.cgpa}</div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Cover Letter & Statement of Interest</label>
                    <textarea
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      placeholder="Explain why you are a great fit for this internship role, your relevant project experience, and what you hope to achieve..."
                      className="w-full p-3 rounded-xl glass-input"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedInternshipForApp(null)}
                      className="px-4 py-2 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25"
                    >
                      Submit Application to Database
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Open Internship Listings */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Building className="h-4 w-4 text-sky-600" />
                Available Internship Openings ({internships.filter(i => i.status === 'OPEN').length})
              </h4>

              <div className="grid grid-cols-1 gap-4">
                {internships.map((internship) => {
                  const hasApplied = myApplications.some(a => a.internship_id === internship.internship_id);
                  return (
                    <div key={internship.internship_id} className="glass-panel p-5 rounded-2xl border border-sky-200 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-sky-700 uppercase bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                            {internship.company_name}
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-1">{internship.title}</h4>
                          <p className="text-xs text-slate-600 mt-1">{internship.description}</p>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-extrabold text-sky-800 font-mono">${internship.stipend}/mo</span>
                          <div className="text-[10px] text-slate-500">{internship.duration_weeks} Weeks</div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-sky-50/80 rounded-xl text-xs text-slate-700 space-y-1 border border-sky-100">
                        <div><strong className="text-slate-800">Requirements:</strong> {internship.requirements}</div>
                        <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                          <span>Location: {internship.location}</span>
                          <span>Deadline: {internship.deadline}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-slate-500 font-mono">ID: #{internship.internship_id}</span>
                        
                        {hasApplied ? (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Application Submitted</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedInternshipForApp(internship)}
                            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md shadow-sky-500/20"
                          >
                            <span>Apply Now</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submitted Applications Sidebar */}
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="h-4 w-4 text-sky-600" />
                My Application History ({myApplications.length})
              </h4>

              {myApplications.length === 0 ? (
                <div className="glass-panel p-5 rounded-2xl border border-sky-200 text-center text-xs text-slate-500">
                  You have not submitted any internship applications yet. Browse the openings on the left and click "Apply Now".
                </div>
              ) : (
                <div className="space-y-3">
                  {myApplications.map((app) => (
                    <div key={app.application_id} className="glass-panel p-4 rounded-xl border border-sky-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">{app.internship_title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'SELECTED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                          app.status === 'UNDER_REVIEW' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          'bg-sky-100 text-sky-800 border border-sky-300'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="text-xs text-sky-800 font-semibold">{app.company_name}</div>
                      <div className="text-[11px] text-slate-500">Applied on: {app.applied_date}</div>

                      {app.cover_letter && (
                        <div className="p-2 bg-sky-50 rounded-lg text-[11px] text-slate-600 italic line-clamp-2">
                          "{app.cover_letter}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: ACTIVE INTERNSHIP */}
      {activeTab === 'active_internship' && (
        <div className="space-y-6">
          {!myAssignment ? (
            <div className="glass-panel p-8 rounded-2xl border border-sky-200 text-center space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center">
                <Briefcase className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">No Active Internship Assignment Found</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Once your internship application is selected by a company and assigned a faculty mentor, your active contract details will appear here.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('applications')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 text-white hover:bg-sky-700 inline-block"
              >
                View Applications Status
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Active Contract Details */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-sky-200 space-y-6">
                <div className="flex items-center justify-between border-b border-sky-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      ONGOING CONTRACT
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900 mt-1">{myAssignment.internship_title}</h3>
                    <p className="text-xs text-sky-800 font-bold">{myAssignment.company_name}</p>
                  </div>

                  <span className="text-xs font-mono px-3 py-1 rounded-lg bg-sky-100 text-sky-800 border border-sky-300 font-bold">
                    Assignment #{myAssignment.assignment_id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase">Assigned Faculty Mentor</span>
                    <div className="font-bold text-sm text-slate-900">{myAssignment.faculty_name || 'Dr. Sarah Jenkins'}</div>
                    <div className="text-xs text-sky-700">Department of Computer Science</div>
                  </div>

                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase">Company Supervisor</span>
                    <div className="font-bold text-sm text-slate-900">{myAssignment.company_supervisor || 'Marcus Vance'}</div>
                    <div className="text-xs text-sky-700">Senior Engineering Lead</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-sky-100 pt-4 text-xs">
                  <div>
                    <span className="text-slate-500">Start Date:</span>
                    <div className="font-bold text-slate-900 font-mono mt-0.5">{myAssignment.start_date}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Expected Completion:</span>
                    <div className="font-bold text-slate-900 font-mono mt-0.5">{myAssignment.end_date}</div>
                  </div>
                </div>
              </div>

              {/* Quick Progress Metrics */}
              <div className="space-y-4">
                <div className="glass-panel p-5 rounded-2xl border border-sky-200 space-y-4">
                  <h4 className="text-sm font-bold text-slate-900">Internship Progress Stats</h4>
                  
                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between">
                    <span className="text-xs text-slate-600">Daily Attendance Logs:</span>
                    <span className="text-sm font-extrabold text-sky-800">{myAttendance.length} entries</span>
                  </div>

                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 flex items-center justify-between">
                    <span className="text-xs text-slate-600">Weekly Reports Submitted:</span>
                    <span className="text-sm font-extrabold text-sky-800">{myReports.length} reports</span>
                  </div>

                  <button
                    onClick={() => setActiveTab('attendance_progress')}
                    className="w-full py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md"
                  >
                    Go to Attendance & Progress Tab
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      )}

      {/* SECTION 4: ATTENDANCE & PROGRESS */}
      {activeTab === 'attendance_progress' && (
        <div className="space-y-6">
          
          {/* Header & Subtab Switcher */}
          <div className="glass-card p-5 rounded-2xl border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck2 className="h-5 w-5 text-sky-600" />
                Attendance & Progress Reports
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Log your daily workplace tasks and upload weekly progress reports for faculty mentor review.
              </p>
            </div>

            <div className="flex p-1 bg-sky-100/70 rounded-xl border border-sky-200 text-xs font-bold">
              <button
                onClick={() => setAttendanceSubTab('attendance')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  attendanceSubTab === 'attendance' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Daily Attendance ({myAttendance.length})
              </button>
              <button
                onClick={() => setAttendanceSubTab('reports')}
                className={`px-4 py-1.5 rounded-lg transition-all ${
                  attendanceSubTab === 'reports' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow' : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                Weekly Reports ({myReports.length})
              </button>
            </div>
          </div>

          {/* SUBTAB 1: DAILY ATTENDANCE */}
          {attendanceSubTab === 'attendance' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Add Attendance Form */}
              <div className="glass-panel p-6 rounded-2xl border border-sky-200 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-sky-100 pb-3">
                  <Clock className="h-5 w-5 text-sky-600" />
                  Fill Daily Attendance Log
                </h3>

                <form onSubmit={handleAttendanceSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Log Date</label>
                    <input
                      type="date"
                      value={newAttendance.date}
                      onChange={(e) => setNewAttendance({ ...newAttendance, date: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Attendance Status</label>
                    <select
                      value={newAttendance.status}
                      onChange={(e) => setNewAttendance({ ...newAttendance, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input font-bold text-sky-900"
                    >
                      <option value="PRESENT" className="bg-white text-emerald-700">PRESENT</option>
                      <option value="ABSENT" className="bg-white text-rose-700">ABSENT</option>
                      <option value="LEAVE" className="bg-white text-amber-700">LEAVE / PERMIT</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Tasks Completed Today</label>
                    <textarea
                      rows={3}
                      value={newAttendance.tasks_completed}
                      onChange={(e) => setNewAttendance({ ...newAttendance, tasks_completed: e.target.value })}
                      placeholder="Summary of code modules, API endpoints built, unit tests written..."
                      className="w-full p-2.5 rounded-xl glass-input"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Save Attendance to Database</span>
                  </button>
                </form>
              </div>

              {/* Attendance Table */}
              <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-sky-200 space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-sky-100 pb-3 flex items-center justify-between">
                  <span>My Attendance History</span>
                  <span className="text-xs text-slate-500 font-mono">Total Logs: {myAttendance.length}</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-sky-50 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3 rounded-l-lg">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 rounded-r-lg">Tasks Completed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100">
                      {myAttendance.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-6 text-center text-slate-400">No attendance entries recorded yet.</td>
                        </tr>
                      ) : (
                        myAttendance.map((log) => (
                          <tr key={log.attendance_id} className="hover:bg-sky-50/60">
                            <td className="p-3 font-mono font-bold text-slate-900">{log.date}</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                log.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-700">{log.tasks_completed}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* SUBTAB 2: WEEKLY REPORTS */}
          {attendanceSubTab === 'reports' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Upload Report Form */}
              <div className="glass-panel p-6 rounded-2xl border border-sky-200 space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-sky-100 pb-3">
                  <FileText className="h-5 w-5 text-sky-600" />
                  Submit Weekly Progress Report
                </h3>

                <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Report Week #</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={newReport.report_week}
                      onChange={(e) => setNewReport({ ...newReport, report_week: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 rounded-xl glass-input font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Weekly Summary & Milestones</label>
                    <textarea
                      rows={4}
                      value={newReport.summary}
                      onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                      placeholder="Detailed breakdown of weekly achievements, learning outcomes, and technical challenges resolved..."
                      className="w-full p-2.5 rounded-xl glass-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Report Document PDF URL</label>
                    <input
                      type="url"
                      value={newReport.report_file_url}
                      onChange={(e) => setNewReport({ ...newReport, report_file_url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input font-mono text-[11px]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 flex items-center justify-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Upload Report to Database</span>
                  </button>
                </form>
              </div>

              {/* Reports List */}
              <div className="lg:col-span-2 space-y-4">
                {myReports.length === 0 ? (
                  <div className="glass-panel p-6 rounded-2xl border border-sky-200 text-center text-xs text-slate-400">
                    No weekly progress reports submitted yet.
                  </div>
                ) : (
                  myReports.map((report) => (
                    <div key={report.report_id} className="glass-panel p-5 rounded-2xl border border-sky-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">
                            WEEK #{report.report_week}
                          </span>
                          <span className="text-xs text-slate-500">Submitted: {report.submitted_date}</span>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          report.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          report.status === 'NEEDS_REVISION' ? 'bg-rose-100 text-rose-800 border border-rose-300' :
                          'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {report.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">{report.summary}</p>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-sky-100">
                        <a
                          href={report.report_file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-700 hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>View Attached Report PDF</span>
                        </a>

                        <span className="text-[10px] text-slate-400 font-mono">ID: #{report.report_id}</span>
                      </div>

                      <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-slate-700 flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-600">Faculty/Mentor Feedback: </span>
                          <span>{report.company_feedback}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
