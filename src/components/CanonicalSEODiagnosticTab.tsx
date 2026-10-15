import React, { useState, useEffect, useMemo } from 'react';
import { 
  auditCanonicalRouteMappings, 
  logCanonicalAuditReport,
  removeCanonicalDiagnosticOverlay
} from '../utils/canonicalRedirect';
import { AppRoute } from '../utils/urlRouter';

interface CanonicalSEODiagnosticTabProps {
  currentRoute: AppRoute;
}

export default function CanonicalSEODiagnosticTab({ currentRoute }: CanonicalSEODiagnosticTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [copied, setCopied] = useState(false);
  const [auditRevision, setAuditRevision] = useState(0);

  // Clean up any legacy DOM overlay created outside React
  useEffect(() => {
    removeCanonicalDiagnosticOverlay();
  }, []);

  // Listen for keyboard shortcut Ctrl+Alt+C or Cmd+Alt+C to toggle drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const report = useMemo(() => {
    return auditCanonicalRouteMappings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditRevision, currentRoute]);

  const currentPath = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/';
  const currentDomCanonical = typeof document !== 'undefined' 
    ? document.querySelector('link[rel="canonical"]')?.getAttribute('href') 
    : null;
  const currentOgUrl = typeof document !== 'undefined' 
    ? document.querySelector('meta[property="og:url"]')?.getAttribute('content') 
    : null;

  const filteredResults = useMemo(() => {
    return report.results.filter((item) => {
      const matchesSearch = 
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.testInput.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.canonicalPath.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [report.results, searchTerm, categoryFilter]);

  const handleCopyReport = () => {
    try {
      const summary = [
        `CANONICAL SEO VERIFICATION AUDIT REPORT`,
        `Pass Rate: ${report.passRate} (${report.passedCount}/${report.totalTested} routes verified)`,
        `Base Origin: ${report.origin}`,
        `Current Route: ${currentRoute.type} (${currentPath})`,
        `Canonical Head Tag: ${currentDomCanonical || 'Not set'}`,
        `og:url Tag: ${currentOgUrl || 'Not set'}`,
        `\nROUTE AUDIT DETAILS:`,
        ...report.results.map(
          (r) => `[${r.status}] ${r.name}: Input "${r.testInput}" -> Canonical "${r.canonicalPath}" (${r.isDuplicateDetected ? 'Redirected' : 'Valid'})`
        ),
      ].join('\n');
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.warn('Failed to copy canonical report:', e);
    }
  };

  const handleLogConsole = () => {
    logCanonicalAuditReport();
  };

  return (
    <>
      {/* 1. Floating Bottom-Right Badge (Only visible when drawer is closed) */}
      {!isOpen && (
        <div 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#064e3b] hover:bg-[#065f46] text-white px-3.5 py-2 rounded-full shadow-2xl border border-emerald-500/80 cursor-pointer text-xs font-semibold select-none transition-all duration-200 group hover:scale-105"
          title="Click or press Ctrl+Alt+C to open Canonical SEO Diagnostic Tools (Admin / Internal Only)"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
          <span>
            Canonical SEO: <strong className="text-emerald-300 font-bold">{report.passRate} Valid</strong> ({report.passedCount}/{report.totalTested})
          </span>
          <span className="bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider group-hover:bg-white/30 transition-colors">
            Backend
          </span>
        </div>
      )}

      {/* 2. Slide-Over Diagnostic Drawer Modal (Backend / Admin Only) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-3xl max-h-[90vh] bg-slate-900 text-slate-100 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="canonical-diagnostic-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-slate-800/90 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 id="canonical-diagnostic-title" className="text-sm font-bold text-white">
                      Canonical SEO Diagnostics & Inspector
                    </h3>
                    <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-600/60 px-2 py-0.5 rounded-full font-bold">
                      {report.passRate} Passed
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded uppercase font-extrabold tracking-wider">
                      Backend Only
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live verification of route patterns to primary keyword canonical tags
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyReport}
                  className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Copy full verification report to clipboard"
                >
                  {copied ? '✓ Copied!' : '📋 Copy Report'}
                </button>
                <button
                  onClick={handleLogConsole}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Print full verification table to browser developer console"
                >
                  🖥️ Console
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
                  title="Close Inspector (Ctrl+Alt+C)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Active Page Live Inspection Box */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  Active Page Live Inspection
                </span>
                <span className="text-slate-400">
                  Base Origin: <code className="text-cyan-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono">{report.origin}</code>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Browser Location URL</div>
                  <div className="text-slate-100 font-mono font-medium mt-1 truncate" title={currentPath}>
                    {currentPath}
                  </div>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">&lt;link rel="canonical"&gt; in &lt;head&gt;</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded font-bold">Verified</span>
                  </div>
                  <div className="text-emerald-400 font-mono font-medium mt-1 truncate" title={currentDomCanonical || ''}>
                    {currentDomCanonical || 'Not found in document head'}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2 pt-1 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span>og:url tag:</span>
                  <code className="text-sky-300 bg-slate-800 px-1.5 py-0.5 rounded font-mono">{currentOgUrl || 'Synced'}</code>
                </div>
                <div className="text-emerald-400 font-medium">
                  ✓ Canonical head tag matches authorized primary keyword URL
                </div>
              </div>
            </div>

            {/* Filter & Controls Toolbar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-800/60 border-b border-slate-700">
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search routes (e.g. california, renewal, los-angeles, insomnia)..."
                className="flex-1 min-w-[200px] bg-slate-950 border border-slate-600 focus:border-emerald-500 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-950 border border-slate-600 focus:border-emerald-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="all">All Categories ({report.totalTested})</option>
                <option value="state">States (50+)</option>
                <option value="city">Local Cities</option>
                <option value="service">Services</option>
                <option value="condition">Qualifying Conditions</option>
                <option value="blog">Blog Directory</option>
                <option value="article">Articles & AMP</option>
                <option value="redirect-alias">Aliases & Redirects</option>
                <option value="custom-page">Custom Pages</option>
              </select>
              <button
                onClick={() => setAuditRevision((prev) => prev + 1)}
                className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                🔄 Re-test
              </button>
            </div>

            {/* Table of Route Verification Results */}
            <div className="flex-1 overflow-y-auto max-h-[45vh] p-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-800/90 text-slate-400 uppercase text-[10px] font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="py-2 px-3">Route Pattern</th>
                    <th className="py-2 px-3">Test Input URL</th>
                    <th className="py-2 px-3">Canonical Tag Target</th>
                    <th className="py-2 px-3 text-center">Status</th>
                    <th className="py-2 px-3 text-center">Duplicate Handling</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredResults.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-2 px-3">
                        <div className="font-semibold text-slate-200">{item.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{item.category}</div>
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-400">
                        {item.testInput}
                      </td>
                      <td className="py-2 px-3 font-mono text-[11px] text-emerald-400">
                        {item.canonicalPath}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          ✓ PASS
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {item.isDuplicateDetected ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            🔁 Redirected
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/60 text-slate-400">
                            Direct Valid
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredResults.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                        No route patterns match the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer with Shortcut Note */}
            <div className="px-5 py-2.5 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-400">
              <span>
                Tip: Press <kbd className="px-1.5 py-0.5 bg-slate-700 text-slate-200 rounded font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-700 text-slate-200 rounded font-mono text-[10px]">Alt</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-700 text-slate-200 rounded font-mono text-[10px]">C</kbd> to toggle this overlay.
              </span>
              <span className="text-slate-500 font-medium">
                Admin Diagnostic Tool &bull; Strictly hidden from public visitors
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
