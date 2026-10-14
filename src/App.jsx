
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StudentPortal from './components/StudentPortal';
import FacultyPortal from './components/FacultyPortal';
import DatabaseSchemaModal from './components/DatabaseSchemaModal';
import SqlLogViewer from './components/SqlLogViewer';
import { backendApi } from './services/apiService';

import {
  initialCompanies,
  initialFaculty,
  initialApplications,
  initialAssignments,
  initialAttendance,
  initialProgressReports,
  initialEvaluations,
  initialCertificates
} from './data/mockData';

export default function App() {
  const [activePortal, setActivePortal] = useState('STUDENT');
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  // Database-backed data
  const [students, setStudents] = useState([]);
  const [internships, setInternships] = useState([]);

  // Other data currently using the existing local/mock data
  const [companies] = useState(initialCompanies);
  const [faculty] = useState(initialFaculty);

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('db_applications');
      return saved ? JSON.parse(saved) : initialApplications;
    } catch {
      return initialApplications;
    }
  });

  const [assignments, setAssignments] = useState(() => {
    try {
      const saved = localStorage.getItem('db_assignments');
      return saved ? JSON.parse(saved) : initialAssignments;
    } catch {
      return initialAssignments;
    }
  });

  const [attendance, setAttendance] = useState(() => {
    try {
      const saved = localStorage.getItem('db_attendance');
      return saved ? JSON.parse(saved) : initialAttendance;
    } catch {
      return initialAttendance;
    }
  });

  const [progressReports, setProgressReports] = useState(() => {
    try {
      const saved = localStorage.getItem('db_progress_reports');
      return saved ? JSON.parse(saved) : initialProgressReports;
    } catch {
      return initialProgressReports;
    }
  });

  const [sqlLogs, setSqlLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('db_sql_logs');
      return saved ? JSON.parse(saved) : [
        {
          sql: 'SELECT * FROM students;',
          action: 'SELECT',
          table: 'students',
          timestamp: new Date().toLocaleTimeString()
        }
      ];
    } catch {
      return [];
    }
  });

  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState('');

  // Load students and internships from the backend API
  useEffect(() => {
    let cancelled = false;

    async function loadDatabaseData() {
      setLoading(true);
      setBackendError('');

      try {
        const [studentResponse, internshipResponse] = await Promise.all([
          backendApi.getStudents(),
          backendApi.getInternships()
        ]);

        // Support either a direct array or an API response containing data
        const studentData = Array.isArray(studentResponse)
          ? studentResponse
          : studentResponse?.data ?? [];

        const internshipData = Array.isArray(internshipResponse)
          ? internshipResponse
          : internshipResponse?.data ?? [];

        if (cancelled) return;

        setStudents(studentData);
        setInternships(internshipData);

        if (studentData.length > 0) {
          setCurrentStudentId(previousId => {
            const stillExists = studentData.some(
              student => String(student.student_id) === String(previousId)
            );

            return stillExists
              ? previousId
              : studentData[0].student_id;
          });
        } else {
          setCurrentStudentId(null);
        }

        console.log('Students loaded from MySQL:', studentData);
        console.log('Internships loaded from MySQL:', internshipData);
      } catch (error) {
        console.error('Failed to load MySQL data:', error);

        if (!cancelled) {
          setBackendError(
            'Could not load data from the backend. Check that the backend is running and the API endpoints are working.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDatabaseData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Persist the existing local data for sections not yet connected to MySQL
  useEffect(() => {
    localStorage.setItem(
      'db_applications',
      JSON.stringify(applications)
    );
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(
      'db_assignments',
      JSON.stringify(assignments)
    );
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem(
      'db_attendance',
      JSON.stringify(attendance)
    );
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(
      'db_progress_reports',
      JSON.stringify(progressReports)
    );
  }, [progressReports]);

  useEffect(() => {
    localStorage.setItem('db_sql_logs', JSON.stringify(sqlLogs));
  }, [sqlLogs]);

  // SQL logger
  const handleLogSql = (sqlStatement, actionType, tableName) => {
    const logEntry = {
      sql: sqlStatement,
      action: actionType,
      table: tableName,
      timestamp: new Date().toLocaleTimeString()
    };

    setSqlLogs(previousLogs => [
      logEntry,
      ...previousLogs.slice(0, 49)
    ]);
  };

  // Reset local demo data
  const handleResetData = () => {
    const confirmed = window.confirm(
      'Reset the local demo data? This will not delete records from MySQL.'
    );

    if (!confirmed) return;

    setApplications(initialApplications);
    setAssignments(initialAssignments);
    setAttendance(initialAttendance);
    setProgressReports(initialProgressReports);

    setSqlLogs([
      {
        sql: '-- Local demo data reset. MySQL records were not deleted.',
        action: 'SYSTEM',
        table: 'local_data',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    localStorage.removeItem('db_applications');
    localStorage.removeItem('db_assignments');
    localStorage.removeItem('db_attendance');
    localStorage.removeItem('db_progress_reports');
    localStorage.removeItem('db_sql_logs');

    alert('Local demo data has been reset. MySQL data was not changed.');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white pb-20">

      <Navbar
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        onOpenSchemaModal={() => setIsSchemaModalOpen(true)}
        onResetData={handleResetData}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {loading && (
          <div className="mb-4 rounded-lg border border-sky-500/30 bg-sky-500/10 p-4 text-sky-200">
            Loading students and internships from MySQL...
          </div>
        )}

        {!loading && backendError && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {backendError}
            <button
              type="button"
              className="ml-3 underline"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !backendError && students.length === 0 && (
          <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
            The backend connected, but no student records were returned.
            Check the students table in MySQL Workbench.
          </div>
        )}

        {activePortal === 'STUDENT' ? (
          <StudentPortal
            students={students}
            setStudents={setStudents}
            currentStudentId={currentStudentId}
            setCurrentStudentId={setCurrentStudentId}
            internships={internships}
            applications={applications}
            setApplications={setApplications}
            assignments={assignments}
            attendance={attendance}
            setAttendance={setAttendance}
            progressReports={progressReports}
            setProgressReports={setProgressReports}
            onLogSql={handleLogSql}
          />
        ) : (
          <FacultyPortal
            students={students}
            setStudents={setStudents}
            faculty={faculty}
            applications={applications}
            setApplications={setApplications}
            assignments={assignments}
            attendance={attendance}
            progressReports={progressReports}
            setProgressReports={setProgressReports}
            onLogSql={handleLogSql}
          />
        )}

      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">
              InternFlow Database Management Platform
            </span>
            <span>• Built for Student & Faculty Workflows</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Schema: internship_management</span>
            <span>MySQL Workbench Compatible</span>
          </div>
        </div>
      </footer>

      <DatabaseSchemaModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
      />

      <SqlLogViewer
        sqlLogs={sqlLogs}
        onClearLogs={() => setSqlLogs([])}
      />

    </div>
  );
}
