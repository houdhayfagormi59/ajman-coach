import Link from 'next/link';
import Badge from '@/components/Badge';
import type { Player } from '@/lib/types';
import { ageFromDOB } from '@/lib/utils';

export default function PlayerCard({ p }: { p: Player }) {
  return (
    <Link href={`/dashboard/players/${p.id}`} className="card p-4 hover:shadow-md hover:border-brand-200 transition flex gap-3 items-center">
      <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl overflow-hidden shrink-0">
        {p.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.photo_url} alt={p.first_name} className="w-full h-full object-cover" />
        ) : '⚽'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-slate-900 truncate">{p.first_name} {p.last_name}</div>
        <div className="text-xs text-slate-500">
          {p.position} · {p.team} · Age {ageFromDOB(p.date_of_birth)}
          {p.jersey_number ? ` · #${p.jersey_number}` : ''}
        </div>
        <div className="mt-1"><Badge variant={p.status}>{p.status}</Badge></div>
      </div>
    </Link>
  );
}