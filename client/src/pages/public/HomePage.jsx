import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Briefcase, GraduationCap, Users, Building2, ArrowRight, CheckCircle, Star, BookOpen, Globe, Shield, Zap, MapPin, Clock } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { opportunityService } from '../../services/api.js';
import { Badge, LoadingSpinner } from '../../components/ui.jsx';
import { formatDate, truncateText } from '../../utils/index.js';

const CATEGORIES = [
  { name: 'Full-time Jobs', icon: Briefcase, color: 'bg-blue-50 text-blue-600', count: null },
  { name: 'Internships', icon: GraduationCap, color: 'bg-teal-50 text-teal-600', count: null },
  { name: 'Graduate Programs', icon: Star, color: 'bg-purple-50 text-purple-600', count: null },
  { name: 'Remote Jobs', icon: Globe, color: 'bg-green-50 text-green-600', count: null },
  { name: 'Training', icon: BookOpen, color: 'bg-orange-50 text-orange-600', count: null },
  { name: 'Scholarships', icon: Shield, color: 'bg-pink-50 text-pink-600', count: null },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up and build a professional profile with your education, skills, and experience.' },
  { step: '02', title: 'Discover Opportunities', desc: 'Browse and search thousands of jobs, internships, and programs across Rwanda.' },
  { step: '03', title: 'Apply with One Click', desc: 'Submit your application directly through the platform with your saved CV.' },
  { step: '04', title: 'Track Your Progress', desc: 'Monitor application status and receive real-time notifications from employers.' },
];



function OpportunityCard({ opp }) {
  const daysLeft = Math.ceil((new Date(opp.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24));
  return (
    <Link to={`/opportunities/${opp.id}`} className="bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-secondary transition-all group">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
          {opp.organization?.organizationName?.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-text-light truncate">{opp.organization?.organizationName}</p>
          <h3 className="font-semibold text-text group-hover:text-secondary transition-colors truncate">{opp.title}</h3>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge status={opp.employmentType} />
        <Badge status={opp.workArrangement} />
      </div>
      <div className="flex items-center justify-between text-xs text-text-light">
        <span className="flex items-center gap-1"><MapPin size={12} />{opp.location}</span>
        <span className={`flex items-center gap-1 ${daysLeft <= 7 ? 'text-error' : ''}`}>
          <Clock size={12} />{daysLeft > 0 ? `${daysLeft}d left` : 'Closing soon'}
        </span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [opportunities, setOpportunities] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      opportunityService.getOpportunities({ limit: 6, status: 'published' }),
      opportunityService.getCategories(),
    ])
      .then(([opportunitiesResponse, categoriesResponse]) => {
        setOpportunities(opportunitiesResponse.data || []);
        setCategoryCounts(Object.fromEntries(
          (categoriesResponse.data || []).map((category) => [
            category.categoryName,
            category._count?.opportunities || 0,
          ])
        ));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/opportunities${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`);
  };

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-primary via-primary to-[#1a3a5c] text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm mb-6">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            Rwanda's #1 Career Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
            Your Next Opportunity<br />
            <span className="text-accent">Starts Here</span>
          </h1>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Connecting Rwandan students, graduates, and professionals with top employers, internships, and career development opportunities.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-8">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, internships, companies..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-text bg-white focus:outline-none focus:ring-2 focus:ring-accent text-sm"
              />
            </div>
            <button type="submit" className="bg-accent hover:bg-teal-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors whitespace-nowrap">
              Search Jobs
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-3 text-sm text-white/70">
            {['Software Developer', 'Internship', 'Graduate Program', 'Remote'].map((tag) => (
              <button key={tag} onClick={() => navigate(`/opportunities?q=${tag}`)} className="hover:text-accent transition-colors">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white border-b border-border py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '500+', label: 'Opportunities', icon: Briefcase },
            { value: '200+', label: 'Employers', icon: Building2 },
            { value: '5,000+', label: 'Job Seekers', icon: Users },
            { value: '50+', label: 'Districts Covered', icon: MapPin },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-primary">{s.value}</p>
              <p className="text-text-light text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Browse by Category ── */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">Explore</p>
            <h2 className="text-3xl font-bold text-primary">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} to={`/opportunities?category=${encodeURIComponent(cat.name)}`}
                className="bg-white rounded-xl p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all border border-border group">
                <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mx-auto mb-3`}>
                  <cat.icon size={22} />
                </div>
                <p className="text-sm font-semibold text-text group-hover:text-secondary transition-colors">{cat.name}</p>
                <p className="text-xs text-text-light mt-1">
                  {categoryCounts[cat.name] ?? 0} {categoryCounts[cat.name] === 1 ? 'opportunity' : 'opportunities'}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Opportunities ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">Latest</p>
              <h2 className="text-3xl font-bold text-primary">Recent Opportunities</h2>
            </div>
            <Link to="/opportunities" className="hidden sm:flex items-center gap-1 text-secondary font-medium hover:gap-2 transition-all text-sm">
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><LoadingSpinner size={32} /></div>
          ) : opportunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {opportunities.map((opp) => <OpportunityCard key={opp.id} opp={opp} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-text-light">
              <Briefcase size={40} className="mx-auto mb-3 opacity-30" />
              <p>Opportunities will appear here once published.</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/opportunities" className="btn-primary inline-flex items-center gap-2 py-3 px-8">
              Browse All Opportunities <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">Simple Process</p>
            <h2 className="text-3xl font-bold text-primary">How CareerBridge Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border z-0" style={{ width: 'calc(100% - 2rem)' }} />
                )}
                <div className="bg-white rounded-xl p-6 border border-border relative z-10">
                  <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-lg mb-4">{step.step}</div>
                  <h3 className="font-semibold text-text mb-2">{step.title}</h3>
                  <p className="text-text-light text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose CareerBridge ── */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-secondary text-sm font-semibold uppercase tracking-wider mb-2">Why Us</p>
            <h2 className="text-3xl font-bold text-primary">Why Choose CareerBridge</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: 'Verified Employers', desc: 'All organizations are verified before posting. No scams, no fake listings.' },
              { icon: Zap, title: 'Fast Applications', desc: 'Apply in minutes with your saved profile and CV. No repetitive forms.' },
              { icon: CheckCircle, title: 'Real-time Updates', desc: 'Get notified instantly when your application status changes.' },
              { icon: Users, title: 'Rwanda Focused', desc: 'Built specifically for the Rwandan job market and talent pool.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-xl border border-border hover:border-secondary transition-colors">
                <div className="w-11 h-11 bg-secondary bg-opacity-10 rounded-xl flex items-center justify-center shrink-0">
                  <item.icon size={20} className="text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text mb-1">{item.title}</h3>
                  <p className="text-text-light text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Employers ── */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-accent text-sm font-semibold uppercase tracking-wider mb-3">For Employers</p>
            <h2 className="text-3xl font-bold mb-4">Find the Right Talent Faster</h2>
            <p className="text-white/70 mb-6 leading-relaxed">
              Post opportunities, receive applications, shortlist candidates, and communicate with applicants — all in one place. Reach thousands of qualified Rwandan professionals.
            </p>
            <ul className="space-y-3 mb-8">
              {['Post jobs and internships in minutes', 'Receive and manage applications', 'Shortlist and communicate with candidates', 'Track recruitment analytics'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle size={16} className="text-accent shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="inline-flex items-center gap-2 bg-accent hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
              Register as Employer <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '200+', label: 'Active Employers' },
              { value: '95%', label: 'Satisfaction Rate' },
              { value: '48h', label: 'Avg. Time to Hire' },
              { value: '10K+', label: 'Applications/Month' },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 rounded-xl p-5 text-center">
                <p className="text-3xl font-bold text-accent">{s.value}</p>
                <p className="text-white/70 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">Ready to Start Your Journey?</h2>
          <p className="text-text-light mb-8">Join thousands of professionals who found their dream opportunity through CareerBridge.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2 py-3 px-8 text-base">
              Create Free Account <ArrowRight size={16} />
            </Link>
            <Link to="/opportunities" className="btn-secondary inline-flex items-center justify-center gap-2 py-3 px-8 text-base">
              Browse Opportunities
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
