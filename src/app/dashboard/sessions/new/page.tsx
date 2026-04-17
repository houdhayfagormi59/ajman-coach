import { createClient } from '@/lib/supabase/server';
import SessionForm from '@/components/SessionForm';
import type { Player } from '@/lib/types';

export default async function NewSessionPage() {
  const supabase = createClient();
  const { data } = await supabase.from('players').select('*').order('last_name');
  const players = (data ?? []) as Player[];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">New training session</h1>
      <p className="text-sm text-slate-500 mb-5">Plan a session and link players</p>
      <div className="card p-6"><SessionForm players={players} /></div>
    </div>
  );
}