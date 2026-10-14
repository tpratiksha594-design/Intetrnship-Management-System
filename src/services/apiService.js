// API abstraction layer supporting both Local Stateful Mock mode and Backend API mode

const USE_REAL_BACKEND = true; // Toggle to true when backend API is running on localhost:5000
const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Generic Fetch wrapper with fallback
  async request(endpoint, method = 'GET', body = null) {
    if (!USE_REAL_BACKEND) {
      throw new Error('Using local state management');
    }
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
if (body !== null) options.body = JSON.stringify(body);    const res = await fetch(`${API_BASE}${endpoint}`, options);
    if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
    return await res.json();
  }
};

// SQL Schema Reference mapping for UI components

export const backendApi = {
  getStudents: () => api.request("/students"),
  getInternships: () => api.request("/internships"),
  getApplications: () => api.request("/applications"),
  getCompanies: () => api.request("/companies"),
  getAttendance: () => api.request("/attendance"),
  getCertificates: () => api.request("/certificates"),
  getProgressReports: () => api.request("/progress-reports")
};


