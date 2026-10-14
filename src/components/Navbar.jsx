import React from 'react';
import { 
  Shield, 
  Database, 
  GraduationCap, 
  User, 
  Briefcase, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  activePortal, 
  setActivePortal, 
  onOpenSchemaModal,
  onResetData
}) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-sky-200/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-400 via-sky-500 to-blue-600 p-0.5 shadow-lg shadow-sky-500/25 flex items-center justify-center">
              <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-sky-600" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-sky-700 via-blue-800 to-sky-950 bg-clip-text text-transparent">
                  InternFlow
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                  Database Edition
                </span>
              </div>
              <p className="text-xs text-sky-800/80 font-medium">Internship Management System</p>
            </div>
          </div>

          {/* Center Main Portal Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-sky-100/80 rounded-2xl border border-sky-200">
            <button
              onClick={() => setActivePortal('STUDENT')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activePortal === 'STUDENT'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30 scale-[1.02]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-sky-200/50'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>1. Student Portal</span>
            </button>

            <button
              onClick={() => setActivePortal('FACULTY')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                activePortal === 'FACULTY'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/30 scale-[1.02]'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-sky-200/50'
              }`}
            >
              <User className="h-4 w-4" />
              <span>2. Faculty Portal</span>
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSchemaModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-900 border border-sky-300 hover:border-sky-400 transition-all shadow-sm group"
            >
              <Database className="h-3.5 w-3.5 text-sky-600 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Inspect Database Schema</span>
              <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
            </button>

            <button
              onClick={onResetData}
              title="Reset sample data in database storage"
              className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 hover:text-sky-900 border border-sky-300 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
