import React, { useState } from 'react';
import { 
  FileCheck2, 
  Printer, 
  Search, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  QrCode
} from 'lucide-react';

export default function Step8CertificatePortal({ 
  certificates, 
  setCertificates, 
  assignments, 
  activeRole 
}) {
  const [selectedCert, setSelectedCert] = useState(certificates[0] || null);
  const [searchCode, setSearchCode] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handlePrint = () => {
    window.print();
  };

  const handleVerifySearch = (e) => {
    e.preventDefault();
    const found = certificates.find(
      c => c.certificate_code.toLowerCase() === searchCode.trim().toLowerCase()
    );
    setSearchResult(found || 'NOT_FOUND');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-sky-200 shadow-sm no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-300">
              Workflow Stage 8 of 8
            </span>
            <span className="text-xs text-sky-800/80 font-mono">SQL Table: certificates</span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-2 flex items-center gap-2">
            <FileCheck2 className="h-6 w-6 text-sky-600" />
            8) Certificate Generation & Digital Verification
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Generate verifiable certificates of completion with encrypted digital verification token & print support.
          </p>
        </div>

        {selectedCert && (
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25 transition-all"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save Certificate PDF</span>
          </button>
        )}
      </div>

      {/* Main Grid: Selector + Verification Search + Printable Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 no-print">
        
        {/* Left Column: Cert List + Public Verifier Tool */}
        <div className="space-y-4">
          
          {/* Certificate Selector */}
          <div className="glass-panel p-5 rounded-2xl border border-sky-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Issued Certificates ({certificates.length})</span>
            </h3>

            {certificates.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No certificates issued yet. Complete stage 7 evaluation to auto-generate a certificate.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {certificates.map((cert) => (
                  <button
                    key={cert.certificate_id}
                    onClick={() => setSelectedCert(cert)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedCert?.certificate_id === cert.certificate_id
                        ? 'bg-sky-100/90 border-sky-400 text-slate-900 ring-1 ring-sky-400/40 shadow-sm'
                        : 'bg-white/70 border-sky-100 text-slate-700 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{cert.student_name}</span>
                      <span className="text-xs font-black text-sky-800 bg-sky-100 px-2 py-0.5 rounded border border-sky-300">
                        {cert.grade}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex justify-between font-mono">
                      <span>{cert.certificate_code}</span>
                      <span>{cert.issued_date}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Public Certificate Verification Tool */}
          <div className="glass-panel p-5 rounded-2xl border border-sky-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-sky-600" />
              Certificate Verifier
            </h3>

            <form onSubmit={handleVerifySearch} className="space-y-2 text-xs">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-sky-500" />
                <input
                  type="text"
                  placeholder="Enter Certificate Code (e.g. CERT-2026-8942)..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl glass-input font-mono text-xs"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl font-bold bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 transition-all"
              >
                Verify Code Authenticity
              </button>
            </form>

            {searchResult && (
              <div className="pt-2">
                {searchResult === 'NOT_FOUND' ? (
                  <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-rose-800 text-xs font-semibold">
                    ❌ Invalid or unverified certificate code.
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-sky-100 border border-sky-300 text-sky-900 text-xs space-y-1">
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <CheckCircle2 className="h-4 w-4 text-sky-600" />
                      <span>OFFICIALLY VERIFIED CERTIFICATE</span>
                    </div>
                    <div>Student: <strong>{searchResult.student_name}</strong></div>
                    <div>Host: <strong>{searchResult.company_name}</strong></div>
                    <div>Grade: <strong>{searchResult.grade}</strong> | Issued: <strong>{searchResult.issued_date}</strong></div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right 2 Columns: Official Printable Certificate View */}
        <div className="lg:col-span-2">
          {selectedCert ? (
            <div id="printable-certificate" className="bg-gradient-to-b from-[#e0f2fe] via-white to-[#f0f7ff] text-slate-900 p-8 sm:p-12 rounded-3xl border-4 border-sky-400 shadow-xl relative overflow-hidden space-y-8">
              
              {/* Background watermark icon */}
              <Award className="absolute -right-16 -bottom-16 w-96 h-96 text-sky-500/10 pointer-events-none" />

              {/* Certificate Header */}
              <div className="text-center space-y-2 border-b border-sky-200 pb-6">
                <div className="flex justify-center mb-2">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 p-1 shadow-lg flex items-center justify-center">
                    <div className="h-full w-full bg-white rounded-full flex items-center justify-center">
                      <Award className="h-8 w-8 text-sky-600" />
                    </div>
                  </div>
                </div>

                <div className="text-xs uppercase font-extrabold tracking-[0.3em] text-sky-700">
                  University Project Internship Board
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-wide">
                  Certificate of Internship Completion
                </h1>
                <p className="text-xs text-slate-500 italic">This document officially certifies successful project completion</p>
              </div>

              {/* Body Text */}
              <div className="text-center space-y-6 py-4">
                <p className="text-xs uppercase tracking-widest text-slate-500">This is to proudly present to</p>
                <div className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-800 to-sky-900 tracking-tight font-serif">
                  {selectedCert.student_name}
                </div>
                <p className="text-xs text-slate-700 max-w-xl mx-auto leading-relaxed">
                  for outstanding performance as <strong className="text-slate-900">{selectedCert.internship_title}</strong> at{' '}
                  <strong className="text-sky-700">{selectedCert.company_name}</strong>. The candidate has completed all required technical deliverables, weekly progress logs, and final evaluation with a final grade of{' '}
                  <strong className="text-sky-700 font-bold">{selectedCert.grade}</strong>.
                </p>
              </div>

              {/* Footer Signatures & QR Token */}
              <div className="grid grid-cols-3 gap-4 border-t border-sky-200 pt-8 items-end text-center text-xs">
                
                <div className="space-y-1">
                  <div className="font-serif italic text-base text-slate-800 border-b border-sky-300 pb-1">Dr. Sarah Jenkins</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Faculty Internship Coordinator</div>
                </div>

                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="p-2 bg-white rounded-xl shadow border border-sky-300">
                    <QrCode className="h-12 w-12 text-slate-900" />
                  </div>
                  <div className="font-mono text-[9px] text-sky-700 font-bold">{selectedCert.certificate_code}</div>
                  <div className="text-[8px] text-slate-400">Encrypted Token Verification</div>
                </div>

                <div className="space-y-1">
                  <div className="font-serif italic text-base text-slate-800 border-b border-sky-300 pb-1">Marcus Vance</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">Industry Partner Director</div>
                </div>

              </div>

              {/* Issue Date */}
              <div className="text-center text-[10px] text-slate-500 pt-2 font-mono">
                Date of Issuance: {selectedCert.issued_date} | Authenticity Hash: {selectedCert.verification_hash}
              </div>

            </div>
          ) : (
            <div className="glass-panel p-12 rounded-2xl text-center border border-sky-200 text-slate-500">
              Select a certificate from the left sidebar to preview and print.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
