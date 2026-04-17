import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import { Plus, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Session } from '@/lib/types';

export default async function SessionsPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('sessions')
    .select('*, session_players(count)')
    .order('session_date', { ascending: false });

  const sessions = (data ?? []) as (Session & { session_players: { count: number }[] })[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Training sessions</h1>
          <p className="text-sm text-slate-500">Plan and log sessions</p>
        </div>
        <Link href="/dashboard/sessions/new"><Button><Plus size={16} /> New session</Button></Link>
      </div>

      {sessions.length === 0 ? (
        <div className="card">
          <EmptyState icon={<Calendar size={48} />} title="No sessions yet" description="Plan your first training session." action={<Link href="/dashboard/sessions/new"><Button><Plus size={16} /> New session</Button></Link>} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {sessions.map((s) => (
            <div key={s.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{s.title}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {formatDate(s.session_date)} · {s.duration_minutes} min · {s.focus_area}
                  </div>
                </div>
                <div className="text-xs text-brand-700 font-medium bg-brand-50 px-2 py-1 rounded">
                  {s.session_players?.[0]?.count ?? 0} players
                </div>
              </div>
              {s.location && <div className="text-xs text-slate-600 mt-2">📍 {s.location}</div>}
              {s.coach_notes && <p className="text-sm text-slate-700 mt-3 leading-relaxed whitespace-pre-line line-clamp-3">{s.coach_notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}