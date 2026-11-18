import { Link } from 'react-router-dom';

export default function OpportunityCard({ opportunity }) {
  return (
    <article className="opportunity-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
            {opportunity.company.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">{opportunity.category}</p>
            <h3 className="mt-1 text-xl font-bold text-slate-900">{opportunity.title}</h3>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{opportunity.tag}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
        <span className="chip">{opportunity.company}</span>
        <span className="chip">{opportunity.location}</span>
        <span className="chip">{opportunity.type}</span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">{opportunity.description}</p>

      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Salary</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">{opportunity.salary}</p>
        </div>
        <Link to={`/opportunities/${opportunity.id}`} className="btn-primary text-sm">
          View details
        </Link>
      </div>
    </article>
  );
}
