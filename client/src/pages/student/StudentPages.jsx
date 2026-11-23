import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BookOpen, Briefcase, FileText, Plus, Star, Bookmark, ArrowRight, Search, Save, PencilLine, UploadCloud } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { STUDENT_NAV } from '../../constants/nav.js';
import { PageLoader, EmptyState, Badge } from '../../components/ui.jsx';
import { studentService, savedOpportunitiesService, applicationService, opportunityService } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/NotificationContext.jsx';

const DEFAULT_PROFILE = {
  fullName: 'Aline Uwimana',
  email: 'aline.uwimana@email.com',
  phone: '+250 788 123 456',
  location: 'Kigali, Rwanda',
  headline: 'Frontend Developer & Product Designer',
  bio: 'I am a passionate graduate in software engineering with experience building accessible web apps and user-facing products for small businesses.',
  linkedin: 'https://linkedin.com/in/alineuwimana',
  portfolio: 'https://alineuwimana.dev',
};

const DEFAULT_EDUCATION = [
  {
    id: 'edu-1',
    institution: 'University of Rwanda',
    qualification: 'BSc in Computer Science',
    fieldOfStudy: 'Software Engineering',
    startDate: '2019-09-01',
    endDate: '2023-07-01',
    description: 'Focused on software architecture, databases, and full-stack development.',
  },
];

const DEFAULT_EXPERIENCE = [
  {
    id: 'exp-1',
    organization: 'TechBridge Studio',
    jobTitle: 'Frontend Developer Intern',
    employmentType: 'internship',
    startDate: '2023-02-01',
    endDate: '2023-08-01',
    description: 'Built responsive interfaces and improved user journeys for business clients.',
  },
];

const DEFAULT_SKILLS = [
  { id: 'skill-1', skillName: 'React', proficiencyLevel: 'advanced' },
  { id: 'skill-2', skillName: 'JavaScript', proficiencyLevel: 'advanced' },
  { id: 'skill-3', skillName: 'UI/UX Design', proficiencyLevel: 'intermediate' },
  { id: 'skill-4', skillName: 'Node.js', proficiencyLevel: 'intermediate' },
];

const DEFAULT_CV = [
  { id: 'cv-1', fileName: 'Aline_Uwimana_CV.pdf', isDefault: true, uploadedAt: '2026-11-01T12:00:00.000Z' },
];

const DEFAULT_SAVED_JOBS = [
  { id: 'saved-1', title: 'Frontend Engineer', organizationName: 'Nile Labs', employmentType: 'full_time' },
  { id: 'saved-2', title: 'Junior Product Designer', organizationName: 'Motive Studio', employmentType: 'part_time' },
];

const DEFAULT_APPLICATIONS = [
  { id: 'app-1', applicationStatus: 'submitted', opportunity: { title: 'Frontend Developer', organization: { organizationName: 'Nile Labs' } } },
  { id: 'app-2', applicationStatus: 'under_review', opportunity: { title: 'UI/UX Designer', organization: { organizationName: 'Motive Studio' } } },
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

function normalizeProfile(data = {}, user = null) {
  const nested = data.studentProfile || {};
  return {
    fullName: data.fullName || nested.fullName || user?.fullName || DEFAULT_PROFILE.fullName,
    email: data.email || user?.email || DEFAULT_PROFILE.email,
    phone: data.phone || nested.phone || DEFAULT_PROFILE.phone,
    location: data.location || nested.location || DEFAULT_PROFILE.location,
    headline: data.headline || nested.headline || DEFAULT_PROFILE.headline,
    bio: data.biography || data.bio || nested.biography || DEFAULT_PROFILE.bio,
    linkedin: data.linkedinUrl || nested.linkedinUrl || DEFAULT_PROFILE.linkedin,
    portfolio: data.portfolioUrl || nested.portfolioUrl || DEFAULT_PROFILE.portfolio,
  };
}

export function StudentProfilePage() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(normalizeProfile({}, user));
  const [form, setForm] = useState(normalizeProfile({}, user));
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const res = await studentService.getProfile();
        const data = res?.data || res || {};
        const next = normalizeProfile(data, user);
        if (mounted) {
          setProfile(next);
          setForm(next);
        }
      } catch (error) {
        const fallback = normalizeProfile({}, user);
        if (mounted) {
          setProfile(fallback);
          setForm(fallback);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProfile();
    return () => { mounted = false; };
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        fullName: form.fullName,
        phone: form.phone,
        headline: form.headline,
        biography: form.bio,
        location: form.location,
        linkedinUrl: form.linkedin,
        portfolioUrl: form.portfolio,
      };

      await studentService.updateProfile(payload);
      const next = normalizeProfile({ ...profile, ...form }, user);
      setProfile(next);
      setForm(next);
      updateUser({ ...user, fullName: form.fullName, phone: form.phone });
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const next = normalizeProfile({ ...profile, ...form }, user);
      setProfile(next);
      setForm(next);
      setEditing(false);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="My Profile"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={STUDENT_NAV} title="My Profile">
      <div className="space-y-6">
        <SectionCard
          title="Profile Overview"
          subtitle="Personal information and account details"
          action={
            <button type="button" onClick={() => setEditing((prev) => !prev)} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
              <PencilLine size={14} /> {editing ? 'Cancel' : 'Edit profile'}
            </button>
          }
        >
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input value={form.email} disabled className="input-field" />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="form-label">Location</label>
                  <input name="location" value={form.location} onChange={handleChange} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">Headline</label>
                  <input name="headline" value={form.headline} onChange={handleChange} className="input-field" />
                </div>
                <div className="md:col-span-2">
                  <label className="form-label">About Me</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} className="input-field min-h-[120px]" />
                </div>
                <div>
                  <label className="form-label">LinkedIn</label>
                  <input name="linkedin" value={form.linkedin} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="form-label">Portfolio</label>
                  <input name="portfolio" value={form.portfolio} onChange={handleChange} className="input-field" />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save profile'}</button>
                <button type="button" onClick={() => { setForm(profile); setEditing(false); }} className="btn-secondary">Discard</button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs uppercase tracking-wide text-text-light">Full Name</p>
                  <p className="mt-2 text-lg font-semibold text-text">{profile.fullName}</p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs uppercase tracking-wide text-text-light">Email</p>
                  <p className="mt-2 text-lg font-semibold text-text">{profile.email}</p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs uppercase tracking-wide text-text-light">Phone</p>
                  <p className="mt-2 text-lg font-semibold text-text">{profile.phone}</p>
                </div>
                <div className="rounded-xl bg-background p-4">
                  <p className="text-xs uppercase tracking-wide text-text-light">Location</p>
                  <p className="mt-2 text-lg font-semibold text-text">{profile.location}</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-background p-4">
                <p className="text-xs uppercase tracking-wide text-text-light mb-2">Headline</p>
                <p className="text-lg font-semibold text-text">{profile.headline}</p>
              </div>
            </>
          )}
        </SectionCard>

        <SectionCard title="About Me" subtitle="Tell employers more about yourself">
          <p className="text-text-light whitespace-pre-line">{profile.bio}</p>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}

export function StudentEducationPage() {
  const [education, setEducation] = useState(DEFAULT_EDUCATION);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ institution: '', qualification: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' });

  useEffect(() => {
    const loadEducation = async () => {
      try {
        const res = await studentService.getEducation();
        const data = (res?.data || res || []).length ? res?.data || res : DEFAULT_EDUCATION;
        setEducation(data);
      } catch (error) {
        setEducation(DEFAULT_EDUCATION);
      } finally {
        setLoading(false);
      }
    };

    loadEducation();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    const payload = {
      institution: form.institution || 'University of Rwanda',
      qualification: form.qualification || 'BSc in Computer Science',
      fieldOfStudy: form.fieldOfStudy || 'Software Engineering',
      startDate: form.startDate || '2020-01-01',
      endDate: form.endDate || '2024-01-01',
      description: form.description || 'Graduate studies and coursework.',
    };

    try {
      const res = await studentService.addEducation(payload);
      const nextItem = res?.data || { id: `edu-${Date.now()}`, ...payload };
      setEducation((prev) => [nextItem, ...prev]);
    } catch (error) {
      const fallbackItem = { id: `edu-${Date.now()}`, ...payload };
      setEducation((prev) => [fallbackItem, ...prev]);
    }

    setForm({ institution: '', qualification: '', fieldOfStudy: '', startDate: '', endDate: '', description: '' });
    setEditing(false);
  };

  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="Education"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={STUDENT_NAV} title="Education">
      <SectionCard
        title="Education"
        subtitle="Add your schools, qualifications, and academic background"
        action={<button type="button" onClick={() => setEditing((prev) => !prev)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2"><Plus size={14} /> {editing ? 'Close' : 'Add education'}</button>}
      >
        {editing && (
          <form onSubmit={handleAdd} className="mb-5 space-y-4 border border-border rounded-xl p-4 bg-background/40">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Institution</label>
                <input name="institution" value={form.institution} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="form-label">Qualification</label>
                <input name="qualification" value={form.qualification} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="form-label">Field of Study</label>
                <input name="fieldOfStudy" value={form.fieldOfStudy} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="form-label">Start Date</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="form-label">End Date</label>
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="input-field min-h-[100px]" />
              </div>
            </div>
            <button type="submit" className="btn-primary">Save education</button>
          </form>
        )}

        {education.length === 0 ? (
          <EmptyState icon={BookOpen} title="No education added yet" description="Add your latest qualifications and academic history to improve your profile." />
        ) : (
          <div className="space-y-3">
            {education.map((item) => (
              <div key={item.id} className="border border-border rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text">{item.institution || 'Institution'}</p>
                    <p className="text-sm text-text-light">{item.qualification || item.degree || item.program || 'Qualification'}</p>
                  </div>
                  <Badge status="verified" label="Active" />
                </div>
                <p className="text-sm text-text-light mt-2">{item.fieldOfStudy || 'Field of study'} • {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'} to {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Present'}</p>
                {item.description && <p className="text-sm text-text-light mt-2">{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  );
}

export function StudentExperiencePage() {
  const [experience, setExperience] = useState(DEFAULT_EXPERIENCE);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ organization: '', jobTitle: '', employmentType: 'full_time', startDate: '', endDate: '', description: '' });

  useEffect(() => {
    const loadExperience = async () => {
      try {
        const res = await studentService.getExperience();
        const data = (res?.data || res || []).length ? res?.data || res : DEFAULT_EXPERIENCE;
        setExperience(data);
      } catch (error) {
        setExperience(DEFAULT_EXPERIENCE);
      } finally {
        setLoading(false);
      }
    };

    loadExperience();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    const payload = {
      organization: form.organization || 'TechBridge Studio',
      jobTitle: form.jobTitle || 'Frontend Developer',
      employmentType: form.employmentType || 'full_time',
      startDate: form.startDate || '2023-02-01',
      endDate: form.endDate || '2024-02-01',
      description: form.description || 'Created and maintained business-facing frontend interfaces.',
    };

    try {
      const res = await studentService.addExperience(payload);
      const nextItem = res?.data || { id: `exp-${Date.now()}`, ...payload };
      setExperience((prev) => [nextItem, ...prev]);
    } catch (error) {
      setExperience((prev) => [{ id: `exp-${Date.now()}`, ...payload }, ...prev]);
    }

    setForm({ organization: '', jobTitle: '', employmentType: 'full_time', startDate: '', endDate: '', description: '' });
    setEditing(false);
  };

  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="Experience"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={STUDENT_NAV} title="Experience">
      <SectionCard
        title="Work Experience"
        subtitle="Showcase your career journey and practical skills"
        action={<button type="button" onClick={() => setEditing((prev) => !prev)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2"><Plus size={14} /> {editing ? 'Close' : 'Add role'}</button>}
      >
        {editing && (
          <form onSubmit={handleAdd} className="mb-5 space-y-4 border border-border rounded-xl p-4 bg-background/40">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Organization</label>
                <input name="organization" value={form.organization} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="form-label">Job Title</label>
                <input name="jobTitle" value={form.jobTitle} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="form-label">Employment Type</label>
                <select name="employmentType" value={form.employmentType} onChange={handleChange} className="input-field">
                  <option value="full_time">Full-time</option>
                  <option value="part_time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
              <div>
                <label className="form-label">Start Date</label>
                <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="form-label">End Date</label>
                <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="input-field" />
              </div>
              <div className="md:col-span-2">
                <label className="form-label">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} className="input-field min-h-[100px]" />
              </div>
            </div>
            <button type="submit" className="btn-primary">Save experience</button>
          </form>
        )}

        {experience.length === 0 ? (
          <EmptyState icon={Briefcase} title="No experience yet" description="Add internships, roles, or volunteer work to tell employers more about your background." />
        ) : (
          <div className="space-y-3">
            {experience.map((item) => (
              <div key={item.id} className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text">{item.jobTitle || item.position || 'Position'}</p>
                    <p className="text-sm text-text-light">{item.organization || item.company || 'Company'}</p>
                  </div>
                  <Badge status="published" label="Experience" />
                </div>
                <p className="text-sm text-text-light mt-2">{item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'} to {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'Present'}</p>
                {item.description && <p className="text-sm text-text-light mt-2">{item.description}</p>}
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  );
}

export function StudentSkillsPage() {
  const [skills, setSkills] = useState(DEFAULT_SKILLS);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ skillName: '', proficiencyLevel: 'intermediate' });

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const res = await studentService.getSkills();
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : DEFAULT_SKILLS;
        setSkills(data.length ? data : DEFAULT_SKILLS);
      } catch (error) {
        setSkills(DEFAULT_SKILLS);
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  const handleAdd = async (event) => {
    event.preventDefault();
    const payload = { skillName: form.skillName || 'React', proficiencyLevel: form.proficiencyLevel || 'intermediate' };

    try {
      const res = await studentService.addSkill(payload);
      const nextItem = res?.data || { id: `skill-${Date.now()}`, skillName: payload.skillName, proficiencyLevel: payload.proficiencyLevel };
      setSkills((prev) => [nextItem, ...prev]);
    } catch (error) {
      setSkills((prev) => [{ id: `skill-${Date.now()}`, skillName: payload.skillName, proficiencyLevel: payload.proficiencyLevel }, ...prev]);
    }

    setForm({ skillName: '', proficiencyLevel: 'intermediate' });
    setEditing(false);
  };

  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="Skills"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={STUDENT_NAV} title="Skills">
      <SectionCard
        title="Skills"
        subtitle="Highlight the strengths you bring to employers"
        action={<button type="button" onClick={() => setEditing((prev) => !prev)} className="btn-primary text-sm py-2 px-4 flex items-center gap-2"><Plus size={14} /> {editing ? 'Close' : 'Add skill'}</button>}
      >
        {editing && (
          <form onSubmit={handleAdd} className="mb-5 space-y-4 border border-border rounded-xl p-4 bg-background/40">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Skill Name</label>
                <input value={form.skillName} onChange={(event) => setForm({ ...form, skillName: event.target.value })} className="input-field" />
              </div>
              <div>
                <label className="form-label">Proficiency</label>
                <select value={form.proficiencyLevel} onChange={(event) => setForm({ ...form, proficiencyLevel: event.target.value })} className="input-field">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn-primary">Save skill</button>
          </form>
        )}

        {skills.length === 0 ? (
          <EmptyState icon={Star} title="No skills added yet" description="List technical and soft skills that match your career goals." />
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id || skill.skillName} className="badge badge-primary">{skill.skillName || skill.name || skill.skill?.skillName}</span>
            ))}
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  );
}

export function StudentCVsPage() {
  const [cvs, setCvs] = useState(DEFAULT_CV);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadCVs = async () => {
      try {
        const res = await studentService.getCVs();
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : DEFAULT_CV;
        setCvs(data.length ? data : DEFAULT_CV);
      } catch (error) {
        setCvs(DEFAULT_CV);
      } finally {
        setLoading(false);
      }
    };

    loadCVs();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cv', file);
    setUploading(true);

    try {
      const res = await studentService.uploadCV(formData);
      const nextItem = res?.data || { id: `cv-${Date.now()}`, fileName: file.name, isDefault: false, uploadedAt: new Date().toISOString() };
      setCvs((prev) => [nextItem, ...prev]);
    } catch (error) {
      setCvs((prev) => [{ id: `cv-${Date.now()}`, fileName: file.name, isDefault: prev.length === 0, uploadedAt: new Date().toISOString() }, ...prev]);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="My CVs"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={STUDENT_NAV} title="My CVs">
      <SectionCard
        title="CVs & Documents"
        subtitle="Upload and manage the documents employers review"
        action={
          <label className="btn-primary text-sm py-2 px-4 flex items-center gap-2 cursor-pointer">
            <UploadCloud size={14} /> {uploading ? 'Uploading...' : 'Upload CV'}
            <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleUpload} />
          </label>
        }
      >
        {cvs.length === 0 ? (
          <EmptyState icon={FileText} title="No CV uploaded" description="Upload your CV so employers can view your qualifications quickly." />
        ) : (
          <div className="space-y-3">
            {cvs.map((cv) => (
              <div key={cv.id} className="border border-border rounded-xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-text">{cv.fileName || 'CV Document'}</p>
                  <p className="text-sm text-text-light">Updated {cv.uploadedAt ? new Date(cv.uploadedAt).toLocaleDateString() : 'recently'}</p>
                </div>
                <Badge status="verified" label={cv.isDefault ? 'Default' : 'Saved'} />
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  );
}

export function StudentSavedJobsPage() {
  const [jobs, setJobs] = useState(DEFAULT_SAVED_JOBS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSavedJobs = async () => {
      try {
        const res = await savedOpportunitiesService.getSaved();
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : DEFAULT_SAVED_JOBS;
        setJobs(data.length ? data : DEFAULT_SAVED_JOBS);
      } catch (error) {
        setJobs(DEFAULT_SAVED_JOBS);
      } finally {
        setLoading(false);
      }
    };

    loadSavedJobs();
  }, []);

  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="Saved Jobs"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={STUDENT_NAV} title="Saved Jobs">
      <SectionCard title="Saved Jobs" subtitle="Keep track of opportunities you want to review later" action={<Link to="/opportunities" className="btn-secondary text-sm py-2 px-4 flex items-center gap-2"><Search size={14} /> Browse jobs</Link>}>
        {jobs.length === 0 ? (
          <EmptyState icon={Bookmark} title="No saved jobs" description="Save the roles that match your goals and revisit them anytime." action={<Link to="/opportunities" className="btn-primary py-2 px-5 text-sm">Browse opportunities</Link>} />
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Link key={job.id} to={`/opportunities/${job.opportunityId || job.id}`} className="block border border-border rounded-xl p-4 hover:border-secondary transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text">{job.title || job.opportunity?.title || 'Job title'}</p>
                    <p className="text-sm text-text-light">{job.organizationName || job.opportunity?.organization?.organizationName || 'Organization'}</p>
                  </div>
                  <Badge status={job.employmentType || 'full_time'} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  );
}

export function StudentApplicationsPage() {
  const [applications, setApplications] = useState(DEFAULT_APPLICATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const res = await applicationService.getMyApplications();
        const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : DEFAULT_APPLICATIONS;
        setApplications(data.length ? data : DEFAULT_APPLICATIONS);
      } catch (error) {
        setApplications(DEFAULT_APPLICATIONS);
      } finally {
        setLoading(false);
      }
    };

    loadApps();
  }, []);

  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="My Applications"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={STUDENT_NAV} title="My Applications">
      <SectionCard title="Applications" subtitle="Track every opportunity you have applied for" action={<Link to="/opportunities" className="btn-primary text-sm py-2 px-4 flex items-center gap-2"><ArrowRight size={14} /> Explore jobs</Link>}>
        {applications.length === 0 ? (
          <EmptyState icon={FileText} title="No applications yet" description="Apply for jobs and your status updates will appear here." action={<Link to="/opportunities" className="btn-primary py-2 px-5 text-sm">Browse jobs</Link>} />
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <Link key={app.id} to={`/student/applications/${app.id}`} className="block border border-border rounded-xl p-4 hover:border-secondary transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-text">{app.opportunity?.title || 'Opportunity'}</p>
                    <p className="text-sm text-text-light">{app.opportunity?.organization?.organizationName || 'Organization'}</p>
                  </div>
                  <Badge status={app.applicationStatus || 'submitted'} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </SectionCard>
    </DashboardLayout>
  );
}

export function StudentApplicationDetailPage() {
  const { id } = useParams();
  const [application, setApplication] = useState({
    id,
    applicationStatus: 'under_review',
    submittedAt: '2026-11-10T12:00:00.000Z',
    opportunity: {
      title: 'Frontend Developer',
      location: 'Kigali, Rwanda',
      organization: { organizationName: 'Nile Labs' },
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApp = async () => {
      try {
        const res = await applicationService.getApplication(id);
        setApplication(res?.data || {
          id,
          applicationStatus: 'under_review',
          submittedAt: '2026-11-10T12:00:00.000Z',
          opportunity: {
            title: 'Frontend Developer',
            location: 'Kigali, Rwanda',
            organization: { organizationName: 'Nile Labs' },
          },
        });
      } catch (error) {
        setApplication({
          id,
          applicationStatus: 'under_review',
          submittedAt: '2026-11-10T12:00:00.000Z',
          opportunity: {
            title: 'Frontend Developer',
            location: 'Kigali, Rwanda',
            organization: { organizationName: 'Nile Labs' },
          },
        });
      } finally {
        setLoading(false);
      }
    };

    loadApp();
  }, [id]);

  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="Application Details"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={STUDENT_NAV} title="Application Details">
      <div className="space-y-6">
        <SectionCard title={application?.opportunity?.title || 'Application Details'} subtitle="Review your submission and current status" action={<Link to="/student/applications" className="btn-secondary text-sm py-2 px-4">Back to applications</Link>}>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-light">Organization</p>
              <p className="mt-2 font-semibold text-text">{application?.opportunity?.organization?.organizationName || 'Employer'}</p>
            </div>
            <div className="rounded-xl bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-light">Status</p>
              <p className="mt-2 font-semibold text-text"><Badge status={application?.applicationStatus || 'submitted'} /></p>
            </div>
            <div className="rounded-xl bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-light">Submitted</p>
              <p className="mt-2 font-semibold text-text">{application?.submittedAt ? new Date(application.submittedAt).toLocaleDateString() : 'Not available'}</p>
            </div>
            <div className="rounded-xl bg-background p-4">
              <p className="text-xs uppercase tracking-wide text-text-light">Location</p>
              <p className="mt-2 font-semibold text-text">{application?.opportunity?.location || 'Remote / On-site'}</p>
            </div>
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}

export function StudentApplyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [opportunity, setOpportunity] = useState(null);
  const [cvs, setCvs] = useState([]);
  const [cvId, setCvId] = useState('');
  const [formError, setFormError] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  useEffect(() => {
    let active = true;
    Promise.all([opportunityService.getOpportunity(id), studentService.getCVs()])
      .then(([opportunityResponse, cvResponse]) => {
        if (!active) return;
        const availableCVs = Array.isArray(cvResponse?.data) ? cvResponse.data : [];
        setOpportunity(opportunityResponse?.data || null);
        setCvs(availableCVs);
        setCvId(availableCVs.find((cv) => cv.isDefault)?.id || availableCVs[0]?.id || '');
      })
      .catch((err) => {
        if (active) {
          const message = err.response?.data?.message || 'We could not load this opportunity or your CVs. Please try again.';
          setFormError(message);
        }
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!cvId) {
      setFormError('Upload and select a CV before submitting your application.');
      return;
    }
    setSubmitting(true);
    setFormError('');

    try {
      const response = await applicationService.submit({ opportunityId: id, cvId, coverLetter });
      const conversationId = response?.data?.conversationId;
      success('Application submitted successfully');
      navigate(conversationId ? '/student/messages' : '/student/applications', {
        state: conversationId ? { conversationId } : undefined,
      });
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Your application could not be submitted.';
      setFormError(message);
      error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout navItems={STUDENT_NAV} title="Apply for Opportunity"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={STUDENT_NAV} title="Apply for Opportunity">
      <div className="max-w-2xl mx-auto">
        <SectionCard title="Application form" subtitle={opportunity ? `You are applying for ${opportunity.title} at ${opportunity.organization?.organizationName || 'this organization'}` : 'You are applying for an opportunity'} action={<Link to="/opportunities" className="btn-secondary text-sm py-2 px-4">Back</Link>}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <div className="rounded-lg border border-error/30 bg-error/5 px-4 py-3 text-sm text-error">{formError}</div>}
            <div>
              <label className="form-label">CV to submit</label>
              {cvs.length ? (
                <select value={cvId} onChange={(event) => { setCvId(event.target.value); setFormError(''); }} className="input-field" required>
                  {cvs.map((cv) => <option key={cv.id} value={cv.id}>{cv.fileName}{cv.isDefault ? ' (Default)' : ''}</option>)}
                </select>
              ) : (
                <div className="rounded-lg bg-background p-4 text-sm text-text-light">
                  You need a CV before applying. <Link to="/student/cvs" className="text-secondary font-medium hover:underline">Upload a CV</Link>
                </div>
              )}
            </div>
            <div>
              <label className="form-label">Cover letter / first message</label>
              <textarea value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} className="input-field min-h-[140px]" placeholder="Introduce yourself and explain why you’re a good fit..." />
            </div>
            <button type="submit" className="btn-primary" disabled={submitting || !cvs.length}>{submitting ? 'Submitting...' : 'Submit application and message employer'}</button>
          </form>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}