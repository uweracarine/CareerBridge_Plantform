import { useEffect, useState } from 'react';
import { Bell, CalendarCheck2, Plus, Trash2, MapPin, Briefcase } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { STUDENT_NAV, EMPLOYER_NAV } from '../../constants/nav.js';
import { featureService, opportunityService } from '../../services/api.js';
import { PageLoader, EmptyState, Badge } from '../../components/ui.jsx';

export function JobAlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ keywords: '', location: '', categoryId: '', frequency: 'daily', isActive: true });

  const load = () => featureService.getAlerts().then(r => setAlerts(Array.isArray(r?.data) ? r.data : [])).finally(() => setLoading(false));
  useEffect(() => {
    load();
    opportunityService.getCategories().then(r => setCategories(Array.isArray(r?.data) ? r.data : [])).catch(() => setCategories([]));
  }, []);

  const create = async (event) => {
    event.preventDefault();
    try {
      await featureService.createAlert({ ...form, categoryId: form.categoryId || null });
      setForm({ keywords: '', location: '', categoryId: '', frequency: 'daily', isActive: true });
      await load();
    } catch (err) { alert(err?.response?.data?.message || 'Could not create job alert.'); }
  };
  const remove = async (id) => { await featureService.deleteAlert(id); setAlerts(items => items.filter(item => item.id !== id)); };
  const toggle = async (item) => { const updated = await featureService.updateAlert(item.id, { isActive: !item.isActive }); setAlerts(items => items.map(entry => entry.id === item.id ? (updated?.data || { ...entry, isActive: !entry.isActive }) : entry)); };

  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="Job Alerts"><PageLoader /></DashboardLayout>;
  return <DashboardLayout navItems={STUDENT_NAV} title="Job Alerts">
    <div className="grid lg:grid-cols-[360px_1fr] gap-6">
      <form onSubmit={create} className="bg-white border border-border rounded-xl p-5 space-y-4 h-fit">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Bell size={18}/>Create Job Alert</h2>
        <input className="input-field w-full" value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} placeholder="Keywords, e.g. developer" />
        <input className="input-field w-full" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" />
        <select className="input-field w-full" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}><option value="">Any category</option>{categories.map(category => <option key={category.id} value={category.id}>{category.categoryName}</option>)}</select>
        <select className="input-field w-full" value={form.frequency} onChange={e => setForm({ ...form, frequency: e.target.value })}><option value="instant">Instant</option><option value="daily">Daily</option><option value="weekly">Weekly</option></select>
        <button className="btn-primary w-full"><Plus size={16} className="inline mr-1"/>Create Alert</button>
      </form>
      <div className="bg-white border border-border rounded-xl overflow-hidden">
        {alerts.length ? alerts.map(item => <div key={item.id} className="flex items-center justify-between gap-4 p-5 border-b border-border last:border-b-0"><div><p className="font-semibold">{item.keywords || 'Any matching opportunity'}</p><p className="text-sm text-text-light">{item.location || 'Any location'} · {item.frequency} alerts</p></div><div className="flex gap-2"><button onClick={() => toggle(item)} className="text-xs px-3 py-2 rounded border border-border">{item.isActive ? 'Pause' : 'Activate'}</button><button onClick={() => remove(item.id)} className="p-2 text-error hover:bg-error/10 rounded"><Trash2 size={17}/></button></div></div>) : <EmptyState icon={Bell} title="No job alerts yet" description="Create an alert to monitor matching opportunities." />}
      </div>
    </div>
  </DashboardLayout>;
}

export function StudentInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { featureService.getStudentInterviews().then(r => setInterviews(Array.isArray(r?.data) ? r.data : [])).catch(() => setInterviews([])).finally(() => setLoading(false)); }, []);
  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="Interviews"><PageLoader /></DashboardLayout>;
  return <DashboardLayout navItems={STUDENT_NAV} title="Interviews"><div className="space-y-4">{interviews.length ? interviews.map(item => <div key={item.id} className="bg-white border border-border rounded-xl p-5 flex items-center justify-between gap-4"><div><p className="font-semibold">{item.application?.opportunity?.title}</p><p className="text-sm text-text-light">{item.organization?.organizationName}</p></div><div className="text-right"><Badge status={item.status === 'scheduled' ? 'pending' : item.status} /><p className="text-sm mt-2 text-text-light">{new Date(item.scheduledAt).toLocaleString()}</p></div></div>) : <EmptyState icon={CalendarCheck2} title="No interviews scheduled" />}</div></DashboardLayout>;
}

export function EmployerInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = () => featureService.getEmployerInterviews().then(r => setInterviews(Array.isArray(r?.data) ? r.data : [])).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);
  const update = async (id, status) => { await featureService.updateInterviewStatus(id, status); await load(); };
  if (loading) return <DashboardLayout navItems={EMPLOYER_NAV} title="Interview Schedule"><PageLoader /></DashboardLayout>;
  return <DashboardLayout navItems={EMPLOYER_NAV} title="Interview Schedule"><div className="space-y-4">{interviews.length ? interviews.map(item => <div key={item.id} className="bg-white border border-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><p className="font-semibold">{item.application?.applicant?.fullName}</p><p className="text-sm text-text-light">{item.application?.opportunity?.title} · {new Date(item.scheduledAt).toLocaleString()}</p></div><div className="flex gap-2"><button onClick={() => update(item.id, 'completed')} className="text-xs bg-green-100 text-green-700 px-3 py-2 rounded">Complete</button><button onClick={() => update(item.id, 'cancelled')} className="text-xs bg-red-100 text-red-700 px-3 py-2 rounded">Cancel</button></div></div>) : <EmptyState icon={CalendarCheck2} title="No interviews scheduled" />}</div></DashboardLayout>;
}

export function RecommendationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { featureService.getRecommendations().then(r => setItems(Array.isArray(r?.data) ? r.data : [])).catch(() => setItems([])).finally(() => setLoading(false)); }, []);
  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="Recommended Jobs"><PageLoader /></DashboardLayout>;
  return <DashboardLayout navItems={STUDENT_NAV} title="Recommended Jobs"><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">{items.length ? items.map(item => <div key={item.id} className="bg-white border border-border rounded-xl p-5"><div className="flex justify-between gap-3"><div><p className="font-semibold text-text">{item.title}</p><p className="text-sm text-text-light">{item.organization?.organizationName}</p></div><span className="text-xs font-bold text-primary bg-primary/10 rounded-full px-2 py-1 h-fit">{item.matchPercentage}% match</span></div><p className="mt-4 text-sm text-text-light flex items-center gap-1"><MapPin size={14}/>{item.location}</p><p className="mt-2 text-sm text-text-light flex items-center gap-1"><Briefcase size={14}/>{item.employmentType?.replace('_', ' ')}</p><a href={`/opportunities/${item.id}`} className="btn-primary inline-block mt-4 text-sm py-2 px-4">View opportunity</a></div>) : <EmptyState icon={Briefcase} title="No recommendations yet" description="Add skills and complete your profile to improve recommendations." />}</div></DashboardLayout>;
}
