'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import type { Player } from '@/lib/types';

export default function SessionForm({ players }: { players: Player[] }) {
  const router = useRouter();
  const [data, setData] = useState({
    title: '',
    session_date: new Date().toISOString().split('T')[0],
    duration_minutes: 90,
    focus_area: 'Tactical',
    location: '',
    coach_notes: '',
  });
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelectedPlayers((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, player_ids: selectedPlayers }),
    });

    setLoading(false);
    if (!res.ok) return setError((await res.json().catch(() => ({}))).error || 'Failed');
    const saved = await res.json();
    router.push('/dashboard/sessions');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Title" required value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} placeholder="e.g. Tactical drills" />
      <div className="grid md:grid-cols-3 gap-4">
        <Input label="Date" type="date" required value={data.session_date} onChange={(e) => setData({ ...data, session_date: e.target.value })} />
        <Input label="Duration (min)" type="number" min={10} value={data.duration_minutes} onChange={(e) => setData({ ...data, duration_minutes: Number(e.target.value) })} />
        <Select label="Focus area" value={data.focus_area} onChange={(e) => setData({ ...data, focus_area: e.target.value })}>
          {['Tactical','Technical','Physical','Set pieces','Recovery','Match preparation'].map((f) => <option key={f} value={f}>{f}</option>)}
        </Select>
      </div>
      <Input label="Location" value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} placeholder="Training ground / Stadium" />

      <div>
        <label className="label">Players attending</label>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 border border-slate-200 rounded-lg max-h-60 overflow-y-auto scrollbar-thin">
          {players.length === 0 && <p className="text-sm text-slate-500 col-span-full">Add players first.</p>}
          {players.map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer px-2 py-1 rounded hover:bg-slate-50">
              <input
                type="checkbox"
                checked={selectedPlayers.includes(p.id)}
                onChange={() => toggle(p.id)}
                className="rounded border-slate-300"
              />
              {p.first_name} {p.last_name}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="label">Coach notes</label>
        <textarea className="input-base min-h-[100px]" value={data.coach_notes} onChange={(e) => setData({ ...data, coach_notes: e.target.value })} />
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Create session</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}