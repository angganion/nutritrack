'use client';

import { AlertTriangle, CheckCircle, ArrowLeft, MapPin, Lightbulb, Filter } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

// Import map component dynamically
const DistributionMap = dynamic(() => import('@/components/distribution-map'), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-100 rounded-lg animate-pulse" />
});

interface StatsData {
  level: 'country' | 'province' | 'city' | 'district';
  location: string | { province: string; city?: string; district?: string };
  totalChildren: number;
  totalStunting: number;
  stuntingRate: string;
  longitude?: number;
  latitude?: number;
  groupedByProvince?: any[];
  groupedByCity?: any[];
  groupedByDistrict?: any[];
  data: any[];
}

interface RecommendationData {
  recommendations: string[];
  priority: 'high' | 'medium' | 'low';
  summary: string;
  actionPlan: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
  };
  stakeholders: string[];
  budgetEstimate?: string;
}

export default function DistributionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(searchParams.get('month') || '');
  const [selectedYear, setSelectedYear] = useState<string>(searchParams.get('year') || '');
  const [filterMode, setFilterMode] = useState<string>(searchParams.get('mode') || 'kumulatif');
  const [showFilters, setShowFilters] = useState(false);

  // Construct the API path from params
  const pathSegments = params.params as string[];
  const apiPath = pathSegments.length === 0 ? 'all' : pathSegments.join('/');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Build query parameters
        const queryParams = new URLSearchParams();
        if (selectedYear) queryParams.append('year', selectedYear);
        if (selectedMonth) queryParams.append('month', selectedMonth);
        if (filterMode) queryParams.append('mode', filterMode);
        
        const queryString = queryParams.toString();
        const url = `/api/stats/${apiPath}${queryString ? `?${queryString}` : ''}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiPath, selectedMonth, selectedYear, filterMode]);

  const handleGetRecommendations = () => {
    const recommendationPath = `/dashboard/recommendations/${apiPath}`;
    router.push(recommendationPath);
  };

  const handleApplyFilter = () => {
    // Update URL with new filters
    const queryParams = new URLSearchParams();
    if (selectedYear) queryParams.append('year', selectedYear);
    if (selectedMonth) queryParams.append('month', selectedMonth);
    if (filterMode) queryParams.append('mode', filterMode);
    
    const queryString = queryParams.toString();
    const newUrl = `/dashboard/distribution/${pathSegments.join('/')}${queryString ? `?${queryString}` : ''}`;
    router.push(newUrl);
  };

  const handleClearFilter = () => {
    setSelectedMonth('');
    setSelectedYear('');
    setFilterMode('kumulatif');
    router.push(`/dashboard/distribution/${pathSegments.join('/')}`);
  };

  const months = [
    { value: '1', label: 'Januari' },
    { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' },
    { value: '4', label: 'April' },
    { value: '5', label: 'Mei' },
    { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' },
    { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="h-24 bg-slate-100 rounded-xl"></div>
            <div className="h-24 bg-slate-100 rounded-xl"></div>
            <div className="h-24 bg-slate-100 rounded-xl"></div>
          </div>
          <div className="h-[600px] bg-slate-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Data</h2>
          <p className="text-slate-600 mb-6">{error || 'No data available'}</p>
          <Button onClick={() => router.push('/dashboard/distribution')} className="bg-slate-900 hover:bg-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Distribution Map
          </Button>
        </div>
      </div>
    );
  }

  // Determine the current level and breadcrumb
  const getBreadcrumb = () => {
    const breadcrumbs: { name: string; href: string | null }[] = [
      { name: 'Indonesia', href: '/dashboard/distribution' }
    ];

    if (data.level === 'province') {
      breadcrumbs.push({ name: data.location as string, href: null });
    } else if (data.level === 'city') {
      const location = data.location as { province: string; city: string };
      breadcrumbs.push(
        { name: location.province, href: `/dashboard/distribution/${encodeURIComponent(location.province)}` },
        { name: location.city, href: null }
      );
    } else if (data.level === 'district') {
      const location = data.location as { province: string; city: string; district: string };
      breadcrumbs.push(
        { name: location.province, href: `/dashboard/distribution/${encodeURIComponent(location.province)}` },
        { name: location.city, href: `/dashboard/distribution/${encodeURIComponent(location.province)}/${encodeURIComponent(location.city)}` },
        { name: location.district, href: null }
      );
    }

    return breadcrumbs;
  };

  // Get the areas data for the map
  const getAreasData = () => {
    if (data.level === 'country' && data.groupedByProvince) {
      return data.groupedByProvince.map((province: any) => ({
        name: province.province,
        coordinates: [province.latitude, province.longitude] as [number, number],
        total: province.totalChildren,
        stunting: province.totalStunting,
        children: province.data,
        description: `${province.province} - ${province.stuntingRate}% stunting rate`,
        href: `/dashboard/distribution/${encodeURIComponent(province.province)}`
      }));
    } else if (data.level === 'province' && data.groupedByCity) {
      return data.groupedByCity.map((city: any) => ({
        name: city.city,
        coordinates: [city.latitude, city.longitude] as [number, number],
        total: city.totalChildren,
        stunting: city.totalStunting,
        children: city.data,
        description: `${city.city} - ${city.stuntingRate}% stunting rate`,
        href: `/dashboard/distribution/${encodeURIComponent(data.location as string)}/${encodeURIComponent(city.city)}`
      }));
    } else if (data.level === 'city' && data.groupedByDistrict) {
      return data.groupedByDistrict.map((district: any) => ({
        name: district.district,
        coordinates: [district.latitude, district.longitude] as [number, number],
        total: district.totalChildren,
        stunting: district.totalStunting,
        children: district.data,
        description: `${district.district} - ${district.stuntingRate}% stunting rate`,
        href: null // No further drill down for districts
      }));
    }
    return [];
  };

  const breadcrumbs = getBreadcrumb();
  const areas = getAreasData();
  const totalChildren = data.totalChildren;
  const stuntingCases = data.totalStunting;
  const stuntingRate = data.stuntingRate;

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <span className="text-slate-400 mx-2">/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                {crumb.name}
              </Link>
            ) : (
              <span className="text-slate-900 font-semibold">{crumb.name}</span>
            )}
          </div>
        ))}
      </nav>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <div className="p-2 rounded-lg bg-slate-100">
              <MapPin className="w-6 h-6 text-slate-700" />
            </div>
            {data.level === 'country' ? 'Indonesia' : 
             data.level === 'province' ? data.location :
             data.level === 'city' ? (data.location as any).city :
             (data.location as any).district}
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            {data.level === 'country' ? 'Peta sebaran stunting nasional' :
             data.level === 'province' ? `Kota dan kabupaten di ${data.location}` :
             data.level === 'city' ? `Kecamatan di ${(data.location as any).city}` :
             'Data individual di kecamatan ini'}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="text-center px-4 py-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <p className="text-xs text-slate-500 mb-1">Total Anak</p>
            <p className="text-xl font-bold text-slate-900">{totalChildren}</p>
          </div>
          <div className="text-center px-4 py-3 bg-slate-50 rounded-xl border border-slate-200/60">
            <p className="text-xs text-slate-500 mb-1">Stunting Rate</p>
            <p className={`text-xl font-bold ${parseFloat(stuntingRate) > 20 ? 'text-rose-600' : 'text-emerald-600'}`}>{stuntingRate}%</p>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="p-6 bg-white border border-slate-200/60 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-50">
              <Filter className="w-4 w-4 text-slate-600" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">Filter Data</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-slate-600 hover:text-slate-900"
          >
            {showFilters ? 'Sembunyikan Filter' : 'Buka Filter'}
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            {/* Mode Filter */}
            <div>
              <label htmlFor="mode-filter" className="block text-xs font-medium text-slate-600 mb-2">
                Mode Filter
              </label>
              <select
                id="mode-filter"
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white text-slate-900"
              >
                <option value="kumulatif" className="text-slate-900">Kumulatif (Sampai Periode Tertentu)</option>
                <option value="per_bulan" className="text-slate-900">Per Bulan (Hanya Periode Tertentu)</option>
              </select>
              <p className="mt-1.5 text-xs text-slate-500">
                {filterMode === 'kumulatif' 
                  ? 'Menampilkan semua data dari awal sampai periode yang dipilih'
                  : 'Menampilkan data hanya pada periode yang dipilih'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="year-filter" className="block text-xs font-medium text-slate-600 mb-2">
                  Tahun
                </label>
                <select
                  id="year-filter"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white text-slate-900"
                >
                  <option value="" className="text-slate-500">Semua Tahun</option>
                  {years.map((year) => (
                    <option key={year} value={year.toString()} className="text-slate-900">
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="month-filter" className="block text-xs font-medium text-slate-600 mb-2">
                  Bulan
                </label>
                <select
                  id="month-filter"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 bg-white text-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
                  disabled={!selectedYear}
                >
                  <option value="" className="text-slate-500">Semua Bulan</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value} className="text-slate-900">
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleClearFilter}
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Reset
              </Button>
              <Button
                onClick={handleApplyFilter}
                className="bg-slate-900 hover:bg-slate-800 text-white"
              >
                Terapkan Filter
              </Button>
            </div>

            {(selectedYear || selectedMonth || filterMode !== 'kumulatif') && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200/60">
                <p className="text-xs font-semibold text-blue-900 mb-2">Filter Aktif:</p>
                <div className="space-y-1">
                  <p className="text-xs text-blue-800">
                    <span className="font-medium">Mode:</span>{' '}
                    {filterMode === 'kumulatif' ? 'Kumulatif (Sampai)' : 'Per Bulan (Hanya)'}
                  </p>
                  {selectedYear && (
                    <p className="text-xs text-blue-800">
                      <span className="font-medium">Periode:</span>{' '}
                      {selectedMonth && `${months.find(m => m.value === selectedMonth)?.label} `}
                      {selectedYear}
                      {filterMode === 'kumulatif' && ' dan sebelumnya'}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 rounded-xl hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-emerald-900 mb-1">Tidak Stunting</h3>
              <p className="text-3xl font-bold text-emerald-700 tracking-tight">
                {totalChildren - stuntingCases}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200/60 rounded-xl hover:shadow-lg hover:shadow-rose-200/50 transition-all duration-300 hover:-translate-y-0.5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl shadow-lg shadow-rose-500/30">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-rose-900 mb-1">Stunting</h3>
              <p className="text-3xl font-bold text-rose-700 tracking-tight">
                {stuntingCases}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Map */}
      <Card className="p-6 bg-white border border-slate-200/60 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-5 text-slate-900">
          {data.level === 'country' ? 'Peta Distribusi Provinsi' :
           data.level === 'province' ? 'Peta Distribusi Kota/Kabupaten' :
           data.level === 'city' ? 'Peta Distribusi Kecamatan' :
           'Data Individual'}
        </h2>
        <DistributionMap areas={areas} />
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {data.level !== 'country' && (
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        )}
        
        <Button 
          onClick={handleGetRecommendations}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/30"
        >
          <Lightbulb className="w-4 h-4" />
          Rekomendasi Kebijakan
        </Button>
      </div>

      {/* Area List */}
      {areas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-white border border-slate-200/60 rounded-xl shadow-sm">
            <h3 className="text-base font-semibold mb-4 text-slate-900">
              {data.level === 'country' ? 'Analisis Provinsi' :
               data.level === 'province' ? 'Analisis Kota/Kabupaten' :
               'Analisis Kecamatan'}
            </h3>
            <div className="space-y-4">
              {areas.map((area: any, index: number) => {
                const areaStuntingRate = parseFloat((area.stunting / area.total * 100).toFixed(1));
                const isHighRisk = areaStuntingRate > 30;
                
                return (
                  <div key={index} className="border-b border-slate-100 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-slate-900">{area.name}</h4>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        isHighRisk ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {areaStuntingRate}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      {area.total} anak, {area.stunting} kasus stunting
                    </p>
                    <div className="text-xs">
                      {isHighRisk ? (
                        <p className="text-rose-600 font-medium">
                          Tingkat stunting tinggi - Perlu intervensi segera
                        </p>
                      ) : (
                        <p className="text-emerald-600 font-medium">
                          Status baik - Pertahankan program
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="p-6 bg-white border border-slate-200/60 rounded-xl shadow-sm">
            <h3 className="text-base font-semibold mb-4 text-slate-900">Aksi Pemerintah</h3>
            <div className="space-y-3">
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200/60">
                <h4 className="font-semibold text-rose-900 mb-3 text-sm">Area Stunting Tinggi (&gt;30%)</h4>
                <ul className="text-xs text-rose-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>Deploy mobile health clinics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>Sediakan suplemen nutrisi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>Program edukasi intensif</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-400 mt-0.5">•</span>
                    <span>Sistem monitoring ketat</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200/60">
                <h4 className="font-semibold text-emerald-900 mb-3 text-sm">Area Stunting Rendah (&lt;=30%)</h4>
                <ul className="text-xs text-emerald-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>Pertahankan program saat ini</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>Monitoring berkala</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>Edukasi preventif</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>Awareness masyarakat</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}