'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/Input';
import Select from '@/components/Select';
import Button from '@/components/Button';
import type { Player } from '@/lib/types';

type FormData = Partial<Player>;

export default function PlayerForm({ initial }: { initial?: Player }) {
  const router = useRouter();
  const [data, setData] = useState<FormData>(
    initial ?? {
      first_name: '', last_name: '', date_of_birth: '',
      position: 'MID' as const, team: 'First Team',
      jersey_number: null, height_cm: null, weight_kg: null,
      nationality: '', photo_url: '', status: 'fit' as const, notes: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function upd<K extends keyof FormData>(key: K, val: FormData[K]) {
    setData((d) => ({ ...d, [key]: val }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = initial ? `/api/players/${initial.id}` : '/api/players';
    const method = initial ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      return setError(j.error || 'Something went wrong');
    }
    const saved = await res.json();
    router.push(`/dashboard/players/${initial ? initial.id : saved.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Input label="First name" required value={data.first_name ?? ''} onChange={(e) => upd('first_name', e.target.value)} />
        <Input label="Last name" required value={data.last_name ?? ''} onChange={(e) => upd('last_name', e.target.value)} />
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <Input label="Date of birth" type="date" required value={data.date_of_birth ?? ''} onChange={(e) => upd('date_of_birth', e.target.value)} />
        <Select label="Position" required value={data.position ?? 'MID'} onChange={(e) => upd('position', e.target.value as any)}>
          <option value="GK">Goalkeeper</option>
          <option value="DEF">Defender</option>
          <option value="MID">Midfielder</option>
          <option value="FWD">Forward</option>
        </Select>
        <Input label="Team" required value={data.team ?? ''} onChange={(e) => upd('team', e.target.value)} placeholder="First Team / U19 / …" />
      </div>
      <div className="grid md:grid-cols-4 gap-4">
        <Input label="Jersey #" type="number" min={1} max={99} value={data.jersey_number ?? ''} onChange={(e) => upd('jersey_number', e.target.value ? Number(e.target.value) : null)} />
        <Input label="Height (cm)" type="number" step={0.1} value={data.height_cm ?? ''} onChange={(e) => upd('height_cm', e.target.value ? Number(e.target.value) : null)} />
        <Input label="Weight (kg)" type="number" step={0.1} value={data.weight_kg ?? ''} onChange={(e) => upd('weight_kg', e.target.value ? Number(e.target.value) : null)} />
        <Input label="Nationality" value={data.nationality ?? ''} onChange={(e) => upd('nationality', e.target.value)} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Select label="Status" value={data.status ?? 'fit'} onChange={(e) => upd('status', e.target.value as any)}>
          <option value="fit">Fit</option>
          <option value="injured">Injured</option>
          <option value="recovering">Recovering</option>
        </Select>
        <Input label="Photo URL (optional)" value={data.photo_url ?? ''} onChange={(e) => upd('photo_url', e.target.value)} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="label">Notes</label>
        <textarea
          className="input-base min-h-[88px]"
          value={data.notes ?? ''}
          onChange={(e) => upd('notes', e.target.value)}
          placeholder="Any additional info…"
        />
      </div>

      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}

      <div className="flex gap-3">
        <Button type="submit" loading={loading}>{initial ? 'Save changes' : 'Create player'}</Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}