'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  User, 
  Sparkles, 
  UtensilsCrossed, 
  Activity, 
  Shield, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function ChildRecommendationsPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['child-recommendations', id],
    queryFn: async () => {
      const response = await fetch(`/api/child-recommendations/${id}`);
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/dashboard/children`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="relative">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin" />
            <Sparkles className="w-8 h-8 text-indigo-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">Membuat Rekomendasi</h2>
            <p className="text-slate-600">AI sedang menganalisis data anak...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Gagal Memuat Rekomendasi</h2>
          <p className="text-slate-600 mb-4">{error?.toString() || 'Terjadi kesalahan'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const { child, recommendations } = data;
  const healthStatus = recommendations.healthStatus;
  const recs = recommendations.recommendations;
  const mealPlan = recommendations.mealPlan;
  const localFoods = recommendations.localFoods;
  const guidance = recommendations.parentGuidance;
  const followUp = recommendations.followUp;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'from-rose-50 to-pink-50 border-rose-200/60 text-rose-700';
      case 'medium': return 'from-amber-50 to-orange-50 border-amber-200/60 text-amber-700';
      case 'low': return 'from-emerald-50 to-teal-50 border-emerald-200/60 text-emerald-700';
      default: return 'from-slate-50 to-gray-50 border-slate-200/60 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href={`/dashboard/children/${child.nik || child.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Detail Anak
        </Link>
      </div>

      {/* Child Info & Risk Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-slate-200/60 bg-white p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <User className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{child.nik ? 'NIK' : 'ID'}</p>
              <h1 className="text-xl font-bold text-slate-900">{child.nik || child.id}</h1>
              <p className="text-sm text-slate-600">
                {child.gender === 'male' ? 'Laki-laki' : 'Perempuan'} • {child.age} bulan
              </p>
            </div>
          </div>


          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500">Berat Badan</p>
              <p className="text-base font-semibold text-slate-900">{child.bodyWeight} kg</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500">Tinggi Badan</p>
              <p className="text-base font-semibold text-slate-900">{child.bodyLength} cm</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500">ASI</p>
              <p className="text-base font-semibold text-slate-900">{child.breastFeeding ? 'Ya' : 'Tidak'}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500">AI Antropometri</p>
              <p className={`text-base font-semibold ${child.stunting ? 'text-rose-600' : 'text-emerald-600'}`}>
                {child.stunting ? 'Stunting' : 'Normal'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500">AI Gambar</p>
              <p className={`text-base font-semibold ${child.imageIsStunting ? 'text-rose-600' : 'text-emerald-600'}`}>
                {child.imageIsStunting ? 'Stunting' : 'Normal'}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-xl border bg-gradient-to-br ${getRiskColor(healthStatus.stuntingRisk)} p-6`}>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-sm font-semibold">Tingkat Risiko</h3>
          </div>
          <p className="text-2xl font-bold capitalize mb-2">{healthStatus.stuntingRisk === 'high' ? 'Tinggi' : healthStatus.stuntingRisk === 'medium' ? 'Sedang' : 'Rendah'}</p>
          <p className="text-xs opacity-90">{healthStatus.nutritionalStatus}</p>
        </div>
      </div>

      {/* Growth Assessment */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Penilaian Pertumbuhan</h2>
        <p className="text-slate-700">{healthStatus.growthAssessment}</p>
      </div>

      {/* Recommendations Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrition */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <UtensilsCrossed className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">Rekomendasi Nutrisi</h3>
          </div>
          <div className="space-y-2">
            {recs.nutrition && recs.nutrition.length > 0 ? (
              recs.nutrition.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">Rekomendasi nutrisi tidak tersedia</p>
            )}
          </div>
        </div>

        {/* Activities */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">Aktivitas & Stimulasi</h3>
          </div>
          <div className="space-y-2">
            {recs.activities && recs.activities.length > 0 ? (
              recs.activities.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">Rekomendasi aktivitas tidak tersedia</p>
            )}
          </div>
        </div>

        {/* Monitoring */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">Pemantauan</h3>
          </div>
          <div className="space-y-2">
            {recs.monitoring && recs.monitoring.length > 0 ? (
              recs.monitoring.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">Rekomendasi pemantauan tidak tersedia</p>
            )}
          </div>
        </div>

        {/* Medical Follow-up */}
        <div className="rounded-xl border border-slate-200/60 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">Tindak Lanjut Medis</h3>
          </div>
          <div className="space-y-2">
            {recs.medical && recs.medical.length > 0 ? (
              recs.medical.map((item: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-700">{item}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 italic">Rekomendasi medis tidak tersedia</p>
            )}
          </div>
        </div>
      </div>

      {/* Supplements */}
      {recs.supplements && recs.supplements.length > 0 && (
        <div className="rounded-xl border border-slate-200/60 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">Rekomendasi Suplemen</h3>
          </div>
          <div className="space-y-2">
            {recs.supplements.map((item: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meal Plan */}
      <div className="rounded-xl border border-slate-200/60 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Rencana Makan Harian</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Sarapan</h4>
            <ul className="space-y-1">
              {mealPlan.breakfast.map((item: string, index: number) => (
                <li key={index} className="text-xs text-slate-600 flex items-start gap-1">
                  <span className="text-indigo-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Makan Siang</h4>
            <ul className="space-y-1">
              {mealPlan.lunch.map((item: string, index: number) => (
                <li key={index} className="text-xs text-slate-600 flex items-start gap-1">
                  <span className="text-indigo-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Makan Malam</h4>
            <ul className="space-y-1">
              {mealPlan.dinner.map((item: string, index: number) => (
                <li key={index} className="text-xs text-slate-600 flex items-start gap-1">
                  <span className="text-indigo-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Camilan</h4>
            <ul className="space-y-1">
              {mealPlan.snacks.map((item: string, index: number) => (
                <li key={index} className="text-xs text-slate-600 flex items-start gap-1">
                  <span className="text-indigo-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Local Foods */}
      {localFoods && (
        <div className="rounded-xl border border-slate-200/60 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Makanan Lokal Bergizi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Sumber Protein</h4>
              <ul className="space-y-1">
                {localFoods.proteinSources && localFoods.proteinSources.length > 0 ? (
                  localFoods.proteinSources.map((item: string, index: number) => (
                    <li key={index} className="text-xs text-slate-600 flex items-start gap-1">
                      <span className="text-indigo-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-500 italic">Tidak tersedia</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Sumber Zat Besi</h4>
              <ul className="space-y-1">
                {localFoods.ironSources && localFoods.ironSources.length > 0 ? (
                  localFoods.ironSources.map((item: string, index: number) => (
                    <li key={index} className="text-xs text-slate-600 flex items-start gap-1">
                      <span className="text-indigo-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-500 italic">Tidak tersedia</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Sumber Kalsium</h4>
              <ul className="space-y-1">
                {localFoods.calciumSources && localFoods.calciumSources.length > 0 ? (
                  localFoods.calciumSources.map((item: string, index: number) => (
                    <li key={index} className="text-xs text-slate-600 flex items-start gap-1">
                      <span className="text-indigo-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-500 italic">Tidak tersedia</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Sumber Vitamin</h4>
              <ul className="space-y-1">
                {localFoods.vitaminSources && localFoods.vitaminSources.length > 0 ? (
                  localFoods.vitaminSources.map((item: string, index: number) => (
                    <li key={index} className="text-xs text-slate-600 flex items-start gap-1">
                      <span className="text-indigo-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-500 italic">Tidak tersedia</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Parent Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-emerald-900">Yang Harus Dilakukan</h3>
          </div>
          <div className="space-y-2">
            {guidance.dosList.map((item: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-emerald-600 text-xs mt-1">✓</span>
                <p className="text-sm text-emerald-800">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-rose-200/60 bg-gradient-to-br from-rose-50 to-pink-50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="h-5 w-5 text-rose-600" />
            <h3 className="text-base font-semibold text-rose-900">Yang Harus Dihindari</h3>
          </div>
          <div className="space-y-2">
            {guidance.dontsList.map((item: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-rose-600 text-xs mt-1">✗</span>
                <p className="text-sm text-rose-800">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <h3 className="text-base font-semibold text-amber-900">Tanda Bahaya</h3>
          </div>
          <div className="space-y-2">
            {guidance.warningSigns.map((item: string, index: number) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-amber-600 text-xs mt-1">⚠</span>
                <p className="text-sm text-amber-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Referral Urgency */}
      {guidance.referralUrgency && (
        <div className="rounded-xl border border-slate-200/60 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-slate-900">Tingkat Urgensi Rujukan</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              guidance.referralUrgency === 'immediate' 
                ? 'bg-red-100 text-red-800' 
                : guidance.referralUrgency === 'urgent'
                ? 'bg-orange-100 text-orange-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {guidance.referralUrgency === 'immediate' 
                ? 'Segera' 
                : guidance.referralUrgency === 'urgent'
                ? 'Mendesak'
                : 'Rutin'
              }
            </span>
            <p className="text-sm text-slate-600">
              {guidance.referralUrgency === 'immediate' 
                ? 'Perlu tindakan segera' 
                : guidance.referralUrgency === 'urgent'
                ? 'Perlu perhatian khusus'
                : 'Dapat dilakukan sesuai jadwal'
              }
            </p>
          </div>
        </div>
      )}

      {/* Follow-up */}
      <div className="rounded-xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/50 to-blue-50/50 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Tindak Lanjut</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Pemeriksaan Berikutnya</h4>
            <p className="text-indigo-700 font-medium">{followUp.nextCheckup}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Tindakan Rujukan</h4>
            <p className="text-slate-700 text-sm">{followUp.referralAction}</p>
          </div>
        </div>
        
        {/* Resources */}
        {followUp.resources && followUp.resources.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-2">Sumber Informasi</h4>
            <ul className="space-y-1">
              {followUp.resources.map((item: string, index: number) => (
                <li key={index} className="text-xs text-slate-600">• {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

