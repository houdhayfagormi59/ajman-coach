import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import PlayerCard from '@/components/PlayerCard';
import Button from '@/components/Button';
import EmptyState from '@/components/EmptyState';
import { Plus, Users } from 'lucide-react';
import type { Player } from '@/lib/types';

export default async function PlayersPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('players')
    .select('*')
    .order('last_name', { ascending: true });
  const players = (data ?? []) as Player[];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Players</h1>
          <p className="text-sm text-slate-500">{players.length} total</p>
        </div>
        <Link href="/dashboard/players/new">
          <Button><Plus size={16} /> Add player</Button>
        </Link>
      </div>

      {players.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<Users size={48} />}
            title="No players yet"
            description="Add your first player to start tracking performance and injuries."
            action={<Link href="/dashboard/players/new"><Button><Plus size={16} /> Add player</Button></Link>}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((p) => <PlayerCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}