import React from 'react';
import { 
  Briefcase, 
  UserCheck, 
  Calendar, 
  Building2, 
  GraduationCap, 
  Clock, 
  ExternalLink,
  Award
} from 'lucide-react';

export default function Step5ActiveInternships({ 
  assignments, 
  faculty, 
  onProceedToNext,
  setActiveStep 
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-sky-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-300">
              Workflow Stage 5 of 8
            </span>
            <span className="text-xs text-sky-800/80 font-mono">SQL Table: internship_assignments</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-sky-600" />
            5) Active Internship Tracking & Mentorship
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Monitor active internship contracts, faculty advisor assignments, start/end dates, and project milestones.
          </p>
        </div>

        <button
          onClick={onProceedToNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 transition-all"
        >
          <span>Attendance & Progress Reports (Stage 6)</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      {/* Main List */}
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <div className="glass-panel p-10 rounded-2xl text-center border border-sky-200 text-slate-500 space-y-2">
            <Briefcase className="h-10 w-10 mx-auto text-sky-400" />
            <h3 className="text-base font-bold text-slate-800">No active internship assignments yet.</h3>
            <p className="text-xs">Go to Stage 4 (Selection) and select a candidate to generate an active internship contract.</p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.assignment_id} className="glass-panel p-6 rounded-2xl border border-sky-200 space-y-6">
              
              {/* Top Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sky-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 uppercase">
                      STATUS: {assignment.status}
                    </span>
                    <span className="text-xs font-mono text-slate-500">Assignment ID #{assignment.assignment_id}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-1">{assignment.internship_title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <Building2 className="h-3.5 w-3.5 text-sky-600" />
                    <span className="font-bold text-slate-800">{assignment.company_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveStep(6)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 transition-all"
                  >
                    <Clock className="h-3.5 w-3.5 text-sky-600" />
                    <span>Log Attendance & Reports</span>
                  </button>
                  <button
                    onClick={() => setActiveStep(7)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md shadow-sky-500/30 transition-all"
                  >
                    <Award className="h-3.5 w-3.5" />
                    <span>Evaluate</span>
                  </button>
                </div>
              </div>

              {/* Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* Student Info */}
                <div className="p-4 rounded-xl glass-card border border-sky-200 space-y-2">
                  <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    Intern Student
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">{assignment.student_name}</div>
                  <div className="text-slate-500">Student ID #{assignment.student_id}</div>
                </div>

                {/* Faculty Mentor */}
                <div className="p-4 rounded-xl glass-card border border-sky-200 space-y-2">
                  <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1">
                    <UserCheck className="h-3.5 w-3.5" />
                    Assigned Faculty Mentor
                  </div>
                  <div className="font-extrabold text-sm text-slate-900">{assignment.faculty_name}</div>
                  <div className="text-slate-500">Computer Science Dept</div>
                </div>

                {/* Dates & Timeline */}
                <div className="p-4 rounded-xl glass-card border border-sky-200 space-y-2">
                  <div className="text-[10px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Internship Timeline
                  </div>
                  <div className="flex items-center justify-between text-slate-700 font-semibold">
                    <span>Start: {assignment.start_date}</span>
                    <span>End: {assignment.end_date}</span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-sky-100 h-2 rounded-full overflow-hidden border border-sky-200">
                    <div className="bg-gradient-to-r from-sky-400 to-blue-600 h-full w-[45%] rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-[10px] text-slate-500 text-right">Progress: 45% Complete (Week 4 of 12)</div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
