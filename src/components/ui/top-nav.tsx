'use client';

import { Menu, User, Search, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

export function TopNav() {
  const { user } = useUser();
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="flex flex-1 justify-between px-4">
          <div className="flex flex-1 max-w-xl">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-xl border-0 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
                placeholder="Cari data anak, statistik, laporan..."
              />
            </div>
          </div>
          
          <div className="ml-4 flex items-center gap-2">
            {/* Profile dropdown */}
            <div className="relative ml-1">
              <button
                type="button"
                className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-2.5 py-2 hover:bg-slate-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {user?.role === 'admin' ? 'AD' : 'PK'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-slate-900 capitalize">
                    {user?.role === 'admin' ? 'Admin' : 'Puskesmas'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {user?.role === 'admin' ? 'Administrator' : user?.kecamatan || 'Puskesmas'}
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>
              
              {/* Dropdown menu - would be implemented with state management */}
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 opacity-0 pointer-events-none transition-opacity duration-200">
                <div className="py-1">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="mr-3 h-4 w-4" />
                    Profil Saya
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="mr-3 h-4 w-4" />
                    Pengaturan
                  </a>
                  <hr className="my-1" />
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    <LogOut className="mr-3 h-4 w-4" />
                    Keluar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}