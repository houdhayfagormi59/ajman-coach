import { ReactNode } from 'react';

export default function StatCard({ label, value, icon, hint }: {
  label: string; value: ReactNode; icon?: ReactNode; hint?: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="label">{label}</div>
          <div className="text-3xl font-bold text-brand-700 mt-1">{value}</div>
          {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
        </div>
        {icon && <div className="text-brand-500 opacity-70">{icon}</div>}
      </div>
    </div>
  );
}