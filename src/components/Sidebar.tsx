'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, BarChart3, Calendar, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/players', label: 'Players', icon: Users },
  { href: '/dashboard/injuries', label: 'Injuries', icon: Activity },
  { href: '/dashboard/performance', label: 'Performance', icon: BarChart3 },
  { href: '/dashboard/sessions', label: 'Training', icon: Calendar },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex-shrink-0 hidden md:flex flex-col">
      <div className="h-16 px-5 flex items-center gap-2 border-b border-slate-200">
        <div className="w-8 h-8 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold">A</div>
        <div>
          <div className="font-bold text-brand-700 leading-tight">Ajman Coach</div>
          <div className="text-xs text-slate-500 leading-tight">Player Manager</div>
        </div>
      </div>
      <nav className="p-3 space-y-1 flex-1">
        {nav.map((item) => {
          const active = path === item.href || (item.href !== '/dashboard' && path.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition',
                active ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 text-xs text-slate-400 border-t border-slate-200">
        Ajman, UAE · v1.0
      </div>
    </aside>
  );
}