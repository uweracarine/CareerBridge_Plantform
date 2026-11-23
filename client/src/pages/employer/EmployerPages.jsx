import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Briefcase, ClipboardList, FileText, Plus, User, ShieldCheck, UploadCloud, Building2, Globe, CheckCircle2, CalendarCheck2, Clock3 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { EMPLOYER_NAV } from '../../constants/nav.js';
import { EmptyState, PageLoader, Badge } from '../../components/ui.jsx';
import { employerService, opportunityService, applicationService, messageService } from '../../services/api.js';
import { useToast } from '../../context/NotificationContext.jsx';

const ORGANIZATION_TYPES = [
  'private',
  'ngo',
  'government',
  'startup',
  'university',
  'training',
  'international',
];

function SectionCard({ title, subtitle, action, children }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text">{title}</h3>
          {subtitle && <p className="text-sm text-text-light mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

const defaultProfile = {
  organizationName: '',
  organizationType: 'private',
  industry: '',
  description: '',
  website: '',
  email: '',
  phone: '',
  location: '',
};

export function EmployerProfilePage() {
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    employerService.getProfile()
      .then((res) => {
        const data = res?.data || res || defaultProfile;
        if (active) setProfile({ ...defaultProfile, ...data });
      })
      .catch(() => {
        if (active) setProfile(defaultProfile);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const completion = useMemo(() => {
    const fields = ['organizationName', 'organizationType', 'industry', 'description', 'website', 'email', 'phone', 'location'];
    const done = fields.filter((field) => !!profile[field]).length;
    return Math.round((done / fields.length) * 100);
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      await employerService.updateProfile(profile);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout navItems={EMPLOYER_NAV} title="Organization Profile"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={EMPLOYER_NAV} title="Organization Profile">
      <div className="space-y-6">
        <SectionCard
          title="Organization profile"
          subtitle="Manage the public information employers and applicants see"
          action={<span className="text-sm text-text-light">Profile completion: {completion}%</span>}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Organization name</label>
                <input name="organizationName" value={profile.organizationName} onChange={handleChange} className="input-field" placeholder="Rwanda Career Hub" />
              </div>
              <div>
                <label className="form-label">Organization type</label>
                <select name="organizationType" value={profile.organizationType} onChange={handleChange} className="input-field">
                  {ORGANIZATION_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Industry</label>
                <input name="industry" value={profile.industry} onChange={handleChange} className="input-field" placeholder="Technology, Education, NGO" />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input name="location" value={profile.location} onChange={handleChange} className="input-field" placeholder="Kigali, Rwanda" />
              </div>
              <div>
                <label className="form-label">Official email</label>
                <input type="email" name="email" value={profile.email} onChange={handleChange} className="input-field" placeholder="info@company.rw" />
              </div>
              <div>
                <label className="form-label">Phone number</label>
                <input name="phone" value={profile.phone} onChange={handleChange} className="input-field" placeholder="+250 788 000 000" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Website</label>
                <input name="website" value={profile.website} onChange={handleChange} className="input-field" placeholder="https://company.rw" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Description</label>
                <textarea name="description" value={profile.description} onChange={handleChange} className="input-field min-h-[120px]" placeholder="Tell candidates what your organization does and the kind of talent you hire." />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
              <Link to="/employer/dashboard" className="btn-secondary">Back to dashboard</Link>
            </div>
          </form>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}

export function EmployerVerificationPage() {
  const [org, setOrg] = useState({ organizationName: '', verificationStatus: 'pending' });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let active = true;

    employerService.getProfile()
      .then((res) => {
        if (active) setOrg(res?.data || res || { organizationName: '', verificationStatus: 'pending' });
      })
      .catch(() => {
        if (active) setOrg({ organizationName: '', verificationStatus: 'pending' });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('documentType', 'registration');
    formData.append('document', file);
    setUploading(true);

    try {
      await employerService.submitVerification(formData);
      const profile = await employerService.getProfile();
      setOrg(profile?.data || profile || org);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  if (loading) return <DashboardLayout navItems={EMPLOYER_NAV} title="Verification Center"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={EMPLOYER_NAV} title="Verification Center">
      <div className="space-y-6">
        <SectionCard
          title="Organization verification"
          subtitle="Submit documents to verify your organization"
          action={<Badge status={org.verificationStatus || 'pending'} label={org.verificationStatus || 'Pending'} />}
        >
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-xl bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-light">Organization</p>
              <p className="mt-2 text-lg font-semibold text-text">{org.organizationName || 'Not yet created'}</p>
            </div>
            <div className="rounded-xl bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-light">Verification status</p>
              <p className="mt-2 text-lg font-semibold text-text">{org.verificationStatus || 'pending'}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-border p-6 bg-background/50">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="text-primary" size={20} />
              <h3 className="font-semibold text-text">Required documents</h3>
            </div>
            <ul className="text-sm text-text-light space-y-2">
              <li>• Business registration certificate</li>
              <li>• Government or institutional identification</li>
              <li>• Authorization letter where applicable</li>
              <li>• Supporting documents requested by the administrator</li>
            </ul>

            <label className="btn-primary mt-5 inline-flex cursor-pointer items-center gap-2">
              <UploadCloud size={16} /> {uploading ? 'Uploading...' : 'Upload verification document'}
              <input type="file" className="hidden" onChange={handleUpload} />
            </label>
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}

export function EmployerOpportunitiesPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    employerService.getOpportunities({ page: 1, limit: 20 })
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : res?.data?.data || [];
        setJobs(data);
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout navItems={EMPLOYER_NAV} title="My Opportunities"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={EMPLOYER_NAV} title="My Opportunities">
      <SectionCard title="Job postings" subtitle="Manage roles your organization is hiring for" action={<Link to="/employer/opportunities/create" className="btn-primary text-sm py-2 px-4 flex items-center gap-2"><Plus size={14} /> Post opportunity</Link>}>
        {jobs.length === 0 ? (
          <EmptyState icon={Briefcase} title="No job postings yet" description="Create your first hiring opportunity to start receiving applications." action={<Link to="/employer/opportunities/create" className="btn-primary py-2 px-5 text-sm">Create opportunity</Link>} />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border text-text-light">
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Applications</th>
                  <th className="pb-3 pr-4">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-text">{job.title}</td>
                    <td className="py-3 pr-4 text-text-light">{job.category?.categoryName || 'General'}</td>
                    <td className="py-3 pr-4"><Badge status={job.status || 'draft'} /></td>
                    <td className="py-3 pr-4 text-text-light">{job._count?.applications || 0}</td>
                    <td className="py-3 pr-4 text-text-light">{job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'TBD'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  );
}

export function EmployerOpportunityCreatePage() {
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    title: '',
    categoryId: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    requiredSkills: '',
    location: '',
    workArrangement: 'remote',
    employmentType: 'full_time',
    salaryMin: '',
    salaryMax: '',
    currency: 'rwf',
    applicationDeadline: '',
  });

  useEffect(() => {
    opportunityService.getCategories()
      .then((res) => {
        const items = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
        setCategories(items);
        if (items[0]) setForm((prev) => ({ ...prev, categoryId: items[0].id }));
      })
      .catch((err) => setFormError(err.response?.data?.message || 'Could not load opportunity categories.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!form.categoryId && !categories.length) {
      setFormError('Please add a category before publishing an opportunity.');
      return;
    }
    if (form.salaryMin !== '' && form.salaryMax !== '' && Number(form.salaryMax) < Number(form.salaryMin)) {
      setFormError('Maximum salary must be greater than or equal to minimum salary.');
      return;
    }

    setSubmitting(true);
    try {
      await opportunityService.createOpportunity({
        ...form,
        categoryId: form.categoryId || categories[0]?.id,
        salaryMin: form.salaryMin === '' ? null : Number(form.salaryMin),
        salaryMax: form.salaryMax === '' ? null : Number(form.salaryMax),
      });
      success('Opportunity submitted and published successfully');
      navigate('/employer/opportunities');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Opportunity could not be submitted.';
      setFormError(message);
      error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout navItems={EMPLOYER_NAV} title="Post Opportunity"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={EMPLOYER_NAV} title="Post Opportunity">
      <SectionCard title="Create a new opportunity" subtitle="Publish an opening for candidates and graduates" action={<Link to="/employer/opportunities" className="btn-secondary text-sm py-2 px-4">Back</Link>}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && <div className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">{formError}</div>}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Opportunity title</label>
              <input name="title" value={form.title} onChange={handleChange} className="input-field" placeholder="Senior Frontend Developer" required />
            </div>
            <div>
              <label className="form-label">Category</label>
              <select name="categoryId" value={form.categoryId} onChange={handleChange} className="input-field" required>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.categoryName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Employment type</label>
              <select name="employmentType" value={form.employmentType} onChange={handleChange} className="input-field">
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="volunteer">Volunteer</option>
              </select>
            </div>
            <div>
              <label className="form-label">Work arrangement</label>
              <select name="workArrangement" value={form.workArrangement} onChange={handleChange} className="input-field">
                <option value="remote">Remote</option>
                <option value="onsite">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Location</label>
              <input name="location" value={form.location} onChange={handleChange} className="input-field" placeholder="Kigali, Rwanda" required />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} className="input-field min-h-[120px]" placeholder="Describe the opportunity and why candidates should apply." required />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Responsibilities</label>
              <textarea name="responsibilities" value={form.responsibilities} onChange={handleChange} className="input-field min-h-[110px]" placeholder="List the core responsibilities for this role." />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Qualifications</label>
              <textarea name="qualifications" value={form.qualifications} onChange={handleChange} className="input-field min-h-[110px]" placeholder="Minimum education and experience requirements." />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Required skills</label>
              <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} className="input-field" placeholder="React, JavaScript, UX writing" />
            </div>
            <div>
              <label className="form-label">Minimum salary</label>
              <input type="number" name="salaryMin" value={form.salaryMin} onChange={handleChange} className="input-field" min="0" />
            </div>
            <div>
              <label className="form-label">Maximum salary</label>
              <input type="number" name="salaryMax" value={form.salaryMax} onChange={handleChange} className="input-field" min="0" />
            </div>
            <div>
              <label className="form-label">Currency</label>
              <select name="currency" value={form.currency} onChange={handleChange} className="input-field">
                <option value="rwf">RWF</option>
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
              </select>
            </div>
            <div>
              <label className="form-label">Application deadline</label>
              <input type="date" name="applicationDeadline" value={form.applicationDeadline} onChange={handleChange} className="input-field" min={new Date().toISOString().slice(0, 10)} required />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={submitting || !categories.length}>{submitting ? 'Submitting...' : 'Submit opportunity'}</button>
            <button type="button" onClick={() => navigate('/employer/opportunities')} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </SectionCard>
    </DashboardLayout>
  );
}

export function EmployerSchedulePage() {
  const upcomingSchedule = [
    { id: 'int-1', title: 'Screening call — Alice Uwimana', time: 'Tue, 10:00 AM', type: 'Interview' },
    { id: 'int-2', title: 'Portfolio review — Jean Ndayisenga', time: 'Wed, 2:30 PM', type: 'Review' },
    { id: 'int-3', title: 'Hiring panel — Product Designer shortlist', time: 'Thu, 9:15 AM', type: 'Panel' },
  ];

  return (
    <DashboardLayout navItems={EMPLOYER_NAV} title="Schedule">
      <div className="space-y-6">
        <SectionCard title="Hiring schedule" subtitle="Track upcoming interviews and review sessions for your team">
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingSchedule.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">{item.type}</span>
                  <CalendarCheck2 size={16} className="text-text-light" />
                </div>
                <p className="font-semibold text-text">{item.title}</p>
                <div className="mt-3 flex items-center gap-2 text-sm text-text-light">
                  <Clock3 size={14} />
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}

export function EmployerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getApplications({ page: 1, limit: 20 })
      .then((res) => {
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : res?.data?.data || [];
        setApplications(data);
      })
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout navItems={EMPLOYER_NAV} title="Applications"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={EMPLOYER_NAV} title="Applications">
      <SectionCard title="Applicants" subtitle="Review candidate submissions across your organization" action={<Link to="/employer/dashboard" className="btn-secondary text-sm py-2 px-4">Dashboard</Link>}>
        {applications.length === 0 ? (
          <EmptyState icon={FileText} title="No applications received" description="Applications will appear here once candidates begin applying to your opportunities." />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead>
                <tr className="border-b border-border text-text-light">
                  <th className="pb-3 pr-4">Applicant</th>
                  <th className="pb-3 pr-4">Opportunity</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => (
                  <tr key={application.id} className="border-b border-border last:border-0">
                    <td className="py-3 pr-4 font-medium text-text"><Link to={`/employer/applications/${application.id}`} className="hover:text-secondary hover:underline">{application.applicant?.fullName || 'Applicant'}</Link></td>
                    <td className="py-3 pr-4 text-text-light">{application.opportunity?.title || 'Opportunity'}</td>
                    <td className="py-3 pr-4"><Badge status={application.applicationStatus || 'submitted'} /></td>
                    <td className="py-3 pr-4 text-text-light">{application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  );
}

export function EmployerApplicationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openingConversation, setOpeningConversation] = useState(false);

  useEffect(() => {
    applicationService.getEmployerApplication(id)
      .then((res) => setApplication(res?.data || res || null))
      .catch(() => setApplication(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <DashboardLayout navItems={EMPLOYER_NAV} title="Application Detail"><PageLoader /></DashboardLayout>;

  if (!application) {
    return (
      <DashboardLayout navItems={EMPLOYER_NAV} title="Application Detail">
        <EmptyState icon={FileText} title="Application not found" description="The record you requested is unavailable or no longer exists." />
      </DashboardLayout>
    );
  }

  const handleMessageApplicant = async () => {
    setOpeningConversation(true);
    try {
      const response = await messageService.startConversation(application.opportunity.id, application.applicant.id);
      const conversationId = response?.data?.id;
      if (conversationId) navigate('/employer/messages', { state: { conversationId } });
    } finally {
      setOpeningConversation(false);
    }
  };

  return (
    <DashboardLayout navItems={EMPLOYER_NAV} title="Application Detail">
      <div className="space-y-6">
        <SectionCard title={application.opportunity?.title || 'Application'} subtitle="Candidate submission details" action={<div className="flex gap-2"><button type="button" onClick={handleMessageApplicant} disabled={openingConversation} className="btn-primary text-sm py-2 px-4">{openingConversation ? 'Opening...' : 'Message applicant'}</button><Link to="/employer/applications" className="btn-secondary text-sm py-2 px-4">Back</Link></div>}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-background p-4"><p className="text-xs uppercase tracking-wide text-text-light">Applicant</p><p className="mt-2 font-semibold text-text">{application.applicant?.fullName || 'Applicant'}</p></div>
            <div className="rounded-xl bg-background p-4"><p className="text-xs uppercase tracking-wide text-text-light">Status</p><p className="mt-2 font-semibold text-text"><Badge status={application.applicationStatus || 'submitted'} /></p></div>
            <div className="rounded-xl bg-background p-4"><p className="text-xs uppercase tracking-wide text-text-light">Submitted</p><p className="mt-2 font-semibold text-text">{application.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'N/A'}</p></div>
            <div className="rounded-xl bg-background p-4"><p className="text-xs uppercase tracking-wide text-text-light">Opportunity</p><p className="mt-2 font-semibold text-text">{application.opportunity?.title || 'Opportunity'}</p></div>
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
