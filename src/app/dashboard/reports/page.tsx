import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import EmptyState from '@/components/EmptyState';
import { FileText } from 'lucide-react';
import type { Player } from '@/lib/types';

export default async function ReportsIndex() {
  const supabase = createClient();
  const { data } = await supabase.from('players').select('*').order('last_name');
  const players = (data ?? []) as Player[];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-sm text-slate-500">Generate a professional PDF report for any player</p>
      </div>

      {players.length === 0 ? (
        <div className="card">
          <EmptyState icon={<FileText size={48} />} title="No players yet" description="Add players first to generate reports." />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.map((p) => (
            <Link key={p.id} href={`/dashboard/reports/${p.id}`} className="card p-5 hover:shadow-md hover:border-brand-200 transition">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center"><FileText size={20} /></div>
                <div>
                  <div className="font-semibold text-slate-900">{p.first_name} {p.last_name}</div>
                  <div className="text-xs text-slate-500">{p.team} · {p.position}</div>
                </div>
              </div>
              <div className="text-xs text-brand-600 font-medium mt-3">Generate PDF →</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}