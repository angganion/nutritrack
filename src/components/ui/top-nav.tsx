import { Bell, Menu, User, Search, Settings, LogOut, ChevronDown } from 'lucide-react';

export function TopNav() {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:hidden transition-colors"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Search */}
        <div className="flex flex-1 justify-between px-4">
          <div className="flex flex-1 max-w-lg">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-600" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="block w-full rounded-xl border-0 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 placeholder-gray-600 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
                placeholder="Cari data anak, laporan, atau statistik..."
              />
            </div>
          </div>
          
          <div className="ml-4 flex items-center space-x-4">
            {/* Notifications */}
            <button
              type="button"
              className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
            </button>

            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105">
                + Tambah Data
              </button>
            </div>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 rounded-lg bg-gray-50 p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-600">Administrator</div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
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