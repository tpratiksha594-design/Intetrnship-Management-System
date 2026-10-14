import React, { useState } from 'react';
import { 
  Award, 
  Sliders, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  FileCheck2
} from 'lucide-react';

export default function Step7EvaluationSystem({ 
  evaluations, 
  setEvaluations, 
  assignments, 
  certificates, 
  setCertificates, 
  activeRole,
  onProceedToNext 
}) {
  const [selectedAssignment, setSelectedAssignment] = useState(assignments[0] || {});

  const [evaluatorType, setEvaluatorType] = useState('COMPANY');
  const [technicalScore, setTechnicalScore] = useState(9);
  const [softSkillsScore, setSoftSkillsScore] = useState(9);
  const [punctualityScore, setPunctualityScore] = useState(10);
  const [comments, setComments] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const overallScore = parseFloat(((technicalScore * 0.4) + (softSkillsScore * 0.3) + (punctualityScore * 0.3)).toFixed(1));

  const getLetterGrade = (score) => {
    if (score >= 9.0) return 'A+';
    if (score >= 8.0) return 'A';
    if (score >= 7.0) return 'B+';
    if (score >= 6.0) return 'B';
    return 'C';
  };

  const handleEvaluationSubmit = (e) => {
    e.preventDefault();
    if (!selectedAssignment.assignment_id) {
      alert('Please select an active internship assignment first.');
      return;
    }

    const newEval = {
      evaluation_id: Date.now(),
      assignment_id: selectedAssignment.assignment_id,
      evaluator_type: evaluatorType,
      evaluator_name: evaluatorType === 'COMPANY' ? `${selectedAssignment.company_name} Supervisor` : `${selectedAssignment.faculty_name}`,
      technical_score: technicalScore,
      soft_skills_score: softSkillsScore,
      punctuality_score: punctualityScore,
      overall_score: overallScore,
      comments: comments || 'Student performed exceptionally well during the internship term.',
      evaluated_at: new Date().toISOString().split('T')[0]
    };

    setEvaluations(prev => [newEval, ...prev]);

    const existingCert = certificates.find(c => c.assignment_id === selectedAssignment.assignment_id);
    if (!existingCert) {
      const grade = getLetterGrade(overallScore);
      const newCert = {
        certificate_id: Date.now(),
        assignment_id: selectedAssignment.assignment_id,
        student_name: selectedAssignment.student_name,
        company_name: selectedAssignment.company_name,
        internship_title: selectedAssignment.internship_title,
        certificate_code: `CERT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        issued_date: new Date().toISOString().split('T')[0],
        grade: grade,
        verification_hash: `0x${Math.random().toString(16).substring(2, 12)}`,
        status: 'ISSUED'
      };

      setCertificates(prev => [newCert, ...prev]);
      showToast(`Evaluation recorded! Certificate #${newCert.certificate_code} automatically issued in 'certificates' table! 🎉`);
    } else {
      showToast('Evaluation submitted successfully!');
    }

    setComments('');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const activeEvals = evaluations.filter(e => e.assignment_id === selectedAssignment.assignment_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-sky-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-300">
              Workflow Stage 7 of 8
            </span>
            <span className="text-xs text-sky-800/80 font-mono">SQL Table: evaluations</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
            <Award className="h-6 w-6 text-sky-600" />
            7) Supervisor & Faculty Evaluation System
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Grade intern performance on technical skills, soft skills, and discipline with rubric scoring.
          </p>
        </div>

        <button
          onClick={onProceedToNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 transition-all"
        >
          <span>Issue Certificate (Stage 8)</span>
          <FileCheck2 className="h-4 w-4" />
        </button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-sky-100 border border-sky-300 text-sky-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="h-4 w-4 text-sky-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Assignment Selector */}
      <div className="glass-panel p-4 rounded-xl border border-sky-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-600 uppercase">Evaluating Student:</span>
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
            <span className="text-xs text-amber-700 font-semibold">No active assignment found.</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rubric Form */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-sky-200 space-y-6">
          <div className="flex items-center justify-between border-b border-sky-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="h-5 w-5 text-sky-600" />
              Evaluation Rubric Input
            </h3>

            {/* Evaluator Switcher */}
            <div className="flex p-1 bg-sky-100/70 rounded-xl border border-sky-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEvaluatorType('COMPANY')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  evaluatorType === 'COMPANY' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Company Supervisor
              </button>
              <button
                type="button"
                onClick={() => setEvaluatorType('FACULTY')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  evaluatorType === 'FACULTY' ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Faculty Advisor
              </button>
            </div>
          </div>

          <form onSubmit={handleEvaluationSubmit} className="space-y-6">
            
            {/* Live Grade Preview Pill */}
            <div className="p-4 rounded-xl glass-card border border-sky-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Calculated Overall Score</span>
                <div className="text-3xl font-black text-slate-900 flex items-baseline gap-2 mt-1">
                  <span>{overallScore}</span>
                  <span className="text-sm font-normal text-slate-500">/ 10.0</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 uppercase">Predicted Grade</span>
                <div className="text-3xl font-extrabold text-sky-700 mt-1">
                  {getLetterGrade(overallScore)}
                </div>
              </div>
            </div>

            {/* Technical Score Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Technical Skills & Code Quality (40%)</span>
                <span className="text-sky-700 font-black">{technicalScore} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={technicalScore}
                onChange={(e) => setTechnicalScore(parseInt(e.target.value))}
                className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            {/* Soft Skills Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Soft Skills & Communication (30%)</span>
                <span className="text-sky-700 font-black">{softSkillsScore} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={softSkillsScore}
                onChange={(e) => setSoftSkillsScore(parseInt(e.target.value))}
                className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            {/* Punctuality Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Punctuality & Discipline (30%)</span>
                <span className="text-sky-700 font-black">{punctualityScore} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={punctualityScore}
                onChange={(e) => setPunctualityScore(parseInt(e.target.value))}
                className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
            </div>

            {/* Comments Box */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Evaluator Detailed Feedback & Comments</label>
              <textarea
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Highlight key project deliverables achieved and areas of excellence..."
                className="w-full p-3 rounded-xl glass-input text-xs"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-extrabold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Submit Evaluation & Issue Certificate</span>
            </button>
          </form>
        </div>

        {/* Existing Submitted Evaluations */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-sky-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-sky-100 pb-3">
              <Star className="h-4 w-4 text-amber-500" />
              Submitted Evaluations ({activeEvals.length})
            </h3>

            {activeEvals.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No evaluations submitted for this student yet.</p>
            ) : (
              activeEvals.map((ev) => (
                <div key={ev.evaluation_id} className="p-4 rounded-xl glass-card border border-sky-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{ev.evaluator_type} EVALUATION</span>
                    <span className="font-black text-sky-700 text-sm">{ev.overall_score} / 10</span>
                  </div>
                  <div className="text-slate-500 font-mono text-[10px]">{ev.evaluator_name}</div>
                  <p className="text-slate-700 italic pt-1 border-t border-sky-100">"{ev.comments}"</p>
                  <div className="text-[10px] text-slate-500 text-right">Evaluated: {ev.evaluated_at}</div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
