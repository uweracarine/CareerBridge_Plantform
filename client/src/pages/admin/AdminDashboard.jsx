import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  BriefcaseBusiness,
  ShieldCheck,
  FileText,
  TrendingUp,
  Clock3,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { ADMIN_NAV } from '../../constants/nav.js';
import { adminService } from '../../services/api.js';
import { PageLoader, StatCard, Badge } from '../../components/ui.jsx';

const COLORS = ['#1d4ed8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const fallbackDashboard = {
  totalUsers: 0,
  students: 0,
  employers: 0,
  verifiedEmployers: 0,
  pendingVerifications: 0,
  totalOpps: 0,
  publishedOpps: 0,
  pendingOpps: 0,
  totalApps: 0,
  recentUsers: [],
  recentActivity: [],
};

const fallbackAnalytics = {
  monthlyData: [
    { month: 'Jan', users: 0, opportunities: 0, applications: 0 },
    { month: 'Feb', users: 0, opportunities: 0, applications: 0 },
    { month: 'Mar', users: 0, opportunities: 0, applications: 0 },
    { month: 'Apr', users: 0, opportunities: 0, applications: 0 },
    { month: 'May', users: 0, opportunities: 0, applications: 0 },
    { month: 'Jun', users: 0, opportunities: 0, applications: 0 },
  ],
  byStatus: [],
};

const formatActivityLabel = (action = '') => action
  .replace(/_/g, ' ')
  .replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(fallbackDashboard);
  const [analytics, setAnalytics] = useState(fallbackAnalytics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      adminService.getDashboard(),
      adminService.getAnalytics(),
    ])
      .then(([dashboardRes, analyticsRes]) => {
        if (!active) return;

        const dashboardData = dashboardRes?.data || dashboardRes || fallbackDashboard;
        const analyticsData = analyticsRes?.data || analyticsRes || fallbackAnalytics;

        setDashboard({
          ...fallbackDashboard,
          ...dashboardData,
        });

        setAnalytics({
          ...fallbackAnalytics,
          ...analyticsData,
        });
      })
      .catch(() => {
        if (!active) return;
        setDashboard(fallbackDashboard);
        setAnalytics(fallbackAnalytics);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const statusChartData = useMemo(() => {
    const raw = analytics.byStatus || [];
    if (!raw.length) return [
      { name: 'Submitted', value: 0 },
      { name: 'Shortlisted', value: 0 },
      { name: 'Interview', value: 0 },
      { name: 'Hired', value: 0 },
    ];

    return raw.map((item) => ({
      name: (item.applicationStatus || 'Unknown').replace(/_/g, ' '),
      value: item._count || 0,
    }));
  }, [analytics.byStatus]);

  const cardStats = [
    { label: 'Total Users', value: dashboard.totalUsers, icon: Users, color: 'primary', trend: `${dashboard.students || 0} students / ${dashboard.employers || 0} employers` },
    { label: 'Published Jobs', value: dashboard.publishedOpps, icon: BriefcaseBusiness, color: 'secondary', trend: `${dashboard.totalOpps || 0} total opportunities` },
    { label: 'Verified Employers', value: dashboard.verifiedEmployers, icon: ShieldCheck, color: 'success', trend: `${dashboard.pendingVerifications || 0} pending review` },
    { label: 'Applications', value: dashboard.totalApps, icon: FileText, color: 'warning', trend: `${dashboard.pendingOpps || 0} jobs awaiting moderation` },
  ];

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Admin Dashboard">
      {loading ? (
        <PageLoader />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-text">Platform Overview</h2>
            <p className="text-text-light text-sm">Live metrics and activity across the CareerBridge ecosystem.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {cardStats.map((stat) => (
              <StatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                trend={stat.trend}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-text">Growth & activity</h3>
                  <p className="text-xs text-text-light">Users, opportunities, and applications in the last 6 months</p>
                </div>
                <div className="flex items-center gap-2 text-success text-sm font-medium">
                  <TrendingUp size={16} />
                  <span>+{dashboard.totalUsers || 0} total accounts</span>
                </div>
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.monthlyData || fallbackAnalytics.monthlyData}>
                    <defs>
                      <linearGradient id="usersArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.02} />
                      </linearGradient>
                      <linearGradient id="oppArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                    <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                    />
                    <Area type="monotone" dataKey="users" stroke="#1d4ed8" fill="url(#usersArea)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="opportunities" stroke="#10b981" fill="url(#oppArea)" strokeWidth={2.5} />
                    <Area type="monotone" dataKey="applications" stroke="#f59e0b" fillOpacity={0} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text">Application flow</h3>
                <Clock3 size={16} className="text-text-light" />
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={48}
                      outerRadius={82}
                      paddingAngle={3}
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 mt-2">
                {statusChartData.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-text-light capitalize">{item.name}</span>
                    </div>
                    <span className="font-semibold text-text">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text">Recent activity</h3>
                <span className="text-xs text-text-light">Latest updates</span>
              </div>

              <div className="space-y-3">
                {(dashboard.recentActivity || []).length ? (
                  dashboard.recentActivity.map((item) => (
                    <div key={item.id || `${item.action}-${item.createdAt}`} className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-text">{item.user?.fullName || 'System'}</p>
                          <Badge status={item.action?.includes('approved') ? 'verified' : 'pending'} label={formatActivityLabel(item.action)} />
                        </div>
                        <p className="text-sm text-text-light">{item.entityType || 'Platform'} update</p>
                      </div>
                      <span className="text-xs text-text-light whitespace-nowrap">{formatDate(item.createdAt)}</span>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-text-light">
                    No recent activity has been recorded yet.
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text">New sign-ups</h3>
                <ArrowUpRight size={16} className="text-primary" />
              </div>

              <div className="space-y-3">
                {(dashboard.recentUsers || []).length ? (
                  dashboard.recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
                      <div>
                        <p className="font-medium text-text">{user.fullName}</p>
                        <p className="text-xs text-text-light">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <Badge status={user.accountStatus || 'active'} label={user.accountStatus || 'Active'} />
                        <p className="text-[11px] text-text-light mt-2">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-text-light">
                    No new users in the last few days.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">Opportunity volume</h3>
              <span className="text-xs text-text-light">Published opportunities by month</span>
            </div>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.monthlyData || fallbackAnalytics.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={11} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }} />
                  <Bar dataKey="opportunities" radius={[6, 6, 0, 0]} fill="#1d4ed8" />
                  <Bar dataKey="applications" radius={[6, 6, 0, 0]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
