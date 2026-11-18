import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  ChevronDown,
  Plus,
  Search,
  Users,
  Bell,
} from 'lucide-react';
import {
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  AreaChart,
  Area,
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { EMPLOYER_NAV } from '../../constants/nav.js';
import { PageLoader, StatCard, Badge, JobStatCard } from '../../components/ui.jsx';
import { employerService } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

const JOB_ANALYSIS_DATA = [
  { name: '1st Mar', 'UI UX Designer': 5, 'UI UX Designer 2': 3, 'Software Engineer': 2, 'Frontend Developer': 1 },
  { name: '2nd Mar', 'UI UX Designer': 15, 'UI UX Designer 2': 10, 'Software Engineer': 8, 'Frontend Developer': 5 },
  { name: '3rd Mar', 'UI UX Designer': 30, 'UI UX Designer 2': 25, 'Software Engineer': 20, 'Frontend Developer': 15 },
  { name: '4th Mar', 'UI UX Designer': 45, 'UI UX Designer 2': 40, 'Software Engineer': 35, 'Frontend Developer': 25 },
  { name: '5th Mar', 'UI UX Designer': 65, 'UI UX Designer 2': 55, 'Software Engineer': 50, 'Frontend Developer': 40 },
  { name: '6th Mar', 'UI UX Designer': 80, 'UI UX Designer 2': 70, 'Software Engineer': 65, 'Frontend Developer': 55 },
  { name: '7th Mar', 'UI UX Designer': 95, 'UI UX Designer 2': 85, 'Software Engineer': 80, 'Frontend Developer': 70 },
  { name: '8th Mar', 'UI UX Designer': 115, 'UI UX Designer 2': 100, 'Software Engineer': 95, 'Frontend Developer': 85 },
];

const SCHEDULE_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const RECENTLY_APPLIED = [
  { id: 1, name: 'John Doe', role: 'Applied for UI UX Designer', time: '1 min ago', status: 'submitted' },
  { id: 2, name: 'Jane Smith', role: 'Applied for UI UX Designer', time: '1 min ago', status: 'submitted' },
  { id: 3, name: 'Mike Johnson', role: 'Applied for UI UX Designer', time: '1 min ago', status: 'submitted' },
  { id: 4, name: 'Sarah Wilson', role: 'Applied for UI UX Designer', time: '1 min ago', status: 'submitted' },
];

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState('All Jobs');
  const navigate = useNavigate();

  const jobs = ['All Jobs', 'UI UX Designer', 'Software Engineer', 'Frontend Developer', 'Product Manager'];

  useEffect(() => {
    let active = true;

    employerService.getDashboard()
      .then((res) => {
        if (active) {
          const data = res?.data || res || {};
          setDashboard({
            org: data.org || { organizationName: 'Your Organization', verificationStatus: 'pending' },
            stats: {
              totalCandidates: data.stats?.totalCandidates ?? data.stats?.totalApps ?? 500,
              newCandidates: data.stats?.newCandidates ?? data.stats?.newApps ?? 100,
              upcomingInterviews: data.stats?.upcomingInterviews ?? data.stats?.interviews ?? 10,
              candidateHired: data.stats?.candidateHired ?? data.stats?.accepted ?? 50,
              ...data.stats,
            },
            recentApplications: data.recentApplications || [],
            recentOpportunities: data.recentOpportunities || [],
          });
        }
      })
      .catch(() => {
        if (active) {
          setDashboard({
            org: { organizationName: 'Your Organization', verificationStatus: 'pending' },
            stats: {
              totalCandidates: 500,
              newCandidates: 100,
              upcomingInterviews: 10,
              candidateHired: 50,
              totalOpps: 4,
              activeOpps: 4,
              totalApps: 500,
              newApps: 100,
              shortlisted: 45,
              interviews: 10,
              accepted: 50,
              expired: 0,
            },
            recentApplications: RECENTLY_APPLIED.map((app, i) => ({
              id: app.id,
              applicant: { fullName: app.name },
              opportunity: { title: app.role.replace('Applied for ', '') },
              applicationStatus: app.status,
              submittedAt: new Date(Date.now() - i * 3600000).toISOString(),
            })),
            recentOpportunities: [],
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const stats = dashboard?.stats || {};
  const recentApplications = dashboard?.recentApplications || [];
  const upcomingInterviews = stats.upcomingInterviews || stats.interviews || 0;

  return (
    <DashboardLayout navItems={EMPLOYER_NAV} title="Dashboard">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-border p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer pr-10"
              >
                {jobs.map((job) => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light" />
            </div>
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                type="text"
                placeholder="Search Candidate"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-border rounded-lg text-sm text-text bg-white focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Link
              to="/employer/opportunities/create"
              className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
            >
              <Plus size={16} /> Create Job
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <Link
                to="/employer/notifications"
                className="p-2 rounded-lg hover:bg-background text-text-light relative"
              >
                <Bell size={20} />
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center text-sm font-semibold">
                  {user?.fullName ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'SW'}
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium text-text">{user?.fullName || 'Sam Wilson'}</span>
                  <span className="text-xs text-text-light">{user?.role?.replace('_', ' ') || 'Recruiter'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : (
        <>
          {/* Welcome Section */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-text flex items-center gap-2">
              Welcome <span className="text-primary">👋</span>
            </h2>
            <p className="text-text-light text-sm mt-1">
              You have {upcomingInterviews} upcoming interviews this week
            </p>
          </div>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Candidates"
              value={stats.totalCandidates || stats.totalOpps || 500}
              icon={Users}
              color="primary"
              trend="Across 4 jobs"
            />
            <StatCard
              label="New Candidates"
              value={`+${stats.newCandidates || stats.newApps || 100}`}
              icon={Users}
              color="success"
              trend="Today"
            />
            <StatCard
              label="Upcoming Interview"
              value={upcomingInterviews}
              icon={CalendarCheck2}
              color="primary"
              trend="This week"
            />
            <StatCard
              label="Candidate Hired"
              value={stats.candidateHired || stats.accepted || 50}
              icon={CheckCircle2}
              color="success"
              trend="Across 4 jobs"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Job Analysis Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text">Job Analysis</h3>
                <select
                  className="text-xs border border-border rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-secondary"
                  defaultValue="Daily"
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={JOB_ANALYSIS_DATA}>
                    <defs>
                      <linearGradient id="appsFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickFontSize={11} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} tickFontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#ffffff', fontSize: 12 }}
                      itemStyle={{ color: '#94a3b8', fontSize: 12 }}
                      cursor={{ strokeDasharray: '3 3' }}
                    />
                    <Area type="monotone" dataKey="UI UX Designer" stroke="#1d4ed8" fill="url(#appsFill)" strokeWidth={2} />
                    <Area type="monotone" dataKey="UI UX Designer 2" stroke="#0f766e" fillOpacity={0.1} strokeWidth={2} />
                    <Area type="monotone" dataKey="Software Engineer" stroke="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
                    <Area type="monotone" dataKey="Frontend Developer" stroke="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text">Schedule</h3>
                <Link to="/employer/schedule" className="text-xs text-primary font-medium hover:underline">
                  View All
                </Link>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-text">3rd Mar - 9th Mar 23</span>
                <div className="flex gap-1">
                  <button className="w-6 h-6 rounded-lg border border-border hover:bg-primary hover:text-white text-xs text-text transition-colors">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-4">
                {SCHEDULE_DAYS.map((day) => (
                  <div
                    key={day}
                    className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg text-xs transition-colors hover:bg-primary/5 cursor-pointer"
                  >
                    <span className={`font-medium ${day === 'THU' ? 'text-primary' : 'text-text-light'}`}>
                      {day}
                    </span>
                    <span className={`text-text-light ${day === 'THU' ? 'font-bold text-text' : ''}`}>
                      {['SUN','MON','TUE','WED','THU','FRI','SAT'].indexOf(day) + 1}
                    </span>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-2 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    07
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text">THU</p>
                    <p className="text-xs text-text-light">UI UX Designer</p>
                    <p className="text-[10px] text-text-light">1st round interview w/ John Doe</p>
                    <p className="text-[10px] text-text-light">10am - 12pm</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg bg-success/5 border border-success/10">
                  <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    08
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-text">FRI</p>
                    <p className="text-xs text-text-light">Software Engineer</p>
                    <p className="text-[10px] text-text-light">10 round interview w/ Lars Doe</p>
                    <p className="text-[10px] text-text-light">10am - 12pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Job Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <JobStatCard
              title="UI UX Designer"
              candidates="100"
              breakdown={{ inReview: 45, interview: 20, offered: 16, hired: 12 }}
              color="#1d4ed8"
              onViewCandidates={() => navigate('/employer/applications')}
            />
            <JobStatCard
              title="Software Engineer"
              candidates="100"
              breakdown={{ inReview: 45, interview: 20, offered: 16, hired: 12 }}
              color="#0f766e"
              onViewCandidates={() => navigate('/employer/applications')}
            />
          </div>

          {/* Recently Applied */}
          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">Recently Applied</h3>
              <Link to="/employer/applications" className="text-xs text-primary font-medium hover:underline">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentApplications.length ? (
                recentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-background transition-colors border border-transparent hover:border-border"
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
                      {app.applicant?.fullName ? app.applicant.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'JD'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">
                        {app.applicant?.fullName || 'Candidate'}
                      </p>
                      <p className="text-xs text-text-light truncate">
                        {app.opportunity?.title || 'Position'}
                      </p>
                    </div>
                    <Badge status={app.applicationStatus || 'submitted'} />
                    <span className="text-xs text-text-light">
                      {app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-text-light text-sm">No recent applications.</p>
              )}
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}