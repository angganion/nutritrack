import { Bell, Menu, User } from 'lucide-react';

export function TopNav() {
  return (
    <header className="bg-white shadow">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Mobile menu button */}
        <button
          type="button"
          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Search */}
        <div className="flex flex-1 justify-between px-4">
          <div className="flex flex-1">
            <div className="w-full max-w-lg lg:max-w-xs">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Cari..."
                />
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center space-x-4">
            {/* Notifications */}
            <button
              type="button"
              className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button
                type="button"
                className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Open user menu</span>
                <User className="h-8 w-8 rounded-full text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}