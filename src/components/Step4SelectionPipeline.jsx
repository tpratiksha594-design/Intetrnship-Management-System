import React, { useState } from 'react';
import { 
  UserCheck2, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  ExternalLink, 
  ArrowRight,
  Filter,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export default function Step4SelectionPipeline({ 
  applications, 
  setApplications, 
  assignments, 
  setAssignments, 
  faculty,
  onProceedToNext 
}) {
  const [filterCompany, setFilterCompany] = useState('ALL');
  const [notification, setNotification] = useState('');

  const stages = [
    { key: 'APPLIED', title: '1. Applied / New', color: 'sky', border: 'border-sky-300', bg: 'bg-sky-50/70' },
    { key: 'UNDER_REVIEW', title: '2. Under Review', color: 'amber', border: 'border-amber-300', bg: 'bg-amber-50/70' },
    { key: 'SELECTED', title: '3. Selected / Hired', color: 'emerald', border: 'border-emerald-300', bg: 'bg-emerald-50/70' },
    { key: 'REJECTED', title: '4. Not Selected', color: 'rose', border: 'border-rose-300', bg: 'bg-rose-50/70' }
  ];

  const filteredApps = filterCompany === 'ALL'
    ? applications
    : applications.filter(a => a.company_name === filterCompany);

  const handleUpdateStatus = (appId, newStatus) => {
    const targetApp = applications.find(a => a.application_id === appId);
    if (!targetApp) return;

    setApplications(prev => prev.map(a => a.application_id === appId ? { ...a, status: newStatus } : a));

    if (newStatus === 'SELECTED') {
      const existingAssign = assignments.find(as => as.application_id === appId);
      if (!existingAssign) {
        const assignedFaculty = faculty[0] || { faculty_id: 301, name: 'Dr. Sarah Jenkins' };
        const newAssignment = {
          assignment_id: Date.now(),
          application_id: appId,
          student_id: targetApp.student_id,
          student_name: targetApp.student_name,
          company_name: targetApp.company_name,
          internship_title: targetApp.internship_title,
          faculty_id: assignedFaculty.faculty_id,
          faculty_name: assignedFaculty.name,
          company_supervisor: `${targetApp.company_name} Tech Lead`,
          start_date: new Date().toISOString().split('T')[0],
          end_date: '2026-12-01',
          status: 'ONGOING'
        };

        setAssignments(prev => [newAssignment, ...prev]);
        showNotify(`Selected! Created active assignment for ${targetApp.student_name} in 'internship_assignments' table.`);
      }
    } else {
      showNotify(`Updated status to ${newStatus}`);
    }
  };

  const showNotify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-sky-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-300">
              Workflow Stage 4 of 8
            </span>
            <span className="text-xs text-sky-800/80 font-mono">SQL Table: applications & internship_assignments</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
            <UserCheck2 className="h-6 w-6 text-sky-600" />
            4) Candidate Selection & Shortlisting Pipeline
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Review applicant profiles, move candidates across stages, and issue internship selection offers.
          </p>
        </div>

        <button
          onClick={onProceedToNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 transition-all"
        >
          <span>View Active Internships (Stage 5)</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-sky-100 border border-sky-300 text-sky-900 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <Sparkles className="h-4 w-4 text-sky-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filter bar */}
      <div className="glass-panel p-4 rounded-xl border border-sky-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-sky-600" />
          <span className="text-xs font-bold text-slate-700">Filter by Company:</span>
          <select
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="px-3 py-1.5 rounded-lg glass-input text-xs font-semibold text-sky-800"
          >
            <option value="ALL" className="bg-white">All Companies</option>
            <option value="TechCorp Solutions" className="bg-white">TechCorp Solutions</option>
            <option value="Innovate Labs Inc" className="bg-white">Innovate Labs Inc</option>
          </select>
        </div>
        <div className="text-xs text-slate-600">
          Total Candidates in Pipeline: <span className="font-bold text-slate-900">{filteredApps.length}</span>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stages.map((stage) => {
          const stageApps = filteredApps.filter(a => a.status === stage.key);

          return (
            <div key={stage.key} className={`glass-panel p-4 rounded-2xl border ${stage.border} ${stage.bg} flex flex-col min-h-[500px]`}>
              <div className="flex items-center justify-between border-b border-sky-200/80 pb-3 mb-3">
                <h3 className="text-sm font-extrabold text-slate-900">{stage.title}</h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                  {stageApps.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {stageApps.length === 0 ? (
                  <div className="text-xs text-slate-400 text-center py-10 italic">No candidates in this stage</div>
                ) : (
                  stageApps.map((app) => (
                    <div key={app.application_id} className="glass-card p-4 rounded-xl border border-sky-200 space-y-3 shadow-sm hover:border-sky-400 transition-all">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                            <GraduationCap className="h-4 w-4 text-sky-600" />
                            <span>{app.student_name}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">{app.student_email}</div>
                        </div>
                        <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                          CGPA {app.student_cgpa}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-sky-50 text-xs border border-sky-200">
                        <div className="font-bold text-sky-800 flex items-center gap-1">
                          <Briefcase className="h-3 w-3 text-sky-600" />
                          <span>{app.internship_title}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">{app.company_name}</div>
                      </div>

                      <div className="text-[11px] text-slate-600 line-clamp-2 italic bg-white p-2 rounded border border-sky-100">
                        "{app.cover_letter}"
                      </div>

                      {/* Action buttons per stage */}
                      <div className="flex items-center justify-between pt-2 border-t border-sky-100 text-xs">
                        {stage.key === 'APPLIED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.application_id, 'UNDER_REVIEW')}
                            className="w-full py-1.5 rounded-lg font-semibold bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 transition-all flex items-center justify-center gap-1"
                          >
                            <span>Move to Under Review</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {stage.key === 'UNDER_REVIEW' && (
                          <div className="grid grid-cols-2 gap-1.5 w-full">
                            <button
                              onClick={() => handleUpdateStatus(app.application_id, 'SELECTED')}
                              className="py-1.5 rounded-lg font-bold bg-sky-600 hover:bg-sky-700 text-white shadow transition-all flex items-center justify-center gap-1"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Select</span>
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.application_id, 'REJECTED')}
                              className="py-1.5 rounded-lg font-semibold bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 transition-all flex items-center justify-center gap-1"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}

                        {stage.key === 'SELECTED' && (
                          <div className="w-full text-[11px] font-semibold text-emerald-800 text-center flex items-center justify-center gap-1 bg-emerald-100 py-1 rounded border border-emerald-300">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Internship Offer Issued</span>
                          </div>
                        )}

                        {stage.key === 'REJECTED' && (
                          <button
                            onClick={() => handleUpdateStatus(app.application_id, 'UNDER_REVIEW')}
                            className="w-full py-1 rounded text-[10px] text-slate-500 hover:text-slate-900"
                          >
                            Re-open Review
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
