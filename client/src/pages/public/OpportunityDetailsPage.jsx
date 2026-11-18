import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Briefcase, Building2, Globe, ArrowLeft, Bookmark, BookmarkCheck, Share2, CheckCircle, AlertCircle } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { opportunityService, savedOpportunitiesService, messageService } from '../../services/api.js';
import { Badge, LoadingSpinner } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/NotificationContext.jsx';
import { formatDate, formatCurrency } from '../../utils/index.js';

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated, isStudent } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [opp, setOpp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    opportunityService.getOpportunity(id)
      .then((res) => setOpp(res.data))
      .catch(() => setOpp(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !opp) return;
    savedOpportunitiesService.isSaved(opp.id)
      .then((res) => setSaved(res.data?.isSaved || false))
      .catch(() => {});
  }, [isAuthenticated, opp]);

  const handleSave = async () => {
    if (!isAuthenticated) { navigate('/login'); return; }
    setSavingLoading(true);
    try {
      if (saved) {
        await savedOpportunitiesService.unsave(opp.id);
        setSaved(false);
        success('Removed from saved opportunities');
      } else {
        await savedOpportunitiesService.save(opp.id);
        setSaved(true);
        success('Opportunity saved!');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSavingLoading(false);
    }
  };

  const handleApply = () => {
    if (!isAuthenticated) { navigate('/login', { state: { from: `/opportunities/${id}` } }); return; }
    if (!isStudent) { error('Only students and job seekers can apply for opportunities'); return; }
    navigate(`/student/apply/${opp.id}`);
  };

  const handleMessageEmployer = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/opportunities/${id}` } });
      return;
    }
    if (!isStudent) {
      error('Only students and job seekers can start a conversation');
      return;
    }

    try {
      const res = await messageService.startConversation(opp.id);
      const conversationId = res?.data?.id || res?.data?.data?.id;
      if (!conversationId) {
        throw new Error('Unable to create conversation');
      }
      navigate('/student/messages', { state: { conversationId } });
    } catch (err) {
      error(err.response?.data?.message || 'Could not start a conversation with the organization.');
    }
  };

  const daysLeft = opp ? Math.ceil((new Date(opp.applicationDeadline) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  const isExpired = daysLeft <= 0;

  if (loading) return <PublicLayout><div className="flex justify-center py-32"><LoadingSpinner size={40} /></div></PublicLayout>;

  if (!opp) return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <AlertCircle size={48} className="text-error mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text mb-2">Opportunity Not Found</h1>
        <p className="text-text-light mb-6">This opportunity may have been removed or is no longer available.</p>
        <Link to="/opportunities" className="btn-primary inline-flex items-center gap-2 py-2.5 px-6">
          <ArrowLeft size={16} /> Browse Opportunities
        </Link>
      </div>
    </PublicLayout>
  );

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back */}
        <Link to="/opportunities" className="inline-flex items-center gap-1.5 text-text-light hover:text-text text-sm mb-6">
          <ArrowLeft size={16} /> Back to opportunities
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          {/* Main content */}
          <div className="space-y-5">
            {/* Header card */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-primary bg-opacity-10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                  {opp.organization?.organizationName?.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge status={opp.employmentType} />
                    <Badge status={opp.workArrangement} />
                    {opp.category && <span className="badge badge-primary">{opp.category.categoryName}</span>}
                  </div>
                  <h1 className="text-2xl font-bold text-text">{opp.title}</h1>
                  <p className="text-text-light mt-1">{opp.organization?.organizationName}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-text-light border-t border-border pt-4">
                <span className="flex items-center gap-1.5"><MapPin size={15} />{opp.location}</span>
                {opp.salaryMin && (
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={15} />
                    {formatCurrency(opp.salaryMin, opp.currency?.toUpperCase())} – {formatCurrency(opp.salaryMax, opp.currency?.toUpperCase())} / month
                  </span>
                )}
                <span className={`flex items-center gap-1.5 font-medium ${isExpired ? 'text-error' : daysLeft <= 7 ? 'text-warning' : ''}`}>
                  <Clock size={15} />
                  {isExpired ? 'Deadline passed' : `${daysLeft} days left — ${formatDate(opp.applicationDeadline)}`}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold text-text mb-4">About this Opportunity</h2>
              <p className="text-text-light leading-relaxed whitespace-pre-line">{opp.description}</p>
            </div>

            {/* Responsibilities */}
            {opp.responsibilities && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-text mb-4">Responsibilities</h2>
                <ul className="space-y-2">
                  {opp.responsibilities.split('\n').filter(Boolean).map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-light text-sm">
                      <CheckCircle size={16} className="text-success mt-0.5 shrink-0" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qualifications */}
            {opp.qualifications && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-text mb-4">Qualifications & Requirements</h2>
                <ul className="space-y-2">
                  {opp.qualifications.split('\n').filter(Boolean).map((q, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-light text-sm">
                      <CheckCircle size={16} className="text-secondary mt-0.5 shrink-0" /> {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Required Skills */}
            {opp.requiredSkills && (
              <div className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-lg font-semibold text-text mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {opp.requiredSkills.split(',').map((s) => (
                    <span key={s} className="badge badge-primary">{s.trim()}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply card */}
            <div className="bg-white rounded-xl border border-border p-5 sticky top-20">
              {isExpired ? (
                <div className="text-center py-2">
                  <AlertCircle size={32} className="text-error mx-auto mb-2" />
                  <p className="text-error font-medium">Application Closed</p>
                  <p className="text-text-light text-sm mt-1">The deadline for this opportunity has passed.</p>
                </div>
              ) : (
                <>
                  <button onClick={handleApply} className="btn-primary w-full py-3 text-base mb-3">
                    Apply Now
                  </button>
                  <button onClick={handleSave} disabled={savingLoading} className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2 mb-3">
                    {saved ? <><BookmarkCheck size={16} /> Saved</> : <><Bookmark size={16} /> Save</>}
                  </button>
                  <button onClick={handleMessageEmployer} className="btn-secondary w-full py-2.5 flex items-center justify-center gap-2">
                    Message Employer
                  </button>
                </>
              )}

              <div className="mt-4 pt-4 border-t border-border space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-light">Posted</span>
                  <span className="text-text font-medium">{formatDate(opp.publishedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-light">Deadline</span>
                  <span className={`font-medium ${isExpired ? 'text-error' : daysLeft <= 7 ? 'text-warning' : 'text-text'}`}>{formatDate(opp.applicationDeadline)}</span>
                </div>
                {opp._count?.applications > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-light">Applicants</span>
                    <span className="text-text font-medium">{opp._count.applications}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Organization card */}
            <div className="bg-white rounded-xl border border-border p-5">
              <h3 className="font-semibold text-text mb-3">About the Organization</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary bg-opacity-10 flex items-center justify-center text-primary font-bold text-sm">
                  {opp.organization?.organizationName?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-text text-sm">{opp.organization?.organizationName}</p>
                  <p className="text-xs text-text-light">{opp.organization?.location}</p>
                </div>
              </div>
              {opp.organization?.verificationStatus === 'verified' && (
                <div className="flex items-center gap-1.5 text-xs text-success bg-success bg-opacity-10 rounded-lg px-3 py-1.5">
                  <CheckCircle size={13} /> Verified Organization
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
