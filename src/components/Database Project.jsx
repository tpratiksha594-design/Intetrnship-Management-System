import React, { useState } from 'react';
import { Database, Table, Key, X, ArrowRight } from 'lucide-react';

export default function DatabaseSchemaModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const tables = [
        {
            name: 'users',
            description: 'System authentication & role table',
            columns: [
                { name: 'user_id', type: 'INT', key: 'PK AUTO_INCREMENT' },
                { name: 'username', type: 'VARCHAR(100)', key: 'UNIQUE' },
                { name: 'password', type: 'VARCHAR(255)', key: '' },
                { name: 'role', type: "ENUM('STUDENT','COMPANY','FACULTY','ADMIN')", key: '' },
                { name: 'created_at', type: 'TIMESTAMP', key: 'DEFAULT CURRENT_TIMESTAMP' }
            ]
        },
        {
            name: 'students',
            description: 'Workflow Stage 1: Student academic profiles',
            columns: [
                { name: 'student_id', type: 'INT', key: 'PK' },
                { name: 'user_id', type: 'INT', key: 'FK -> users.user_id' },
                { name: 'roll_no', type: 'VARCHAR(50)', key: 'NOT NULL' },
                { name: 'name', type: 'VARCHAR(100)', key: 'NOT NULL' },
                { name: 'email', type: 'VARCHAR(100)', key: 'NOT NULL' },
                { name: 'phone', type: 'VARCHAR(15)', key: '' },
                { name: 'department', type: 'VARCHAR(100)', key: '' },
                { name: 'semester', type: 'INT', key: '' },
                { name: 'cgpa', type: 'DECIMAL(3,2)', key: '' },
                { name: 'skills', type: 'TEXT', key: '' },
                { name: 'resume_url', type: 'VARCHAR(255)', key: '' }
            ]
        },
        {
            name: 'companies',
            description: 'Host industry partner profiles',
            columns: [
                { name: 'company_id', type: 'INT', key: 'PK' },
                { name: 'user_id', type: 'INT', key: 'FK -> users.user_id' },
                { name: 'company_name', type: 'VARCHAR(100)', key: 'NOT NULL' },
                { name: 'contact_person', type: 'VARCHAR(100)', key: '' },
                { name: 'email', type: 'VARCHAR(100)', key: '' },
                { name: 'phone', type: 'VARCHAR(15)', key: '' },
                { name: 'website', type: 'VARCHAR(255)', key: '' },
                { name: 'location', type: 'VARCHAR(100)', key: '' },
                { name: 'industry', type: 'VARCHAR(100)', key: '' }
            ]
        },
        {
            name: 'faculty',
            description: 'University faculty mentor directory',
            columns: [
                { name: 'faculty_id', type: 'INT', key: 'PK' },
                { name: 'user_id', type: 'INT', key: 'FK -> users.user_id' },
                { name: 'name', type: 'VARCHAR(100)', key: '' },
                { name: 'email', type: 'VARCHAR(100)', key: '' },
                { name: 'department', type: 'VARCHAR(100)', key: '' },
                { name: 'designation', type: 'VARCHAR(100)', key: '' }
            ]
        },
        {
            name: 'internships',
            description: 'Workflow Stage 3: Job postings by companies',
            columns: [
                { name: 'internship_id', type: 'INT', key: 'PK' },
                { name: 'company_id', type: 'INT', key: 'FK -> companies.company_id' },
                { name: 'title', type: 'VARCHAR(100)', key: 'NOT NULL' },
                { name: 'description', type: 'TEXT', key: '' },
                { name: 'requirements', type: 'TEXT', key: '' },
                { name: 'stipend', type: 'DECIMAL(10,2)', key: '' },
                { name: 'location', type: 'VARCHAR(100)', key: '' },
                { name: 'duration_weeks', type: 'INT', key: '' },
                { name: 'deadline', type: 'DATE', key: '' },
                { name: 'status', type: "ENUM('OPEN','CLOSED')", key: 'DEFAULT OPEN' }
            ]
        },
        {
            name: 'applications',
            description: 'Workflow Stage 2 & 4: Internship application submissions',
            columns: [
                { name: 'application_id', type: 'INT', key: 'PK' },
                { name: 'student_id', type: 'INT', key: 'FK -> students.student_id' },
                { name: 'internship_id', type: 'INT', key: 'FK -> internships.internship_id' },
                { name: 'applied_date', type: 'TIMESTAMP', key: '' },
                { name: 'status', type: "ENUM('APPLIED','UNDER_REVIEW','SELECTED','REJECTED')", key: 'DEFAULT APPLIED' },
                { name: 'cover_letter', type: 'TEXT', key: '' }
            ]
        },
        {
            name: 'internship_assignments',
            description: 'Workflow Stage 5: Active internship contracts',
            columns: [
                { name: 'assignment_id', type: 'INT', key: 'PK' },
                { name: 'application_id', type: 'INT', key: 'FK -> applications.application_id' },
                { name: 'faculty_id', type: 'INT', key: 'FK -> faculty.faculty_id' },
                { name: 'start_date', type: 'DATE', key: '' },
                { name: 'end_date', type: 'DATE', key: '' },
                { name: 'status', type: "ENUM('ONGOING','COMPLETED','TERMINATED')", key: '' }
            ]
        },
        {
            name: 'attendance',
            description: 'Workflow Stage 6A: Daily workplace attendance logs',
            columns: [
                { name: 'attendance_id', type: 'INT', key: 'PK' },
                { name: 'assignment_id', type: 'INT', key: 'FK -> internship_assignments.assignment_id' },
                { name: 'date', type: 'DATE', key: '' },
                { name: 'status', type: "ENUM('PRESENT','ABSENT','LEAVE')", key: '' },
                { name: 'tasks_completed', type: 'TEXT', key: '' }
            ]
        },
        {
            name: 'progress_reports',
            description: 'Workflow Stage 6B: Weekly progress deliverables',
            columns: [
                { name: 'report_id', type: 'INT', key: 'PK' },
                { name: 'assignment_id', type: 'INT', key: 'FK -> internship_assignments.assignment_id' },
                { name: 'report_week', type: 'INT', key: '' },
                { name: 'submitted_date', type: 'DATE', key: '' },
                { name: 'summary', type: 'TEXT', key: '' },
                { name: 'report_file_url', type: 'VARCHAR(255)', key: '' },
                { name: 'company_feedback', type: 'TEXT', key: '' },
                { name: 'status', type: "ENUM('SUBMITTED','APPROVED','NEEDS_REVISION')", key: '' }
            ]
        },
        {
            name: 'evaluations',
            description: 'Workflow Stage 7: Dual supervisor & faculty evaluation rubrics',
            columns: [
                { name: 'evaluation_id', type: 'INT', key: 'PK' },
                { name: 'assignment_id', type: 'INT', key: 'FK -> internship_assignments.assignment_id' },
                { name: 'evaluator_type', type: "ENUM('COMPANY','FACULTY')", key: '' },
                { name: 'technical_score', type: 'INT', key: '1-10' },
                { name: 'soft_skills_score', type: 'INT', key: '1-10' },
                { name: 'punctuality_score', type: 'INT', key: '1-10' },
                { name: 'overall_score', type: 'DECIMAL(4,2)', key: '' },
                { name: 'comments', type: 'TEXT', key: '' },
                { name: 'evaluated_at', type: 'TIMESTAMP', key: '' }
            ]
        },
        {
            name: 'certificates',
            description: 'Workflow Stage 8: Verified completion certificates',
            columns: [
                { name: 'certificate_id', type: 'INT', key: 'PK' },
                { name: 'assignment_id', type: 'INT', key: 'FK -> internship_assignments.assignment_id' },
                { name: 'certificate_code', type: 'VARCHAR(50)', key: 'UNIQUE' },
                { name: 'issued_date', type: 'DATE', key: '' },
                { name: 'grade', type: 'VARCHAR(5)', key: '' }
            ]
        }
    ];

    const [activeTable, setActiveTable] = useState(tables[0]);

    return (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="glass-panel max-w-5xl w-full rounded-3xl border border-sky-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] bg-white">
                
                {/* Modal Top Bar */}
                <div className="p-6 border-b border-sky-200 flex items-center justify-between bg-sky-50">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-sky-100 text-sky-700 border border-sky-300">
                            <Database className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-extrabold text-slate-900">MySQL Database Schema Inspector</h2>
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-300">
                                    SCHEMA: internship_management
                                </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                                Identical to the MySQL Workbench schema structure in your project backend.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl bg-sky-100 hover:bg-sky-200 text-slate-600 hover:text-slate-900 transition-all"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content Body */}
                <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
                    
                    {/* Tables List */}
                    <div className="p-4 border-r border-sky-200 overflow-y-auto space-y-1.5 bg-sky-50/50">
                        <div className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider px-2 mb-2">
                            Database Tables ({tables.length})
                        </div>
                        {tables.map((t) => (
                            <button
                                key={t.name}
                                onClick={() => setActiveTable(t)}
                                className={`w-full text-left p-3 rounded-xl text-xs font-mono font-bold flex items-center justify-between transition-all ${
                                    activeTable.name === t.name
                                        ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25'
                                        : 'text-slate-700 hover:bg-sky-100 hover:text-slate-900'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Table className="h-4 w-4 shrink-0 opacity-80" />
                                    <span>{t.name}</span>
                                </div>
                                <span className="text-[10px] opacity-70">({t.columns.length})</span>
                            </button>
                        ))}
                    </div>

                    {/* Table Details */}
                    <div className="md:col-span-2 p-6 overflow-y-auto space-y-4 bg-white">
                        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                            <div>
                                <h3 className="text-lg font-extrabold text-slate-900 font-mono flex items-center gap-2">
                                    <Table className="h-5 w-5 text-sky-600" />
                                    {activeTable.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">{activeTable.description}</p>
                            </div>
                            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-sky-100 text-sky-800 border border-sky-200">
                                TABLE {activeTable.name}
                            </span>
                        </div>

                        {/* Column Specs */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-sky-50 text-slate-600 font-bold uppercase text-[10px]">
                                    <tr>
                                        <th className="p-3 rounded-l-lg">Column Name</th>
                                        <th className="p-3">Data Type</th>
                                        <th className="p-3 rounded-r-lg">Attributes / Constraints</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sky-100 font-mono">
                                    {activeTable.columns.map((col) => (
                                        <tr key={col.name} className="hover:bg-sky-50/60">
                                            <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                                                {col.key.includes('PK') && <Key className="h-3.5 w-3.5 text-amber-500 shrink-0" />}
                                                {col.key.includes('FK') && <ArrowRight className="h-3.5 w-3.5 text-sky-600 shrink-0" />}
                                                <span>{col.name}</span>
                                            </td>
                                            <td className="p-3 text-sky-700">{col.type}</td>
                                            <td className="p-3">
                                                {col.key ? (
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                        col.key.includes('PK') ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                                                        col.key.includes('FK') ? 'bg-sky-100 text-sky-800 border border-sky-300' :
                                                        'bg-slate-100 text-slate-700'
                                                    }`}>
                                                        {col.key}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 rounded-xl bg-sky-950 text-sky-100 border border-sky-800 text-xs font-mono space-y-1">
                            <div className="font-bold text-sky-400">SQL Table Statement:</div>
                            <div className="text-[11px] overflow-x-auto">
                                CREATE TABLE {activeTable.name} (<br/>
                                {activeTable.columns.map((c, i) => (
                                    <span key={i} className="block pl-4">
                                        {c.name} {c.type} {c.key.includes('PK') ? 'PRIMARY KEY' : ''} {c.key.includes('NOT NULL') ? 'NOT NULL' : ''}{i < activeTable.columns.length - 1 ? ',' : ''}
                                    </span>
                                ))}
                                );
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
