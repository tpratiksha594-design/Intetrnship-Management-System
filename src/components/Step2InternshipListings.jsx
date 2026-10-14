import React, { useState } from 'react';
import { 
  FileSearch, 
  MapPin, 
  Clock, 
  Building2, 
  Send, 
  CheckCircle2, 
  Search, 
  FileText,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export default function Step2InternshipListings({ 
  internships, 
  applications, 
  setApplications, 
  students, 
  activeRole,
  onProceedToNext 
}) {
  const [selectedStudent, setSelectedStudent] = useState(students[0] || {});
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);

  const filteredInternships = internships.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.requirements.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === 'ALL' || item.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSearch && matchesLocation && item.status === 'OPEN';
  });

  const myApplications = applications.filter(app => app.student_id === selectedStudent.student_id);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!selectedInternship) return;

    const existing = applications.find(
      app => app.student_id === selectedStudent.student_id && app.internship_id === selectedInternship.internship_id
    );

    if (existing) {
      alert('You have already submitted an application for this internship!');
      return;
    }

    const newApp = {
      application_id: Date.now(),
      student_id: selectedStudent.student_id,
      student_name: selectedStudent.name,
      student_email: selectedStudent.email,
      student_cgpa: selectedStudent.cgpa,
      internship_id: selectedInternship.internship_id,
      internship_title: selectedInternship.title,
      company_name: selectedInternship.company_name,
      applied_date: new Date().toISOString().split('T')[0],
      status: 'APPLIED',
      cover_letter: coverLetter || 'I am excited to apply for this internship position.'
    };

    setApplications(prev => [newApp, ...prev]);
    setApplySuccess(true);
    setCoverLetter('');
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedInternship(null);
    }, 1500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SELECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">SELECTED 🎉</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">UNDER REVIEW ⏳</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">REJECTED ❌</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">APPLIED 📩</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-sky-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-300">
              Workflow Stage 2 of 8
            </span>
            <span className="text-xs text-sky-800/80 font-mono">SQL Table: applications</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
            <FileSearch className="h-6 w-6 text-sky-600" />
            2) Internship Application Directory
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Browse verified internship openings, view company job specifications, and submit applications.
          </p>
        </div>

        <button
          onClick={onProceedToNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
        >
          <span>Go to Company Portal (Stage 3)</span>
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>

      {/* Student Selector Switcher */}
      <div className="glass-panel p-4 rounded-xl border border-sky-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 uppercase">Applying as Student:</span>
          <select
            value={selectedStudent.student_id}
            onChange={(e) => {
              const st = students.find(s => s.student_id === parseInt(e.target.value));
              if (st) setSelectedStudent(st);
            }}
            className="px-3 py-1.5 rounded-lg glass-input text-sm font-semibold text-sky-800"
          >
            {students.map(s => (
              <option key={s.student_id} value={s.student_id} className="bg-white text-slate-900">
                {s.name} ({s.roll_no}) - CGPA {s.cgpa}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-slate-600">
          Total Applications Submitted: <span className="font-bold text-sky-700">{myApplications.length}</span>
        </div>
      </div>

      {/* Main Grid: Openings + Application Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Internship Search & Cards */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 glass-panel p-4 rounded-xl border border-sky-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-sky-500" />
              <input
                type="text"
                placeholder="Search by job title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="px-3 py-2 rounded-xl glass-input text-xs font-semibold text-slate-700"
              >
                <option value="ALL" className="bg-white">All Locations</option>
                <option value="Remote" className="bg-white">Remote</option>
                <option value="San Francisco" className="bg-white">San Francisco</option>
                <option value="New York" className="bg-white">New York</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredInternships.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl text-center border border-sky-200 text-slate-500">
                <AlertCircle className="h-8 w-8 mx-auto text-sky-400 mb-2" />
                <p>No open internships match your search filter.</p>
              </div>
            ) : (
              filteredInternships.map((job) => {
                const alreadyApplied = applications.some(
                  app => app.student_id === selectedStudent.student_id && app.internship_id === job.internship_id
                );

                return (
                  <div key={job.internship_id} className="glass-card p-6 rounded-2xl border border-sky-200 hover:border-sky-400 transition-all space-y-3 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-sky-600" />
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{job.company_name}</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 mt-1">{job.title}</h3>
                      </div>
                      <span className="text-lg font-black text-sky-600 flex items-center">
                        ${job.stipend.toLocaleString()}<span className="text-xs font-normal text-slate-500 ml-1">/mo</span>
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-sky-100">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-sky-600" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-amber-500" />
                        <span>{job.duration_weeks} Weeks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Deadline:</span>
                        <span className="font-semibold text-slate-800">{job.deadline}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="text-xs text-slate-500">
                        <span className="font-bold text-slate-800">Requires: </span>
                        <span className="text-slate-600">{job.requirements.slice(0, 60)}...</span>
                      </div>

                      <button
                        onClick={() => setSelectedInternship(job)}
                        disabled={alreadyApplied}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          alreadyApplied
                            ? 'bg-sky-100 text-sky-800 border border-sky-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md shadow-sky-500/30'
                        }`}
                      >
                        {alreadyApplied ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-sky-600" />
                            <span>Applied</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            <span>Apply Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Student Application Tracker Status */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-sky-200">
            <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-4 w-4 text-sky-600" />
              My Application Tracker ({myApplications.length})
            </h3>

            {myApplications.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                No applications submitted yet. Select an internship on the left and click "Apply Now".
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {myApplications.map((app) => (
                  <div key={app.application_id} className="p-3.5 rounded-xl glass-card border border-sky-200 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-sm text-slate-900">{app.internship_title}</div>
                        <div className="text-xs text-slate-500">{app.company_name}</div>
                      </div>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-sky-100">
                      <span>Applied: {app.applied_date}</span>
                      <span className="font-mono">ID #{app.application_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Apply Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-2xl border border-sky-300 shadow-2xl space-y-4 bg-white">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase">Submit Application</span>
                <h3 className="text-lg font-bold text-slate-900">{selectedInternship.title}</h3>
                <p className="text-xs text-slate-500">{selectedInternship.company_name}</p>
              </div>
              <button
                onClick={() => setSelectedInternship(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-sky-600 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-slate-900">Application Submitted!</h4>
                <p className="text-xs text-slate-600">Recorded into backend table <code className="text-sky-700">applications</code>.</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="bg-sky-50 p-3 rounded-xl border border-sky-200 text-xs space-y-1">
                  <div className="text-slate-700 font-bold">Applicant Details:</div>
                  <div className="text-slate-900">{selectedStudent.name} ({selectedStudent.roll_no})</div>
                  <div className="text-slate-600">Email: {selectedStudent.email} | CGPA: {selectedStudent.cgpa}</div>
                  <div className="text-sky-700 font-mono text-[11px] truncate">Resume: {selectedStudent.resume_url}</div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Letter / Statement of Purpose</label>
                  <textarea
                    rows={4}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Describe why you are a great fit for this position and highlight relevant projects..."
                    className="w-full p-3 rounded-xl glass-input text-xs"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInternship(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-xs bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/30"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Confirm & Submit</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
