import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, MapPin, Clock, Briefcase } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { opportunityService } from '../../services/api.js';
import { Badge, EmptyState, LoadingSpinner } from '../../components/ui.jsx';
import { debounce } from '../../utils/index.js';

const EMPLOYMENT_TYPES = ['full_time', 'part_time', 'internship', 'contract', 'freelance', 'volunteer'];
const WORK_ARRANGEMENTS = ['remote', 'onsite', 'hybrid'];
const TYPE_LABELS = { full_time: 'Full-time', part_time: 'Part-time', internship: 'Internship', contract: 'Contract', freelance: 'Freelance', volunteer: 'Volunteer' };

function OpportunityCard({ opp }) {
  const daysLeft = Math.ceil((new Date(opp.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24));
  return (
    <Link to={`/opportunities/${opp.id}`} className="bg-white rounded-xl border border-border p-5 hover:shadow-md hover:border-secondary transition-all group block">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-primary bg-opacity-10 flex items-center justify-center text-primary font-bold shrink-0">
          {opp.organization?.organizationName?.slice(0, 2).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-text-light truncate">{opp.organization?.organizationName}</p>
          <h3 className="font-semibold text-text group-hover:text-secondary transition-colors">{opp.title}</h3>
          <p className="text-xs text-text-light mt-0.5">{opp.category?.categoryName}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge status={opp.employmentType} />
        <Badge status={opp.workArrangement} />
      </div>
      <div className="flex items-center justify-between text-xs text-text-light">
        <span className="flex items-center gap-1"><MapPin size={12} />{opp.location}</span>
        <span className={`flex items-center gap-1 font-medium ${daysLeft <= 7 ? 'text-error' : 'text-text-light'}`}>
          <Clock size={12} />{daysLeft > 0 ? `${daysLeft} days left` : 'Closing soon'}
        </span>
      </div>
      {opp._count?.applications > 0 && (
        <p className="text-xs text-text-light mt-2 pt-2 border-t border-border">{opp._count.applications} applicant{opp._count.applications !== 1 ? 's' : ''}</p>
      )}
    </Link>
  );
}

export default function BrowseOpportunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [opportunities, setOpportunities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    employmentType: searchParams.get('employmentType') || '',
    workArrangement: searchParams.get('workArrangement') || '',
    sort: searchParams.get('sort') || 'newest',
    page: Number(searchParams.get('page')) || 1,
  });

  const fetchOpportunities = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(f).filter(([, v]) => v));
      const res = await opportunityService.getOpportunities(params);
      setOpportunities(res.data || []);
      setPagination(res.pagination);
    } catch (_) {
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    opportunityService.getCategories ? opportunityService.getCategories().then((r) => setCategories(r.data || [])).catch(() => {}) : null;
  }, []);

  useEffect(() => { fetchOpportunities(filters); }, [filters]);

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value, page: 1 };
    setFilters(next);
    const params = Object.fromEntries(Object.entries(next).filter(([, v]) => v && v !== 1));
    setSearchParams(params);
  };

  const clearFilters = () => {
    const reset = { q: '', category: '', employmentType: '', workArrangement: '', sort: 'newest', page: 1 };
    setFilters(reset);
    setSearchParams({});
  };

  const hasActiveFilters = filters.category || filters.employmentType || filters.workArrangement;

  return (
    <PublicLayout>
      {/* Header */}
      <div className="bg-primary text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Browse Opportunities</h1>
          <p className="text-white/70 mb-6">Find your next career opportunity in Rwanda</p>
          <div className="flex gap-3">
            <div className="flex-1 relative max-w-2xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light" />
              <input
                value={filters.q}
                onChange={(e) => updateFilter('q', e.target.value)}
                placeholder="Search by title, skill, or company..."
                className="w-full pl-11 pr-4 py-3 rounded-xl text-text bg-white focus:outline-none text-sm"
              />
            </div>
            <button onClick={() => setFiltersOpen(!filtersOpen)} className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${filtersOpen ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              <SlidersHorizontal size={16} /> Filters {hasActiveFilters && <span className="w-2 h-2 bg-accent rounded-full" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filters panel */}
        {filtersOpen && (
          <div className="bg-white rounded-xl border border-border p-5 mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-text">Filters</h3>
              {hasActiveFilters && <button onClick={clearFilters} className="text-sm text-secondary hover:underline flex items-center gap-1"><X size={14} /> Clear all</button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Category</label>
                <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)} className="input-field">
                  <option value="">All Categories</option>
                  {categories.map((c) => <option key={c.id} value={c.categoryName}>{c.categoryName}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Employment Type</label>
                <select value={filters.employmentType} onChange={(e) => updateFilter('employmentType', e.target.value)} className="input-field">
                  <option value="">All Types</option>
                  {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Work Arrangement</label>
                <select value={filters.workArrangement} onChange={(e) => updateFilter('workArrangement', e.target.value)} className="input-field">
                  <option value="">All Arrangements</option>
                  {WORK_ARRANGEMENTS.map((w) => <option key={w} value={w} className="capitalize">{w.charAt(0).toUpperCase() + w.slice(1)}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results header */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-text-light text-sm">
            {loading ? 'Loading...' : `${pagination?.total ?? 0} opportunities found`}
          </p>
          <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)} className="input-field w-auto text-sm py-1.5">
            <option value="newest">Most Recent</option>
            <option value="deadline">Closing Soon</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size={36} /></div>
        ) : opportunities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {opportunities.map((opp) => <OpportunityCard key={opp.id} opp={opp} />)}
            </div>
            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => updateFilter('page', p)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === filters.page ? 'bg-primary text-white' : 'bg-white border border-border text-text hover:border-secondary'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Briefcase}
            title="No opportunities found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={hasActiveFilters && <button onClick={clearFilters} className="btn-secondary py-2 px-6">Clear Filters</button>}
          />
        )}
      </div>
    </PublicLayout>
  );
}
