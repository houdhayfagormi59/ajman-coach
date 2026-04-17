'use client';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function TopBar({ coachName }: { coachName: string }) {
  const router = useRouter();
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-5 flex items-center justify-between">
      <div>
        <div className="text-sm font-semibold text-slate-800">Welcome back, {coachName}</div>
        <div className="text-xs text-slate-500">Ajman Club · Player Management</div>
      </div>
      <button
        onClick={signOut}
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100"
      >
        <LogOut size={15} />
        Sign out
      </button>
    </header>
  );
}