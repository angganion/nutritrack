'use client';

import { OverviewCards } from '@/components/dashboard/overview-cards';
import { StuntingPrevalenceChart } from '@/components/dashboard/stunting-prevalence-chart';
import { AgeDistributionChart } from '@/components/dashboard/age-distribution-chart';
import { DistributionChart } from '@/components/dashboard/distribution-chart';
import { DataTable } from '@/components/dashboard/data-table';
import { DashboardFilters } from '@/components/dashboard/dashboard-filters';
import { UserManagement } from '@/components/dashboard/user-management';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle, MapPin, Users, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { redirect } from 'next/navigation';
import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';


function DashboardContent({
  searchParams,
}: {
  searchParams: Promise<{ province?: string; city?: string }>;
}) {
  const { user, logout } = useUser();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [params, setParams] = useState<{ province?: string; city?: string }>({});

  useEffect(() => {
    if (!user) {
      redirect('/login');
      return;
    }
    
    const loadParams = async () => {
      const resolvedParams = await searchParams;
      setParams(resolvedParams);
    };
    
    loadParams();
  }, [user, searchParams]);

  useEffect(() => {
    if (user) {
      const loadDashboardData = async () => {
        setIsLoading(true);
        try {
          const urlParams = new URLSearchParams();
          if (params.province) urlParams.append('province', params.province);
          if (params.city) urlParams.append('city', params.city);
          if (user.role) urlParams.append('userRole', user.role);
          if (user.kecamatan) urlParams.append('userKecamatan', user.kecamatan);
          
          const response = await fetch(`/api/dashboard/stats?${urlParams.toString()}`);
          if (response.ok) {
            const data = await response.json();
            setDashboardData(data);
          }
        } catch (error) {
          console.error('Error loading dashboard data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadDashboardData();
    }
  }, [user, params]);

  if (!user) {
    return null;
  }

  const lastUpdate = dashboardData?.lastUpdated 
    ? new Date(dashboardData.lastUpdated).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : 'N/A';
  
  const highRiskCount = dashboardData?.highRiskAreas?.length || 0;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Stunting</h1>
            <p className="mt-1 text-sm text-slate-500">
              Ringkasan data pemantauan stunting
              {user.role === 'puskesmas' && user.kecamatan && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Kecamatan: {user.kecamatan}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">{new Date().toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200/60">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-xs font-medium text-blue-600 capitalize">{user.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200/60 hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-4 w-4 text-red-400" />
              <span className="text-xs font-medium text-red-600">Logout</span>
            </button>
          </div>
        </div>
        
        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="group flex items-center gap-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 p-4 border border-emerald-200/60 hover:shadow-lg hover:shadow-emerald-200/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-900">Sistem Aktif</p>
              <p className="text-xs text-emerald-600">Layanan normal</p>
            </div>
          </div>
          
          <div className="group flex items-center gap-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 border border-blue-200/60 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-blue-900">Update Terakhir</p>
              <p className="text-xs text-blue-600">{lastUpdate}</p>
            </div>
          </div>
          
          <div className="group flex items-center gap-3 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 border border-amber-200/60 hover:shadow-lg hover:shadow-amber-200/50 transition-all duration-300 hover:-translate-y-0.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-900">Area Prioritas</p>
              <p className="text-xs text-amber-600">{highRiskCount} wilayah</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overview Cards */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Ringkasan Data</h2>
          <div className="text-xs text-slate-500 px-3 py-1 rounded-full bg-slate-100">
            Periode: {dashboardData?.analysis?.period || '30 hari'}
          </div>
        </div>
         <OverviewCards data={dashboardData} />
      </div>
      
      {/* Charts Section */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Analisis Tren</h2>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Stunting:</span>
              <span className={`font-semibold ${parseFloat(dashboardData?.analysis?.stuntingRate || '0') > 20 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {dashboardData?.analysis?.stuntingRate || '0'}%
              </span>
            </div>
            <div className="h-3 w-px bg-slate-200"></div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">ASI:</span>
              <span className="font-semibold text-blue-600">
                {dashboardData?.analysis?.breastFeedingRate || '0'}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Tren Prevalensi Stunting</h3>
              <p className="text-xs text-slate-500 mt-1">6 bulan terakhir</p>
            </div>
            <StuntingPrevalenceChart />
          </div>
          
          <div className="rounded-xl border border-slate-200/60 bg-white p-6 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200">
            <div className="mb-5">
              <h3 className="text-sm font-semibold text-slate-900">Distribusi per Kelompok Usia</h3>
              <p className="text-xs text-slate-500 mt-1">Stunting berdasarkan umur</p>
            </div>
            <AgeDistributionChart />
          </div>
        </div>

        {/* Filter Wilayah - Only for Admin */}
        {user.role === 'admin' && (
          <div className="mt-5">
            <DashboardFilters />
          </div>
        )}

        {/* Status Distribution */}
        <div className="mt-5 rounded-xl border border-slate-200/60 bg-white p-6">
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-900">Distribusi Status</h3>
            <p className="text-xs text-slate-500 mt-1">Proporsi stunting vs normal</p>
          </div>
          <DistributionChart />
        </div>
      </div>
      
      {/* Data Table */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Data Anak Terbaru</h2>
          <button className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-colors">
            Lihat Semua
          </button>
        </div>
        
        <div className="rounded-xl border border-slate-200/60 bg-white p-6">
          <DataTable />
        </div>
      </div>

      {/* User Management - Only for Admin */}
      {user.role === 'admin' && (
        <div>
          <div className="rounded-xl border border-slate-200/60 bg-white p-6">
            <UserManagement />
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ province?: string; city?: string }>;
}) {
  return <DashboardContent searchParams={searchParams} />;
}