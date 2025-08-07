import Link from 'next/link';
import { LayoutDashboard, LineChart, Table, FileSpreadsheet, Settings, Map } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Statistik', href: '/dashboard/statistics', icon: LineChart },
  { name: 'Data Anak', href: '/dashboard/children', icon: Table },
  { name: 'Persebaran', href: '/dashboard/distribution', icon: Map },
  { name: 'Laporan', href: '/dashboard/reports', icon: FileSpreadsheet },
  { name: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <div className="hidden w-64 flex-shrink-0 bg-gradient-to-b from-indigo-700 to-indigo-900 shadow-xl md:flex">
      <div className="flex w-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b border-indigo-600">
          <span className="text-xl font-bold text-white">Stunting Monitor</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-indigo-100 transition-all duration-200 hover:bg-indigo-800 hover:text-white"
            >
              <item.icon
                className="mr-3 h-5 w-5 flex-shrink-0 text-indigo-300 transition-colors duration-200 group-hover:text-white"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-indigo-600 p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">A</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-indigo-300">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}