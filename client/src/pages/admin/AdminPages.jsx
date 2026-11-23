import { useEffect, useState } from 'react';
import { Building2, CheckCircle, Search, Plus, Trash2, XCircle, Shield, Clock3 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { ADMIN_NAV } from '../../constants/nav.js';
import { adminService } from '../../services/api.js';
import { PageLoader, Badge, EmptyState } from '../../components/ui.jsx';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#1d4ed8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function getList(res) {
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

export function AdminEmployers({ verificationOnly = false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(verificationOnly ? 'pending' : '');

  useEffect(() => {
    let active = true;
    setLoading(true);
    adminService.getEmployers({ q: query || undefined, verificationStatus: status || undefined })
      .then(res => active && setItems(getList(res)))
      .catch(() => active && setItems([]))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [query, status]);

  const verify = async (id, verificationStatus) => {
    try {
      await adminService.verifyEmployer(id, verificationStatus);
      setItems(prev => prev.map(item => item.id === id ? { ...item, verificationStatus } : item));
    } catch (_) { alert('Failed to update employer verification.'); }
  };

  const title = verificationOnly ? 'Verification Requests' : 'Employers';
  if (loading) return <DashboardLayout navItems={ADMIN_NAV} title={title}><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={ADMIN_NAV} title={title}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-text">{title}</h2>
          <div className="flex gap-2">
            <input className="input-field" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search employers..." />
            <select className="input-field" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All Statuses</option><option value="pending">Pending</option><option value="verified">Verified</option><option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          {items.length ? items.map(org => (
            <div key={org.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-border last:border-b-0">
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Building2 size={20}/></div><div><p className="font-semibold text-text">{org.organizationName}</p><p className="text-sm text-text-light">{org.owner?.email || org.email || '—'} · {org._count?.opportunities || 0} opportunities</p></div></div>
              <div className="flex items-center gap-2"><Badge status={org.verificationStatus} label={org.verificationStatus}/>{org.verificationStatus !== 'verified' && <button onClick={() => verify(org.id, 'verified')} className="text-xs bg-green-100 text-green-700 px-3 py-2 rounded hover:bg-green-200"><CheckCircle size={14} className="inline mr-1"/>Approve</button>}<button onClick={() => verify(org.id, 'rejected')} className="text-xs bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200"><XCircle size={14} className="inline mr-1"/>Reject</button></div>
            </div>
          )) : <EmptyState icon={Building2} title="No employers found" description="Employers matching this filter will appear here." />}
        </div>
      </div>
    </DashboardLayout>
  );
}

export function AdminOpportunities() {
  const [items, setItems] = useState([]); const [loading, setLoading] = useState(true); const [query, setQuery] = useState(''); const [status, setStatus] = useState('');
  useEffect(() => { let active=true; adminService.getOpportunities({q:query||undefined,status:status||undefined}).then(r=>active&&setItems(getList(r))).catch(()=>active&&setItems([])).finally(()=>active&&setLoading(false)); return()=>{active=false}; }, [query,status]);
  const moderate = async (id, action) => { try { await adminService.moderateOpportunity(id, action); setItems(p=>p.map(x=>x.id===id?{...x,status:action==='approve'?'published':action==='reject'?'rejected':'closed'}:x)); } catch(_) { alert('Failed to update opportunity.'); } };
  if (loading) return <DashboardLayout navItems={ADMIN_NAV} title="Opportunities"><PageLoader/></DashboardLayout>;
  return <DashboardLayout navItems={ADMIN_NAV} title="Opportunities"><div className="space-y-6"><div className="flex flex-col sm:flex-row justify-between gap-4"><h2 className="text-xl font-semibold">Opportunities</h2><div className="flex gap-2"><input className="input-field" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search opportunities..."/><select className="input-field" value={status} onChange={e=>setStatus(e.target.value)}><option value="">All</option><option value="pending">Pending</option><option value="published">Published</option><option value="rejected">Rejected</option><option value="closed">Closed</option></select></div></div><div className="bg-white rounded-xl border border-border overflow-hidden">{items.length?items.map(op=> <div key={op.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-border last:border-b-0"><div><p className="font-semibold">{op.title}</p><p className="text-sm text-text-light">{op.organization?.organizationName || 'Unknown'} · {op.category?.categoryName || 'Uncategorized'}</p></div><div className="flex items-center gap-2"><Badge status={op.status} label={op.status}/>{op.status==='pending'&&<><button onClick={()=>moderate(op.id,'approve')} className="btn-primary text-xs py-2">Approve</button><button onClick={()=>moderate(op.id,'reject')} className="text-xs bg-red-100 text-red-700 px-3 py-2 rounded">Reject</button></>}</div></div>):<EmptyState icon={Search} title="No opportunities found"/>}</div></div></DashboardLayout>;
}

export function AdminCategories() {
  const [items,setItems]=useState([]); const [loading,setLoading]=useState(true); const [name,setName]=useState(''); const [description,setDescription]=useState('');
  const load=()=>adminService.getCategories().then(r=>setItems(Array.isArray(r?.data)?r.data:[])).catch(()=>setItems([])).finally(()=>setLoading(false));
  useEffect(()=>{load()},[]);
  const create=async(e)=>{e.preventDefault(); if(!name.trim())return; try{await adminService.createCategory({categoryName:name.trim(),description:description.trim()||null});setName('');setDescription('');load()}catch(_){alert('Failed to create category.')}};
  const remove=async(id)=>{if(!window.confirm('Delete this category?'))return;try{await adminService.deleteCategory(id);setItems(p=>p.filter(x=>x.id!==id))}catch(e){alert(e?.response?.data?.message||'Failed to delete category.')}};
  if(loading)return<DashboardLayout navItems={ADMIN_NAV} title="Categories"><PageLoader/></DashboardLayout>;
  return <DashboardLayout navItems={ADMIN_NAV} title="Categories"><div className="grid lg:grid-cols-3 gap-6"><form onSubmit={create} className="bg-white border border-border rounded-xl p-5 h-fit space-y-4"><h2 className="text-lg font-semibold">Add Category</h2><input className="input-field w-full" value={name} onChange={e=>setName(e.target.value)} placeholder="Category name"/><textarea className="input-field w-full min-h-24" value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description"/><button className="btn-primary w-full"><Plus size={16} className="inline mr-1"/>Create Category</button></form><div className="lg:col-span-2 bg-white border border-border rounded-xl overflow-hidden">{items.length?items.map(cat=><div key={cat.id} className="flex items-center justify-between p-5 border-b border-border last:border-b-0"><div><p className="font-semibold">{cat.categoryName}</p><p className="text-sm text-text-light">{cat.description||'No description'} · {cat._count?.opportunities||0} opportunities</p></div><button onClick={()=>remove(cat.id)} className="p-2 text-error hover:bg-error/10 rounded"><Trash2 size={17}/></button></div>):<EmptyState icon={Plus} title="No categories yet"/>}</div></div></DashboardLayout>;
}

export function AdminAnalytics() {
  const [data,setData]=useState(null); const [loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;adminService.getAnalytics().then(r=>active&&setData(r?.data||r||null)).catch(()=>active&&setData(null)).finally(()=>active&&setLoading(false));return()=>{active=false}},[]);
  if(loading)return<DashboardLayout navItems={ADMIN_NAV} title="Analytics"><PageLoader/></DashboardLayout>;
  const monthly=data?.monthlyData||[]; const status=data?.byStatus||[];
  return <DashboardLayout navItems={ADMIN_NAV} title="Analytics"><div className="grid lg:grid-cols-3 gap-6"><div className="lg:col-span-2 bg-white border border-border rounded-xl p-5"><h2 className="text-lg font-semibold mb-4">Platform Growth</h2><div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={monthly}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis allowDecimals={false}/><Tooltip/><Area type="monotone" dataKey="users" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.12}/><Area type="monotone" dataKey="opportunities" stroke="#10b981" fill="#10b981" fillOpacity={0.12}/><Area type="monotone" dataKey="applications" stroke="#f59e0b" fill="none"/></AreaChart></ResponsiveContainer></div></div><div className="bg-white border border-border rounded-xl p-5"><h2 className="text-lg font-semibold mb-4">Applications by Status</h2><div className="h-72"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={status.map(x=>({name:x.applicationStatus,value:x._count}))} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>{status.map((x,i)=><Cell key={x.applicationStatus} fill={COLORS[i%COLORS.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer></div></div></div></DashboardLayout>;
}

export function AdminActivityLogs() {
  const [items,setItems]=useState([]); const [loading,setLoading]=useState(true); const [action,setAction]=useState('');
  useEffect(()=>{let active=true;setLoading(true);adminService.getActivityLogs({action:action||undefined}).then(r=>active&&setItems(getList(r))).catch(()=>active&&setItems([])).finally(()=>active&&setLoading(false));return()=>{active=false}},[action]);
  if(loading)return<DashboardLayout navItems={ADMIN_NAV} title="Activity Logs"><PageLoader/></DashboardLayout>;
  return <DashboardLayout navItems={ADMIN_NAV} title="Activity Logs"><div className="space-y-5"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Activity Logs</h2><input className="input-field" value={action} onChange={e=>setAction(e.target.value)} placeholder="Filter by action..."/></div><div className="bg-white border border-border rounded-xl overflow-hidden">{items.length?items.map(log=><div key={log.id} className="flex items-start justify-between gap-4 p-5 border-b border-border last:border-b-0"><div><p className="font-medium">{log.action?.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</p><p className="text-sm text-text-light">{log.user?.fullName||'System'} · {log.entityType||'Platform'} {log.entityId?`#${log.entityId}`:''}</p></div><span className="text-xs text-text-light whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</span></div>):<EmptyState icon={Clock3} title="No activity logs found"/>}</div></div></DashboardLayout>;
}

export function AdminAccounts() {
  const [fullName,setFullName]=useState(''); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [saving,setSaving]=useState(false);
  const create=async(e)=>{e.preventDefault();setSaving(true);try{await adminService.createAdmin({fullName,email,password,permissions:['manage_users','manage_employers','manage_opportunities','manage_categories']});setFullName('');setEmail('');setPassword('');alert('Admin account created.')}catch(e){alert(e?.response?.data?.message||'Failed to create admin account.')}finally{setSaving(false)}};
  return <DashboardLayout navItems={ADMIN_NAV} title="Admin Accounts"><div className="max-w-xl"><form onSubmit={create} className="bg-white border border-border rounded-xl p-6 space-y-4"><div><h2 className="text-xl font-semibold">Create Admin Account</h2><p className="text-sm text-text-light">Available to super administrators.</p></div><input className="input-field w-full" value={fullName} onChange={e=>setFullName(e.target.value)} required placeholder="Full name"/><input className="input-field w-full" type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Email address"/><input className="input-field w-full" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} placeholder="Temporary password"/><button disabled={saving} className="btn-primary w-full"><Shield size={16} className="inline mr-1"/> {saving?'Creating...':'Create Admin'}</button></form></div></DashboardLayout>;
}
