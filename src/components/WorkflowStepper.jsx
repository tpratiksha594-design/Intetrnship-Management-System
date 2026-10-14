import React from 'react';
import { 
  UserCheck, 
  FileSearch, 
  Building, 
  UserCheck2, 
  Briefcase, 
  CalendarCheck2, 
  Award, 
  FileCheck2
} from 'lucide-react';

export const WORKFLOW_STEPS = [
  { id: 1, name: 'Student Profile', shortName: '1) Student', icon: UserCheck, table: 'students' },
  { id: 2, name: 'Internship Application', shortName: '2) Application', icon: FileSearch, table: 'applications' },
  { id: 3, name: 'Company Portal', shortName: '3) Company', icon: Building, table: 'companies & internships' },
  { id: 4, name: 'Selection Process', shortName: '4) Selection', icon: UserCheck2, table: 'applications' },
  { id: 5, name: 'Active Internship', shortName: '5) Internship', icon: Briefcase, table: 'internship_assignments' },
  { id: 6, name: 'Attendance & Progress', shortName: '6) Attendance/Progress', icon: CalendarCheck2, table: 'attendance & progress_reports' },
  { id: 7, name: 'Evaluation', shortName: '7) Evaluation', icon: Award, table: 'evaluations' },
  { id: 8, name: 'Certificate', shortName: '8) Certificate', icon: FileCheck2, table: 'certificates' }
];

export default function WorkflowStepper({ activeStep, setActiveStep, stepCounts }) {
  return (
    <div className="w-full bg-white/70 backdrop-blur-md border-b border-sky-200/80 py-3 px-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700">Project Workflow Pipeline</span>
            <span className="text-xs text-sky-600/80">• Click any step to jump to its module view</span>
          </div>
          <div className="text-xs font-semibold text-slate-700">
            Step <span className="text-sky-600 font-bold">{activeStep}</span> of 8
          </div>
        </div>

        {/* Workflow Steps Horizontal Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {WORKFLOW_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;
            const count = stepCounts?.[step.id] || 0;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`relative flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-sky-50 border-sky-400 shadow-md shadow-sky-500/15 scale-[1.02] ring-1 ring-sky-400/50'
                    : isCompleted
                    ? 'bg-sky-50/60 border-sky-200 hover:border-sky-300 text-sky-900'
                    : 'bg-white/60 border-sky-100 hover:border-sky-200 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div className={`p-1.5 rounded-lg ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm'
                      : isCompleted
                      ? 'bg-sky-100 text-sky-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive 
                      ? 'bg-sky-200/80 text-sky-900 font-extrabold' 
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    #{step.id}
                  </span>
                </div>

                <div className="font-bold text-xs truncate w-full text-slate-900">
                  {step.name}
                </div>
                
                <div className="flex items-center justify-between w-full mt-1 text-[10px] text-slate-500">
                  <span className="truncate text-slate-500 font-mono text-[9px]">{step.table}</span>
                  {count > 0 && (
                    <span className="font-bold text-sky-700 bg-sky-100 px-1.5 rounded border border-sky-200">
                      {count}
                    </span>
                  )}
                </div>

                {/* Progress highlight underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-sky-500 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
