'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, TrendingUp, Activity, Calendar, Sparkles, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/contexts/UserContext';

export default function ChildDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();

  // Fetch history by NIK
  const { data: historyData, isLoading } = useQuery({
    queryKey: ['child-history', id, user?.role, user?.kecamatan],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (user?.role) params.append('userRole', user.role);
      if (user?.kecamatan) params.append('userKecamatan', user.kecamatan);
      
      const response = await fetch(`/api/children/history/${id}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch child history');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-200 rounded-xl animate-pulse" />
          <div className="lg:col-span-2 h-64 bg-slate-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!historyData) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Data tidak ditemukan</p>
      </div>
    );
  }

  const latestRecord = historyData.latestRecord;
  const history = historyData.history;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/children"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Anak
        </Link>
      </div>

      {/* NIK & Status Info */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <User className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{historyData.nik ? 'NIK Anak' : 'ID Anak'}</p>
              <h1 className="text-2xl font-bold text-slate-900">
                {historyData.nik || latestRecord.id}
              </h1>
              <p className="text-sm text-slate-600 mt-1">{history.length} pemeriksaan tercatat</p>
            </div>
          </div>
          <Link
            href={`/dashboard/child-recommendations/${latestRecord.id}`}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold rounded-lg hover:from-indigo-700 hover:to-blue-700 shadow-lg shadow-indigo-500/30 transition-all duration-200"
          >
            <Sparkles className="h-4 w-4" />
            Dapatkan Rekomendasi AI
          </Link>
        </div>
      </div>

      {/* Latest Record */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Data Terbaru</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Usia</p>
            <p className="text-lg font-semibold text-slate-900">{latestRecord.age} bulan</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Berat Badan</p>
            <p className="text-lg font-semibold text-slate-900">{latestRecord.body_weight} kg</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Tinggi Badan</p>
            <p className="text-lg font-semibold text-slate-900">{latestRecord.body_length} cm</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Status AI Antropometri</p>
            <p className={`text-lg font-semibold ${latestRecord.stunting ? 'text-rose-600' : 'text-emerald-600'}`}>
              {latestRecord.stunting ? 'Stunting' : 'Normal'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Status AI Gambar</p>
            <p className={`text-lg font-semibold ${latestRecord.image_is_stunting ? 'text-rose-600' : 'text-emerald-600'}`}>
              {latestRecord.image_is_stunting ? 'Stunting' : 'Normal'}
            </p>
          </div>
        </div>
      </div>

      {/* History Timeline */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-slate-900">Riwayat Pemeriksaan</h2>
        </div>
        
        <div className="space-y-4">
          {history.map((record: any, index: number) => (
            <div 
              key={record.id}
              className="relative pl-8 pb-4 last:pb-0"
            >
              {/* Timeline line */}
              {index !== history.length - 1 && (
                <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-slate-200" />
              )}
              
              {/* Timeline dot */}
              <div className={`absolute left-0 top-1.5 h-5 w-5 rounded-full border-2 ${
                index === 0 
                  ? 'bg-indigo-500 border-indigo-500' 
                  : 'bg-white border-slate-300'
              }`} />
              
              {/* Content */}
              <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(record.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    {index === 0 && (
                      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-100 text-indigo-700">
                        Terbaru
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      record.stunting 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      AI Antro: {record.stunting ? 'Stunting' : 'Normal'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      record.image_is_stunting 
                        ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      AI Gambar: {record.image_is_stunting ? 'Stunting' : 'Normal'}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Usia</p>
                    <p className="font-semibold text-slate-900">{record.age} bulan</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Berat</p>
                    <p className="font-semibold text-slate-900">{record.body_weight} kg</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Tinggi</p>
                    <p className="font-semibold text-slate-900">{record.body_length} cm</p>
                  </div>
                </div>

                {record.breast_feeding && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs text-emerald-600 font-medium">✓ ASI Eksklusif</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}