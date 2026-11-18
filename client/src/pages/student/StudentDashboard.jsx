import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Bell,
  MessageSquare,
  ArrowRight,
  Briefcase,
  MapPin,
  Sparkles,
  Clock3,
  CheckCircle2,
  TrendingUp,
  Star,
  FileText,
  UserCircle2,
} from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { PageLoader, Avatar } from '../../components/ui.jsx';
import { studentService } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { STUDENT_NAV } from '../../constants/nav.js';

const progressCardStyle = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(247,250,252,0.95))',
};

function MetricCard({ label, value, subtext, accent, icon: Icon, actionLabel }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-600',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-emerald-50 text-emerald-600',
    violet: 'bg-violet-50 text-violet-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    rose: 'bg-rose-50 text-rose-600',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" style={progressCardStyle}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={`rounded-xl p-2 ${tones[accent] || tones.blue}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><TrendingUp size={12} className="text-emerald-500" /> {subtext}</span>
        {actionLabel && <button type="button" className="inline-flex items-center gap-1 font-medium text-slate-700 hover:text-primary">{actionLabel} <ArrowRight size={12} /></button>}
      </div>
    </div>
  );
}

function RecommendationCard({ title, company, location, match, tone, actionLabel = 'Apply Now' }) {
  const tones = {
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-violet-50 text-violet-600',
    cyan: 'bg-cyan-50 text-cyan-600',
    amber: 'bg-amber-50 text-amber-600',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${tones[tone] || tones.green}`}>
        <Briefcase size={20} />
      </div>
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-lg font-semibold text-slate-800">{title}</p>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">Full-Time</span>
      </div>
      <p className="text-sm text-slate-500">{company} · {location}</p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-500">Match</span>
        <span className="text-xs font-semibold text-slate-800">{match}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-cyan-400" style={{ width: `${match}%` }} />
      </div>
      <button type="button" className="mt-4 w-full rounded-xl bg-cyan-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-cyan-600">{actionLabel}</button>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentService.getDashboard()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="Dashboard"><PageLoader /></DashboardLayout>;

  const stats = data?.stats || { submitted: 105, under_review: 68, shortlisted: 23, accepted: 18, rejected: 12, saved: 14 };
  const profileCompletion = data?.profile?.profileCompletion || 70;

  const recommendations = [
    { title: 'Social Media Assistant', company: 'Noma', location: 'Paris, France', match: 43, tone: 'green' },
    { title: 'Brand Designer', company: 'Motive', location: 'Paris, France', match: 87, tone: 'purple' },
    { title: 'Interactive Developer', company: 'Terrarium', location: 'Berlin, Germany', match: 64, tone: 'cyan' },
  ];

  return (
    <DashboardLayout navItems={STUDENT_NAV} title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 xl:col-span-8 space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <MetricCard label="Application Submitted" value={stats.submitted || 105} subtext="24%" accent="blue" icon={FileText} actionLabel="View Report" />
              <MetricCard label="Application Reviewed" value={stats.under_review || 68} subtext="38%" accent="amber" icon={Briefcase} actionLabel="View Report" />
              <MetricCard label="Interview Schedule" value={stats.shortlisted || 23} subtext="15%" accent="green" icon={CheckCircle2} actionLabel="View Report" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-slate-800">Interview Opportunities</h3>
                  <div className="rounded-lg bg-violet-50 p-2 text-violet-600"><Star size={18} /></div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Interviews</p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">20</p>
                    <p className="mt-2 text-xs text-emerald-600">↑ 12%</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Upcoming</p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">5</p>
                    <p className="mt-2 text-xs text-amber-600">This week</p>
                  </div>
                </div>
                <button type="button" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-primary">View all interviews <ArrowRight size={14} /></button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-slate-800">Connection & Network Growth</h3>
                  <div className="rounded-lg bg-cyan-50 p-2 text-cyan-600"><TrendingUp size={18} /></div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">New connection</p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">73</p>
                    <p className="mt-2 text-xs text-emerald-600">↑ 35%</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">All time network</p>
                    <p className="mt-2 text-3xl font-bold text-slate-800">2,765</p>
                    <p className="mt-2 text-xs text-cyan-600">Strong growth</p>
                  </div>
                </div>
                <div className="mt-4 h-16 rounded-xl bg-gradient-to-r from-sky-100 via-violet-100 to-indigo-100 p-3">
                  <div className="flex h-full items-end gap-1">
                    {[35, 52, 42, 68, 58, 80, 72, 90].map((height, index) => (
                      <span key={index} className="w-full rounded-t-md bg-gradient-to-t from-sky-400 to-violet-500" style={{ height: `${height}%` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-slate-800">Job Recommendations</h3>
                <button type="button" className="text-sm font-medium text-slate-700 hover:text-primary">View all jobs</button>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {recommendations.map((item) => (
                  <RecommendationCard key={item.title} {...item} />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-slate-800">Personalized Skill Development Plan</h3>
                <button type="button" className="text-sm font-medium text-slate-700 hover:text-primary">View all courses</button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {[
                  { title: 'UX Research', level: 'Beginner', icon: Sparkles },
                  { title: 'Product Strategy', level: 'Intermediate', icon: TrendingUp },
                  { title: 'AI Career Tools', level: 'Advanced', icon: CheckCircle2 },
                ].map((course) => (
                  <div key={course.title} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="rounded-lg bg-white p-2 text-primary shadow-sm"><course.icon size={18} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-slate-800">{course.title}</p>
                      <p className="text-xs text-slate-500">{course.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="col-span-12 xl:col-span-4 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3 pb-3">
                <div className="flex items-center gap-3">
                  <Avatar src={user?.profilePhoto} name={user?.fullName || 'Student'} size="lg" />
                  <div>
                    <p className="text-lg font-semibold text-slate-800">{user?.fullName || 'Student User'}</p>
                    <p className="text-xs text-slate-500">Career growth profile</p>
                  </div>
                </div>
                <div className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">Online</div>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Profile completed</span>
                  <span className="font-semibold text-slate-700">{profileCompletion}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500" style={{ width: `${profileCompletion}%` }} />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-600">Profile Strength</span>
                  <span className="font-semibold text-slate-800">{profileCompletion}%</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-600">Career Goals</span>
                  <span className="font-semibold text-slate-800">3 Active</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-slate-800">Skill Development</h3>
                <div className="rounded-lg bg-amber-50 p-2 text-amber-600"><Sparkles size={18} /></div>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Mobile App Design', value: 73, tone: 'amber' },
                  { name: 'Data Analysis', value: 89, tone: 'sky' },
                  { name: 'Product Strategy', value: 62, tone: 'violet' },
                ].map((skill) => (
                  <div key={skill.name}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-slate-600">{skill.name}</span>
                      <span className="font-semibold text-slate-800">{skill.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500" style={{ width: `${skill.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-slate-800">Referral Impact</h3>
                <div className="rounded-lg bg-rose-50 p-2 text-rose-600"><UserCircle2 size={18} /></div>
              </div>
              <p className="text-sm text-slate-500">Refer your friends and add on your network.</p>
              <div className="mt-5 rounded-xl bg-gradient-to-r from-yellow-100 via-amber-50 to-orange-100 p-4 text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-white p-3 text-amber-500 shadow-sm">
                  <Star size={22} />
                </div>
                <p className="mt-3 text-lg font-semibold text-slate-800">Boost your network</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
