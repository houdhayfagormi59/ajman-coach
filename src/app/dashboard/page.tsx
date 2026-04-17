import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatCard from '@/components/StatCard';
import Badge from '@/components/Badge';
import { Users, Activity, BarChart3, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default async function DashboardHome() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [playersR, injuriesR, sessionsR, perfR] = await Promise.all([
    supabase.from('players').select('id,status,first_name,last_name,position,team,created_at').eq('coach_id', user.id),
    supabase.from('injuries').select('id,player_id,injury_type,body_part,severity,expected_return_date,status').eq('status', 'active'),
    supabase.from('sessions').select('id,title,session_date,focus_area').order('session_date', { ascending: false }).limit(5),
    supabase.from('performances').select('id,rating,match_date').order('match_date', { ascending: false }).limit(20),
  ]);

  const players = playersR.data ?? [];
  const injuries = injuriesR.data ?? [];
  const sessions = sessionsR.data ?? [];
  const performances = perfR.data ?? [];

  const fit = players.filter((p) => p.status === 'fit').length;
  const injured = players.filter((p) => p.status === 'injured').length;
  const recovering = players.filter((p) => p.status === 'recovering').length;
  const avgRating = performances.length
    ? (performances.reduce((s, p) => s + (p.rating ?? 0), 0) / performances.length).toFixed(1)
    : '—';

  const recentPlayers = [...players]
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">Overview of your squad and activity</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total players" value={players.length} icon={<Users size={22} />} />
        <StatCard label="Fit" value={fit} icon={<Activity size={22} />} hint={`${injured} injured · ${recovering} recovering`} />
        <StatCard label="Active injuries" value={injuries.length} icon={<Activity size={22} />} />
        <StatCard label="Avg rating (last 20)" value={avgRating} icon={<BarChart3 size={22} />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <section className="card p-5">
          <header className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Recent players</h2>
            <Link href="/dashboard/players" className="text-sm text-brand-600 hover:underline">View all</Link>
          </header>
          {recentPlayers.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No players yet. Add your first one from the Players page.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recentPlayers.map((p) => (
                <li key={p.id}>
                  <Link href={`/dashboard/players/${p.id}`} className="flex items-center justify-between py-2.5 hover:bg-slate-50 -mx-2 px-2 rounded">
                    <div>
                      <div className="font-medium text-slate-800">{p.first_name} {p.last_name}</div>
                      <div className="text-xs text-slate-500">{p.team} · {p.position}</div>
                    </div>
                    <Badge variant={p.status as any}>{p.status}</Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card p-5">
          <header className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-900">Active injuries</h2>
            <Link href="/dashboard/injuries" className="text-sm text-brand-600 hover:underline">View all</Link>
          </header>
          {injuries.length === 0 ? (
            <p className="text-sm text-slate-500 py-6 text-center">No active injuries — great job.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {injuries.slice(0, 5).map((inj: any) => {
                const player = players.find((p) => p.id === inj.player_id);
                return (
                  <li key={inj.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-slate-800">{player ? `${player.first_name} ${player.last_name}` : 'Player'}</div>
                      <div className="text-xs text-slate-500">{inj.injury_type} · {inj.body_part}</div>
                    </div>
                    <div className="text-xs text-slate-500">Back {formatDate(inj.expected_return_date)}</div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <section className="card p-5">
        <header className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-900">Upcoming & recent sessions</h2>
          <Link href="/dashboard/sessions" className="text-sm text-brand-600 hover:underline">View all</Link>
        </header>
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">No sessions scheduled yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {sessions.map((s) => (
              <li key={s.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800">{s.title}</div>
                  <div className="text-xs text-slate-500">{s.focus_area}</div>
                </div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar size={13} /> {formatDate(s.session_date)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}