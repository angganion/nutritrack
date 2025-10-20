import Link from 'next/link';
import { LayoutDashboard, LineChart, Table, FileSpreadsheet, Settings, Map, Users } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'Overview utama' },
  { name: 'Statistik', href: '/dashboard/statistics', icon: LineChart, description: 'Analisis data' },
  { name: 'Data Anak', href: '/dashboard/children', icon: Users, description: 'Kelola data anak' },
  { name: 'Persebaran', href: '/dashboard/distribution', icon: Map, description: 'Peta persebaran' },
  { name: 'Laporan', href: '/dashboard/reports', icon: FileSpreadsheet, description: 'Generate laporan' },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings, description: 'Konfigurasi sistem' },
];

export function Sidebar() {
  return (
    <div className="hidden w-64 flex-shrink-0 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 md:flex">
      <div className="flex w-full flex-col">
        {/* Logo Section */}
        <div className="flex h-16 items-center px-5 border-b border-slate-100 bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <img src="/garuda.png" alt="Logo" className="h-5 w-auto brightness-0 invert" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 tracking-tight">PANTAU+</div>
              <div className="text-[10px] text-slate-500 font-medium">Sistem Pemantauan</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 rounded-lg hover:text-blue-700 hover:bg-blue-50/50 transition-all duration-200"
            >
              <item.icon className="h-[18px] w-[18px] text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

      </div>
    </div>
  );
}