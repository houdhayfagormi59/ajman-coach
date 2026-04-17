import PlayerForm from '@/components/PlayerForm';

export default function NewPlayerPage() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Add player</h1>
      <p className="text-sm text-slate-500 mb-5">Create a new player profile</p>
      <div className="card p-6">
        <PlayerForm />
      </div>
    </div>
  );
}