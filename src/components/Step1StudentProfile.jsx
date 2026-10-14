import React, { useState } from 'react';
import { User, Mail, Phone, BookOpen, Award, FileText, CheckCircle2, Save, ExternalLink, Sparkles, GraduationCap } from 'lucide-react';

export default function Step1StudentProfile({ students, setStudents, activeRole, onProceedToNext }) {
  const [currentStudent, setCurrentStudent] = useState(students[0] || {});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleChange = (field, value) => {
    setCurrentStudent(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setStudents(prev => prev.map(s => s.student_id === currentStudent.student_id ? currentStudent : s));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-sky-200/90 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-300">
              Workflow Stage 1 of 8
            </span>
            <span className="text-xs text-sky-800/80 font-mono">SQL Table: students</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-sky-600" />
            1) Student Profile & Registration
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Manage academic credentials, Roll Number, CGPA, Skills, and Resume URL required for internship applications.
          </p>
        </div>

        <button
          onClick={onProceedToNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 transition-all hover:scale-[1.02]"
        >
          <span>Proceed to Applications (Stage 2)</span>
          <Sparkles className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Profile Form */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-sky-200 space-y-6">
          <div className="flex items-center justify-between border-b border-sky-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <User className="h-5 w-5 text-sky-600" />
              Student Profile Information
            </h3>
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full border border-sky-300 animate-pulse">
                <CheckCircle2 className="h-4 w-4 text-sky-600" />
                Saved to Database Schema!
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-sky-500" />
                  <input
                    type="text"
                    value={currentStudent.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number / Student ID</label>
                <input
                  type="text"
                  value={currentStudent.roll_no || ''}
                  onChange={(e) => handleChange('roll_no', e.target.value)}
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
                    value={currentStudent.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
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
                    value={currentStudent.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
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
                    value={currentStudent.department || ''}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                  <input
                    type="number"
                    value={currentStudent.semester || 7}
                    onChange={(e) => handleChange('semester', parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl glass-input text-sm"
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
                      value={currentStudent.cgpa || 3.8}
                      onChange={(e) => handleChange('cgpa', parseFloat(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm font-bold text-sky-700"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Technical Skills (Comma separated)</label>
              <textarea
                rows={2}
                value={currentStudent.skills || ''}
                onChange={(e) => handleChange('skills', e.target.value)}
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
                    value={currentStudent.resume_url || ''}
                    onChange={(e) => handleChange('resume_url', e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl glass-input text-sm"
                    placeholder="https://example.com/my-resume.pdf"
                  />
                </div>
                {currentStudent.resume_url && (
                  <a
                    href={currentStudent.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300 text-xs font-semibold"
                  >
                    <span>View Link</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md shadow-sky-500/30 transition-all"
              >
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        {/* Student Cards Summary / Student Selection List */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-sky-200">
            <h4 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center justify-between">
              <span>Registered Students ({students.length})</span>
              <span className="text-[10px] text-sky-700 font-semibold">Click to switch current</span>
            </h4>

            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {students.map((st) => (
                <button
                  key={st.student_id}
                  onClick={() => setCurrentStudent(st)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    currentStudent.student_id === st.student_id
                      ? 'bg-sky-100/90 border-sky-400 text-slate-900 ring-1 ring-sky-400/40 shadow-sm'
                      : 'bg-white/70 border-sky-100 text-slate-700 hover:border-sky-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{st.name}</span>
                    <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                      CGPA {st.cgpa}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>{st.roll_no}</span>
                    <span>{st.department}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {st.skills?.split(',').slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 font-mono border border-sky-200">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 rounded-xl border border-sky-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-900">Database Schema Mapping:</div>
            <div className="font-mono text-[11px] bg-sky-950 text-sky-100 p-2.5 rounded-lg border border-sky-800">
              CREATE TABLE students (<br/>
              &nbsp;&nbsp;student_id INT PRIMARY KEY,<br/>
              &nbsp;&nbsp;user_id INT UNIQUE,<br/>
              &nbsp;&nbsp;roll_no VARCHAR(50),<br/>
              &nbsp;&nbsp;name VARCHAR(100),<br/>
              &nbsp;&nbsp;cgpa DECIMAL(3,2),<br/>
              &nbsp;&nbsp;skills TEXT,<br/>
              &nbsp;&nbsp;resume_url VARCHAR(255)<br/>
              );
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
