'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/Button';
import Modal from '@/components/Modal';
import PerformanceForm from '@/components/PerformanceForm';
import PerformanceChart from '@/components/PerformanceChart';
import Select from '@/components/Select';
import EmptyState from '@/components/EmptyState';
import { Plus, BarChart3 } from 'lucide-react';
import { formatDate, passAccuracy } from '@/lib/utils';
import type { Performance, Player } from '@/lib/types';

export default function PerformancePage() {
  const supabase = createClient();
  const [players, setPlayers] = useState<Player[]>([]);
  const [perf, setPerf] = useState<Performance[]>([]);
  const [selected, setSelected] = useState<string>('all');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [p, ps] = await Promise.all([
      supabase.from('performances').select('*').order('match_date', { ascending: false }),
      supabase.from('players').select('*').order('last_name'),
    ]);
    setPerf((p.data ?? []) as Performance[]);
    setPlayers((ps.data ?? []) as Player[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function remove(id: string) {
    if (!confirm('Delete this performance record?')) return;
    await fetch(`/api/performances/${id}`, { method: 'DELETE' });
    load();
  }

  const shown = selected === 'all' ? perf : perf.filter((p) => p.player_id === selected);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Performance</h1>
          <p className="text-sm text-slate-500">Match stats and ratings</p>
        </div>
        <Button onClick={() => setModal(true)} disabled={players.length === 0}>
          <Plus size={16} /> Add match
        </Button>
      </div>

      <div className="card p-4">
        <div className="flex items-center gap-3">
          <div className="label shrink-0">Player</div>
          <div className="w-full max-w-xs">
            <Select value={selected} onChange={(e) => setSelected(e.target.value)}>
              <option value="all">All players</option>
              {players.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
            </Select>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold text-slate-900 mb-3">Progress chart</h2>
        <PerformanceChart data={shown} />
      </div>

      {loading ? (
        <div className="card p-8 text-center text-sm text-slate-500">Loading…</div>
      ) : shown.length === 0 ? (
        <div className="card">
          <EmptyState icon={<BarChart3 size={48} />} title="No performance records" description="Record a match to start tracking progress." />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 border-b border-slate-200">
                {['Date','Player','Opponent','Min','G','A','Pass %','Shots','Rating',''].map((h) => (
                  <th key={h} className="px-5 py-2.5 text-left text-xs font-semibold uppercase text-slate-600">{h}</th>
                ))}
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {shown.map((p) => {
                  const player = players.find((x) => x.id === p.player_id);
                  return (
                    <tr key={p.id}>
                      <td className="px-5 py-3">{formatDate(p.match_date)}</td>
                      <td className="px-5 py-3 font-medium text-slate-800">{player ? `${player.first_name} ${player.last_name}` : '—'}</td>
                      <td className="px-5 py-3">{p.opponent}</td>
                      <td className="px-5 py-3">{p.minutes_played}</td>
                      <td className="px-5 py-3 font-medium">{p.goals}</td>
                      <td className="px-5 py-3">{p.assists}</td>
                      <td className="px-5 py-3">{passAccuracy(p.passes_completed, p.passes_attempted)}%</td>
                      <td className="px-5 py-3">{p.shots_on_target}/{p.shots}</td>
                      <td className="px-5 py-3 font-medium">{p.rating ?? '—'}</td>
                      <td className="px-5 py-3"><button onClick={() => remove(p.id)} className="text-red-600 text-xs hover:underline">Delete</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title="Record match performance">
        <PerformanceForm players={players} onDone={() => { setModal(false); load(); }} />
      </Modal>
    </div>
  );
}