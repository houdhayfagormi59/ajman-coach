'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import type { Performance } from '@/lib/types';

export default function PerformanceChart({ data }: { data: Performance[] }) {
  const rows = [...data]
    .sort((a, b) => a.match_date.localeCompare(b.match_date))
    .map((p) => ({
      date: p.match_date.slice(5),
      rating: p.rating ?? 0,
      goals: p.goals,
      assists: p.assists,
    }));

  if (!rows.length) {
    return <p className="text-sm text-slate-500 text-center py-6">No performance data yet.</p>;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer>
        <LineChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey="rating" stroke="#1F4E78" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="goals" stroke="#F4A460" strokeWidth={2} dot={{ r: 3 }} />
          <Line type="monotone" dataKey="assists" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}