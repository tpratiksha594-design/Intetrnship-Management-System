import React, { useState } from 'react';
import { 
  CalendarCheck2, 
  FileCheck, 
  Clock, 
  Plus, 
  FileText, 
  ExternalLink,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function Step6AttendanceProgress({ 
  attendance, 
  setAttendance, 
  progressReports, 
  setProgressReports, 
  assignments, 
  activeRole,
  onProceedToNext 
}) {
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedAssignment, setSelectedAssignment] = useState(assignments[0] || {});

  const [newAttendance, setNewAttendance] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    tasks_completed: ''
  });

  const [newReport, setNewReport] = useState({
    report_week: 4,
    summary: '',
    report_file_url: 'https://example.com/reports/weekly_report.pdf'
  });

  const [toastMessage, setToastMessage] = useState('');

  const activeAttendance = attendance.filter(a => a.assignment_id === selectedAssignment.assignment_id);
  const activeReports = progressReports.filter(r => r.assignment_id === selectedAssignment.assignment_id);

  const handleAttendanceSubmit = (e) => {
    e.preventDefault();
    if (!selectedAssignment.assignment_id) {
      alert('Please select an active internship assignment first.');
      return;
    }
    const entry = {
      attendance_id: Date.now(),
      assignment_id: selectedAssignment.assignment_id,
      ...newAttendance
    };
    setAttendance(prev => [entry, ...prev]);
    setNewAttendance({
      date: new Date().toISOString().split('T')[0],
      status: 'PRESENT',
      tasks_completed: ''
    });
    showToast('Daily attendance log submitted!');
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!selectedAssignment.assignment_id) {
      alert('Please select an active internship assignment first.');
      return;
    }
    const reportEntry = {
      report_id: Date.now(),
      assignment_id: selectedAssignment.assignment_id,
      submitted_date: new Date().toISOString().split('T')[0],
      ...newReport,
      company_feedback: 'Pending supervisor review',
      status: 'SUBMITTED'
    };
    setProgressReports(prev => [reportEntry, ...prev]);
    setNewReport({
      report_week: activeReports.length + 1,
      summary: '',
      report_file_url: 'https://example.com/reports/weekly_report.pdf'
    });
    showToast('Weekly progress report uploaded!');
  };

  const handleApproveReport = (reportId, newStatus, feedbackText) => {
    setProgressReports(prev => prev.map(r => r.report_id === reportId ? {
      ...r,
      status: newStatus,
      company_feedback: feedbackText || (newStatus === 'APPROVED' ? 'Report reviewed and approved.' : 'Please revise section 2.')
    } : r));
    showToast(`Report status updated to ${newStatus}`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-sky-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-300">
              Workflow Stage 6 of 8
            </span>
            <span className="text-xs text-sky-800/80 font-mono">SQL Tables: attendance & progress_reports</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
            <CalendarCheck2 className="h-6 w-6 text-sky-600" />
            6) Daily Attendance Log & Weekly Progress Reports
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Log daily workplace attendance tasks and submit weekly project reports for mentor approval.
          </p>
        </div>

        <button
          onClick={onProceedToNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 transition-all"
        >
          <span>Go to Evaluation Rubric (Stage 7)</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-sky-100 border border-sky-300 text-sky-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="h-4 w-4 text-sky-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Assignment Switcher */}
      <div className="glass-panel p-4 rounded-xl border border-sky-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 uppercase">Active Assignment:</span>
          {assignments.length > 0 ? (
            <select
              value={selectedAssignment.assignment_id}
              onChange={(e) => {
                const as = assignments.find(a => a.assignment_id === parseInt(e.target.value));
                if (as) setSelectedAssignment(as);
              }}
              className="px-3 py-1.5 rounded-lg glass-input text-xs font-bold text-sky-800"
            >
              {assignments.map(as => (
                <option key={as.assignment_id} value={as.assignment_id} className="bg-white text-slate-900">
                  {as.student_name} - {as.company_name} ({as.internship_title})
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs text-amber-700 font-semibold">No active assignment available. Create one in Stage 4.</span>
          )}
        </div>

        {/* Mode Tabs */}
        <div className="flex p-1 bg-sky-100/70 rounded-xl border border-sky-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'attendance' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Attendance Log ({activeAttendance.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-1.5 rounded-lg transition-all ${
              activeTab === 'reports' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weekly Progress Reports ({activeReports.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add Attendance Form */}
          <div className="glass-panel p-6 rounded-2xl border border-sky-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-sky-100 pb-3">
              <Clock className="h-5 w-5 text-sky-600" />
              Log Daily Attendance & Tasks
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
                  className="w-full px-3 py-2 rounded-xl glass-input font-bold text-sky-800"
                >
                  <option value="PRESENT" className="bg-white text-emerald-700">PRESENT</option>
                  <option value="ABSENT" className="bg-white text-rose-700">ABSENT</option>
                  <option value="LEAVE" className="bg-white text-amber-700">LEAVE / ON PERMIT</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Tasks Completed Today</label>
                <textarea
                  rows={3}
                  value={newAttendance.tasks_completed}
                  onChange={(e) => setNewAttendance({ ...newAttendance, tasks_completed: e.target.value })}
                  placeholder="Summary of code modules built, bug fixes, or documentation written..."
                  className="w-full p-2.5 rounded-xl glass-input"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" />
                <span>Submit Attendance Entry</span>
              </button>
            </form>
          </div>

          {/* Attendance History Table */}
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-sky-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-sky-100 pb-3 flex items-center justify-between">
              <span>Attendance History Log</span>
              <span className="text-xs text-slate-500 font-mono">Total Logs: {activeAttendance.length}</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-sky-50 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-lg">Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Tasks Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {activeAttendance.map((log) => (
                    <tr key={log.attendance_id} className="hover:bg-sky-50/60">
                      <td className="p-3 font-mono font-bold text-slate-900">{log.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-700">{log.tasks_completed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: WEEKLY REPORTS */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Submit Report Form */}
          <div className="glass-panel p-6 rounded-2xl border border-sky-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-sky-100 pb-3">
              <FileCheck className="h-5 w-5 text-sky-600" />
              Submit Weekly Report
            </h3>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Report Week #</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={newReport.report_week}
                  onChange={(e) => setNewReport({ ...newReport, report_week: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl glass-input font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Weekly Summary & Achievements</label>
                <textarea
                  rows={4}
                  value={newReport.summary}
                  onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                  placeholder="Detailed breakdown of weekly learning milestones, project deliverables, and supervisor syncs..."
                  className="w-full p-2.5 rounded-xl glass-input"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-semibold">Report Document PDF Link</label>
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
                className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="h-4 w-4" />
                <span>Upload Report for Review</span>
              </button>
            </form>
          </div>

          {/* Progress Reports Review */}
          <div className="lg:col-span-2 space-y-4">
            {activeReports.map((report) => (
              <div key={report.report_id} className="glass-panel p-5 rounded-2xl border border-sky-200 space-y-3">
                <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">
                      WEEK #{report.report_week}
                    </span>
                    <span className="text-xs text-slate-500">Submitted: {report.submitted_date}</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    report.status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
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
                    <span>View Attached PDF</span>
                  </a>

                  {/* Supervisor Action Buttons */}
                  <div className="flex items-center gap-2">
                    {report.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleApproveReport(report.report_id, 'APPROVED')}
                        className="px-3 py-1 rounded-lg font-bold bg-sky-600 hover:bg-sky-700 text-white text-xs shadow"
                      >
                        Approve Report
                      </button>
                    )}
                  </div>
                </div>

                {/* Feedback Comment */}
                <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-xs text-slate-700 flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-600">Supervisor Feedback: </span>
                    <span>{report.company_feedback}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}
