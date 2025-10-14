'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin, Filter } from 'lucide-react';

export function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedProvince, setSelectedProvince] = useState(searchParams.get('province') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [loading, setLoading] = useState(true);

  // Fetch provinces on mount
  useEffect(() => {
    async function fetchProvinces() {
      try {
        const response = await fetch('/api/dashboard/locations');
        const data = await response.json();
        setProvinces(data.provinces || []);
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProvinces();
  }, []);

  // Fetch cities when province changes
  useEffect(() => {
    if (selectedProvince) {
      async function fetchCities() {
        try {
          const response = await fetch(`/api/dashboard/locations?province=${encodeURIComponent(selectedProvince)}`);
          const data = await response.json();
          setCities(data.cities || []);
        } catch (error) {
          console.error('Failed to fetch cities:', error);
        }
      }
      fetchCities();
    } else {
      setCities([]);
      setSelectedCity('');
    }
  }, [selectedProvince]);

  const handleApplyFilter = () => {
    const params = new URLSearchParams();
    if (selectedProvince) params.append('province', selectedProvince);
    if (selectedCity) params.append('city', selectedCity);
    
    const queryString = params.toString();
    router.push(`/dashboard${queryString ? `?${queryString}` : ''}`);
    router.refresh();
  };

  const handleClearFilter = () => {
    setSelectedProvince('');
    setSelectedCity('');
    router.push('/dashboard');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200/60 bg-white p-5">
        <div className="animate-pulse flex gap-3">
          <div className="h-10 bg-slate-100 rounded-lg w-1/3"></div>
          <div className="h-10 bg-slate-100 rounded-lg w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 p-5 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
          <MapPin className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-sm font-semibold text-indigo-900">Filter Wilayah</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Province Filter */}
        <div>
          <label htmlFor="province-filter" className="block text-xs font-medium text-slate-600 mb-2">
            Provinsi
          </label>
          <select
            id="province-filter"
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white text-slate-900"
          >
            <option value="">Semua Provinsi</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* City Filter */}
        <div>
          <label htmlFor="city-filter" className="block text-xs font-medium text-slate-600 mb-2">
            Kabupaten/Kota
          </label>
          <select
            id="city-filter"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white text-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
            disabled={!selectedProvince}
          >
            <option value="">Semua Kabupaten/Kota</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <button
            onClick={handleClearFilter}
            className="flex-1 px-4 py-2 text-sm font-medium border border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-all duration-200"
          >
            Reset
          </button>
          <button
            onClick={handleApplyFilter}
            className="flex-1 px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-500/30"
          >
            <Filter className="h-3.5 w-3.5" />
            Terapkan
          </button>
        </div>
      </div>

      {/* Active Filter Indicator */}
      {(selectedProvince || selectedCity) && (
        <div className="mt-4 p-3 bg-white/60 backdrop-blur-sm rounded-lg border border-indigo-200/60 shadow-sm">
          <p className="text-xs font-semibold text-indigo-900">
            Filter Aktif: {selectedProvince}{selectedCity && ` → ${selectedCity}`}
          </p>
        </div>
      )}
    </div>
  );
}

