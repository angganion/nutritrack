import Link from 'next/link';
import { LayoutDashboard, LineChart, Table, FileSpreadsheet, Settings, Map, Activity, Users } from 'lucide-react';

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
    <div className="hidden w-72 flex-shrink-0 bg-white shadow-xl border-r border-gray-200 md:flex">
      <div className="flex w-full flex-col">
        {/* Logo Section */}
        <div className="flex h-20 items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 border-b border-blue-600">
          <div className="flex items-center space-x-3">
            <img src="/garuda.png" alt="Logo Garuda" className="h-8 w-auto" />
            <div className="text-white">
              <div className="text-lg font-bold">PANTAU+</div>
              <div className="text-xs text-blue-200">Sistem Pemantauan</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 px-4 py-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group relative flex items-center rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
            >
              {/* Active indicator */}
              <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 opacity-0 transition-all duration-200 group-hover:opacity-100" />
              
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0 text-gray-500 transition-colors duration-200 group-hover:text-gray-700"
                aria-hidden="true"
              />
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="border-t border-gray-300 p-4">
          <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Status Sistem</span>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            <div className="text-xs text-green-700">
              Semua sistem berjalan normal
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="border-t border-gray-300 p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-600 truncate">admin@pantau.id</p>
            </div>
            <button className="rounded-lg p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}