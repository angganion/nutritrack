'use client';

import { FileSpreadsheet, Download, Printer, TrendingUp, MapPin, Users, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';

async function getReportsData(userRole?: string, userKecamatan?: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const params = new URLSearchParams();
    params.append('period', '30');
    if (userRole) params.append('userRole', userRole);
    if (userKecamatan) params.append('userKecamatan', userKecamatan);
    
    const response = await fetch(`${baseUrl}/api/dashboard/stats?${params.toString()}`, {
      cache: 'no-store'
    });
    
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export default function ReportsPage() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const currentDate = new Date();
  const { user } = useUser();

  useEffect(() => {
    async function fetchData() {
      const data = await getReportsData(user?.role, user?.kecamatan);
      setStatsData(data);
      setLoading(false);
    }
    
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleDownloadReport = (reportType: string) => {
    // Create CSV content
    let csvContent = '';
    
    if (reportType === 'monthly') {
      csvContent = `Laporan Bulanan Stunting\n`;
      csvContent += `Periode: ${currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}\n\n`;
      csvContent += `Total Anak,${statsData?.overview?.totalChildren?.value || 0}\n`;
      csvContent += `Kasus Stunting,${statsData?.overview?.stuntingCases?.value || 0}\n`;
      csvContent += `Tingkat Stunting,${statsData?.analysis?.stuntingRate || '0'}%\n`;
    } else if (reportType === 'distribution') {
      csvContent = `Laporan Distribusi Regional\n`;
      csvContent += `Wilayah Risiko Tinggi: ${statsData?.highRiskAreas?.length || 0}\n\n`;
      csvContent += `Provinsi,Stunting,Total,Rate\n`;
      statsData?.highRiskAreas?.forEach((area: any) => {
        csvContent += `${area.province},${area.stunting},${area.total},${area.rate}%\n`;
      });
    }
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-${reportType}-${currentDate.toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const reports = [
    {
      name: 'Laporan Bulanan Stunting',
      description: `Rangkuman data stunting periode ${currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} dengan statistik lengkap`,
      icon: FileSpreadsheet,
      lastGenerated: currentDate.toISOString(),
      color: 'blue',
      stats: {
        total: statsData?.overview?.totalChildren?.value || 0,
        stunting: statsData?.overview?.stuntingCases?.value || 0,
        rate: statsData?.analysis?.stuntingRate || '0',
      },
      link: '/dashboard/statistics',
    },
    {
      name: 'Peta Distribusi Regional',
      description: `Visualisasi persebaran stunting di ${statsData?.highRiskAreas?.length || 0} wilayah dengan tingkat stunting tinggi`,
      icon: MapPin,
      lastGenerated: currentDate.toISOString(),
      color: 'purple',
      stats: {
        highRisk: statsData?.highRiskAreas?.length || 0,
        provinces: statsData?.highRiskAreas?.map((a: any) => a.province).join(', ').substring(0, 50) || 'Belum ada data',
      },
      link: '/dashboard/distribution/all',
    },
    {
      name: 'Data Anak Terdaftar',
      description: 'Daftar lengkap semua anak yang terdaftar dalam sistem pemantauan',
      icon: Users,
      lastGenerated: currentDate.toISOString(),
      color: 'green',
      stats: {
        total: statsData?.overview?.totalChildren?.value || 0,
        today: statsData?.overview?.todayData?.value || 0,
      },
      link: '/dashboard/children',
    },
    {
      name: 'Analisis Tren 6 Bulan',
      description: 'Grafik dan analisis tren stunting dalam 6 bulan terakhir',
      icon: TrendingUp,
      lastGenerated: currentDate.toISOString(),
      color: 'orange',
      stats: {
        months: statsData?.monthlyTrend?.length || 0,
        avgRate: statsData?.monthlyTrend 
          ? (statsData.monthlyTrend.reduce((sum: number, m: any) => sum + parseFloat(m.rate), 0) / statsData.monthlyTrend.length).toFixed(1)
          : '0',
      },
      link: '/dashboard/statistics',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-1/3 mb-6"></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="h-24 bg-slate-100 rounded-xl"></div>
            <div className="h-24 bg-slate-100 rounded-xl"></div>
            <div className="h-24 bg-slate-100 rounded-xl"></div>
            <div className="h-24 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Laporan & Ekspor</h1>
            <p className="text-sm text-slate-500 mt-1">Akses dan unduh laporan pemantauan stunting</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-600">{currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200/60 bg-white p-4">
          <h3 className="text-xs font-medium text-slate-500">Total Anak</h3>
          <p className="text-2xl font-bold text-slate-900 mt-2 tracking-tight">{statsData?.overview?.totalChildren?.value || 0}</p>
          <p className="text-xs text-slate-400 mt-1">yang dipantau</p>
        </div>
        <div className="rounded-xl border border-slate-200/60 bg-white p-4">
          <h3 className="text-xs font-medium text-slate-500">Stunting</h3>
          <p className="text-2xl font-bold text-rose-600 mt-2 tracking-tight">{statsData?.overview?.stuntingCases?.value || 0}</p>
          <p className="text-xs text-slate-400 mt-1">{statsData?.analysis?.stuntingRate || '0'}% dari total</p>
        </div>
        <div className="rounded-xl border border-slate-200/60 bg-white p-4">
          <h3 className="text-xs font-medium text-slate-500">Area Prioritas</h3>
          <p className="text-2xl font-bold text-amber-600 mt-2 tracking-tight">{statsData?.highRiskAreas?.length || 0}</p>
          <p className="text-xs text-slate-400 mt-1">wilayah</p>
        </div>
        <div className="rounded-xl border border-slate-200/60 bg-white p-4">
          <h3 className="text-xs font-medium text-slate-500">ASI Eksklusif</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2 tracking-tight">{statsData?.analysis?.breastFeedingRate || '0'}%</p>
          <p className="text-xs text-slate-400 mt-1">anak mendapat ASI</p>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((report, index) => (
          <div
            key={report.name}
            className="group rounded-xl border border-slate-200/60 bg-white p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 group-hover:bg-slate-100 transition-colors">
                  <report.icon className="h-5 w-5 text-slate-700" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-slate-900">{report.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(report.lastGenerated).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-4">{report.description}</p>
            
            {/* Report specific stats */}
            <div className="flex flex-wrap gap-2 mb-4">
              {report.stats && Object.entries(report.stats).map(([key, value]) => (
                <div key={key} className="rounded-lg bg-slate-50 px-2.5 py-1.5 border border-slate-100">
                  <span className="text-xs text-slate-500 capitalize">{key}: </span>
                  <span className="text-xs font-semibold text-slate-900">{value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Link
                href={report.link}
                className="flex-1 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-center"
              >
                Lihat Detail
              </Link>
              <button
                onClick={() => handleDownloadReport(index === 0 ? 'monthly' : 'distribution')}
                className="px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-indigo-500/30"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}