import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 text-white px-4">
      <div className="max-w-2xl text-center">
        <div className="inline-block w-16 h-16 rounded-2xl bg-white/10 backdrop-blur mb-6 flex items-center justify-center text-4xl">⚽</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Ajman Coach</h1>
        <p className="text-lg md:text-xl text-white/80 mb-8">
          Professional football player management. Track players, injuries, performance, and generate professional reports — all in one place.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/login" className="px-6 py-3 bg-white text-brand-700 font-semibold rounded-lg hover:bg-slate-100">
            Sign in
          </Link>
          <Link href="/signup" className="px-6 py-3 bg-white/10 border border-white/30 font-semibold rounded-lg hover:bg-white/20">
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}