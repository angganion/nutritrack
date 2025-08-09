import { OverviewCards } from '@/components/dashboard/overview-cards';
import { StuntingChart } from '@/components/dashboard/stunting-chart';
import { DistributionChart } from '@/components/dashboard/distribution-chart';
import { DataTable } from '@/components/dashboard/data-table';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Selamat datang kembali! Berikut adalah ringkasan data pemantauan stunting hari ini.</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
        
        {/* Quick Stats Banner */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 border border-green-200 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Sistem Aktif</p>
              <p className="text-xs text-green-600">Semua layanan berjalan normal</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border border-blue-200 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Data Terbaru</p>
              <p className="text-xs text-blue-600">Update 5 menit yang lalu</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 p-4 border border-orange-200 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-800">Perhatian</p>
              <p className="text-xs text-orange-600">3 kasus memerlukan tindakan</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Ringkasan Data</h2>
          <div className="text-sm text-gray-600">Periode: 30 hari terakhir</div>
        </div>
        <OverviewCards />
      </div>
      
      {/* Charts Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Analisis Data</h2>
          <div className="flex items-center space-x-2">
                          <select className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>6 bulan terakhir</option>
              <option>1 tahun terakhir</option>
              <option>2 tahun terakhir</option>
            </select>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Tren Pertumbuhan</h3>
                  <p className="text-sm text-gray-600">Perkembangan tinggi badan anak</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-gray-600">Aktif</span>
                </div>
              </div>
              <StuntingChart />
            </div>
          </div>
          
          <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
            <div className="relative">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Distribusi Status</h3>
                  <p className="text-sm text-gray-600">Persentase status stunting</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-600">Real-time</span>
                </div>
              </div>
              <DistributionChart />
            </div>
          </div>
        </div>
      </div>
      
      {/* Data Table */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Data Anak Terbaru</h2>
          <button className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105">
            Lihat Semua Data
          </button>
        </div>
        
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg">
          <div className="relative">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Daftar Anak</h3>
                <p className="text-sm text-gray-600">Data lengkap anak yang dipantau</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">Terakhir diperbarui: 2 menit yang lalu</span>
              </div>
            </div>
            <DataTable />
          </div>
        </div>
      </div>
    </div>
  );
}