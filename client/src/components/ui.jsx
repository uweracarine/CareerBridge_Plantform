import { useState } from 'react';
import { Loader2, AlertTriangle, Clock, User, Briefcase } from 'lucide-react';
import { getInitials } from '../utils/index.js';

// ── Badge ─────────────────────────────────────────────────────────────────────
const BADGE_STYLES = {
  submitted: 'bg-blue-100 text-blue-700',
  under_review: 'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-purple-100 text-purple-700',
  interview_scheduled: 'bg-indigo-100 text-indigo-700',
  assessment: 'bg-orange-100 text-orange-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-gray-100 text-gray-600',
  published: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  draft: 'bg-gray-100 text-gray-600',
  closed: 'bg-red-100 text-red-700',
  expired: 'bg-orange-100 text-orange-700',
  verified: 'bg-green-100 text-green-700',
  internship: 'bg-teal-100 text-teal-700',
  full_time: 'bg-blue-100 text-blue-700',
  part_time: 'bg-purple-100 text-purple-700',
  remote: 'bg-cyan-100 text-cyan-700',
  hybrid: 'bg-indigo-100 text-indigo-700',
  onsite: 'bg-gray-100 text-gray-700',
};

const BADGE_LABELS = {
  submitted: 'Submitted', under_review: 'Under Review', shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview', assessment: 'Assessment', accepted: 'Accepted',
  rejected: 'Rejected', withdrawn: 'Withdrawn', published: 'Published', pending: 'Pending',
  draft: 'Draft', closed: 'Closed', expired: 'Expired', verified: 'Verified',
  internship: 'Internship', full_time: 'Full-time', part_time: 'Part-time',
  remote: 'Remote', hybrid: 'Hybrid', onsite: 'Onsite',
};

export function Badge({ status, label, className = '' }) {
  const style = BADGE_STYLES[status] || 'bg-gray-100 text-gray-600';
  const text = label || BADGE_LABELS[status] || status;
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style} ${className}`}>{text}</span>;
}

// ── EmptyState ────────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {Icon && <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4"><Icon size={32} className="text-text-light" /></div>}
      <h3 className="text-lg font-semibold text-text mb-1">{title}</h3>
      {description && <p className="text-text-light text-sm max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

// ── LoadingSpinner ────────────────────────────────────────────────────────────
export function LoadingSpinner({ size = 24, className = '' }) {
  return <Loader2 size={size} className={`animate-spin text-secondary ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size={36} />
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'primary', trend }) {
  const colors = {
    primary: 'bg-primary bg-opacity-10 text-primary',
    secondary: 'bg-secondary bg-opacity-10 text-secondary',
    success: 'bg-success bg-opacity-10 text-success',
    warning: 'bg-warning bg-opacity-10 text-warning',
    error: 'bg-error bg-opacity-10 text-error',
    accent: 'bg-accent bg-opacity-10 text-accent',
  };
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-text-light font-medium">{label}</p>
        {Icon && <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color]}`}><Icon size={18} /></div>}
      </div>
      <p className="text-3xl font-bold text-text">{value ?? 0}</p>
      {trend && <p className="text-xs text-text-light mt-1">{trend}</p>}
    </div>
  );
}

// ── CircularProgressChart ─────────────────────────────────────────────────────
export function CircularProgressChart({ value = 100, label = 'Candidates', sublabel, color = '#1d4ed8', size = 100 }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDastoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center w-full">
      <svg width={size} height={size} className="relative -top-6">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ strokeDashoffset: strokeDastoffset, strokeDasharray }}
        />
        <text
          x={size / 2}
          y={size / 2 + 5}
          textAnchor="middle"
          fill="#1e293b"
          fontSize="14"
          fontWeight="bold"
        >
          {value}
        </text>
      </svg>
      <p className="text-xs font-semibold text-text mt-2">{label}</p>
      {sublabel && <p className="text-xs text-text-light">{sublabel}</p>}
    </div>
  );
}

// ── JobStatCard ───────────────────────────────────────────────────────────────
export function JobStatCard({ title, candidates, breakdown, color = '#1d4ed8', onViewCandidates }) {
  const [activeTab, setActiveTab] = useState('in-review');

  const tabs = [
    { key: 'in-review', label: 'In Review', color: '#1d4ed8' },
    { key: 'interview', label: 'Interview', color: '#0f766e' },
    { key: 'offered', label: 'Offered', color: '#f59e0b' },
    { key: 'hired', label: 'Hired', color: '#ef4444' },
  ];

  const tabData = breakdown || { inReview: 45, interview: 20, offered: 16, hired: 12 };

  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text">{title}</h3>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs font-medium text-text-light">{candidates}</span>
            <span className="text-xs text-text-light">Candidates</span>
          </div>
        </div>
        <CircularProgressChart value={100} label="Candidates" color={color} size={90} />
      </div>

      <div className="flex gap-1 mb-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeTab === tab.key
                ? `bg-${tab.color === '#1d4ed8' ? 'primary' : tab.color === '#0f766e' ? 'secondary' : tab.color === '#f59e0b' ? 'warning' : 'error'}-bg-opacity-10 text-${tab.color === '#1d4ed8' ? 'primary' : tab.color === '#0f766e' ? 'secondary' : tab.color === '#f59e0b' ? 'warning' : 'error'}`
                : 'text-text-light hover:bg-background'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1d4ed8' }} />
          <span className="text-xs font-medium text-text">{tabData.inReview ?? 45}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0f766e' }} />
          <span className="text-xs font-medium text-text">{tabData.interview ?? 20}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />
          <span className="text-xs font-medium text-text">{tabData.offered ?? 16}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
          <span className="text-xs font-medium text-text">{tabData.hired ?? 12}</span>
        </div>
      </div>

      {onViewCandidates && (
        <button
          onClick={onViewCandidates}
          className="mt-4 w-full py-2 rounded-lg border border-border text-xs font-medium text-text hover:bg-background transition-colors"
        >
          View All Candidates
        </button>
      )}
    </div>
  );
}

// ── ConfirmDialog ─────────────────────────────────────────────────────────────
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false, loading = false }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-slide-up">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-error bg-opacity-10' : 'bg-warning bg-opacity-10'}`}>
          <AlertTriangle size={24} className={danger ? 'text-error' : 'text-warning'} />
        </div>
        <h3 className="text-lg font-semibold text-text text-center mb-2">{title}</h3>
        <p className="text-text-light text-sm text-center mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 py-2">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 ${danger ? 'bg-error hover:bg-red-600' : 'bg-warning hover:bg-yellow-600'}`}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────────────────────
export function Avatar({ src, name, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' };
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover`} />;
  return (
    <div className={`${sizes[size]} rounded-full bg-primary bg-opacity-10 text-primary font-semibold flex items-center justify-center`}>
      {getInitials(name)}
    </div>
  );
}
