import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Briefcase, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Globe, 
  Mail, 
  ExternalLink
} from 'lucide-react';

export default function Step3CompanyPortal({ 
  companies, 
  internships, 
  setInternships, 
  applications, 
  activeRole,
  onProceedToNext 
}) {
  const [selectedCompany, setSelectedCompany] = useState(companies[0] || {});
  const [showPostModal, setShowPostModal] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    requirements: '',
    stipend: 2000,
    location: 'Remote',
    duration_weeks: 12,
    deadline: '2026-11-15'
  });

  const companyInternships = internships.filter(i => i.company_id === selectedCompany.company_id);

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const createdJob = {
      internship_id: Date.now(),
      company_id: selectedCompany.company_id,
      company_name: selectedCompany.company_name,
      ...newJob,
      status: 'OPEN'
    };

    setInternships(prev => [createdJob, ...prev]);
    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setShowPostModal(false);
      setNewJob({
        title: '',
        description: '',
        requirements: '',
        stipend: 2000,
        location: 'Remote',
        duration_weeks: 12,
        deadline: '2026-11-15'
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-sky-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-300">
              Workflow Stage 3 of 8
            </span>
            <span className="text-xs text-sky-800/80 font-mono">SQL Tables: companies & internships</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-sky-600" />
            3) Company Portal & Internship Postings
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage company recruiter profile and post new project internship opportunities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/20 transition-all"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Post New Internship</span>
          </button>

          <button
            onClick={onProceedToNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white shadow-lg shadow-blue-500/25 transition-all"
          >
            <span>Proceed to Selection Pipeline (Stage 4)</span>
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Company Profile */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-sky-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-sky-100 pb-3">
              <Building2 className="h-5 w-5 text-sky-600" />
              Recruiter & Company Information
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-600">Select Active Company:</span>
                <select
                  value={selectedCompany.company_id}
                  onChange={(e) => {
                    const comp = companies.find(c => c.company_id === parseInt(e.target.value));
                    if (comp) setSelectedCompany(comp);
                  }}
                  className="w-full mt-1 px-3 py-2 rounded-xl glass-input text-xs font-semibold text-sky-800"
                >
                  {companies.map(c => (
                    <option key={c.company_id} value={c.company_id} className="bg-white text-slate-900">
                      {c.company_name} ({c.industry})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 bg-sky-50/80 rounded-xl border border-sky-200 space-y-2">
                <div className="font-extrabold text-sm text-slate-900">{selectedCompany.company_name}</div>
                <div className="text-slate-600 font-medium">{selectedCompany.industry}</div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Globe className="h-3.5 w-3.5 text-sky-600" />
                  <a href={selectedCompany.website} target="_blank" rel="noreferrer" className="hover:underline text-sky-700">
                    {selectedCompany.website}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="h-3.5 w-3.5 text-sky-600" />
                  <span>{selectedCompany.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="h-3.5 w-3.5 text-sky-600" />
                  <span>{selectedCompany.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Posted Internships */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-sky-200 space-y-4">
            <div className="flex items-center justify-between border-b border-sky-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-sky-600" />
                Active Job Postings ({companyInternships.length})
              </h3>
            </div>

            <div className="space-y-4">
              {companyInternships.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No active internships posted for this company yet.</p>
              ) : (
                companyInternships.map((job) => {
                  const applicantCount = applications.filter(a => a.internship_id === job.internship_id).length;

                  return (
                    <div key={job.internship_id} className="glass-card p-5 rounded-2xl border border-sky-200 hover:border-sky-400 transition-all space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs font-mono text-sky-700 font-bold">ID #{job.internship_id}</span>
                          <h4 className="text-base font-extrabold text-slate-900">{job.title}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300 flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          <span>{applicantCount} Applicants</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">{job.description}</p>

                      <div className="flex items-center justify-between pt-2 border-t border-sky-100 text-xs text-slate-500">
                        <span>Stipend: <strong className="text-sky-700">${job.stipend}/mo</strong></span>
                        <span>Location: <strong className="text-slate-800">{job.location}</strong></span>
                        <span>Deadline: <strong className="text-slate-800">{job.deadline}</strong></span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Post Internship Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-2xl border border-sky-300 shadow-2xl space-y-4 bg-white">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase">New Listing</span>
                <h3 className="text-lg font-bold text-slate-900">Post Internship Opening</h3>
              </div>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            {postSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-sky-600 mx-auto animate-bounce" />
                <h4 className="text-lg font-bold text-slate-900">Internship Posted Successfully!</h4>
                <p className="text-xs text-slate-600">Added to <code className="text-sky-700">internships</code> backend table.</p>
              </div>
            ) : (
              <form onSubmit={handlePostSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Internship Title</label>
                  <input
                    type="text"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    placeholder="e.g. AI & Data Analytics Intern"
                    className="w-full px-3 py-2 rounded-xl glass-input"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Monthly Stipend ($)</label>
                    <input
                      type="number"
                      value={newJob.stipend}
                      onChange={(e) => setNewJob({ ...newJob, stipend: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl glass-input font-bold text-sky-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Duration (Weeks)</label>
                    <input
                      type="number"
                      value={newJob.duration_weeks}
                      onChange={(e) => setNewJob({ ...newJob, duration_weeks: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl glass-input"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Location / Mode</label>
                    <input
                      type="text"
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      placeholder="Remote / City"
                      className="w-full px-3 py-2 rounded-xl glass-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Application Deadline</label>
                    <input
                      type="date"
                      value={newJob.deadline}
                      onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl glass-input"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Job Description</label>
                  <textarea
                    rows={2}
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    placeholder="Key responsibilities and project overview..."
                    className="w-full p-2.5 rounded-xl glass-input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 mb-1 font-semibold">Candidate Requirements / Skills</label>
                  <textarea
                    rows={2}
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                    placeholder="Python, React, Machine Learning, SQL..."
                    className="w-full p-2.5 rounded-xl glass-input"
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/30"
                  >
                    Publish Opening
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
