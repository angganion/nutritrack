'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

import { getChildById } from '@/services/child.service';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Import map component dynamically to avoid SSR issues
const Map = dynamic(() => import('@/components/map'), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-100 rounded-lg animate-pulse" />
});

export default function ChildDetailPage() {
  const { id } = useParams();
  const { data: child, isLoading } = useQuery({
    queryKey: ['child', id],
    queryFn: () => getChildById(id as string),
  });

  if (isLoading) {
    return <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
      </div>
    </div>;
  }

  if (!child) {
    return <div>Child not found</div>;
  }

  const recommendations = getRecommendations(child);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/dashboard/children" className="text-blue-600 hover:underline font-medium">
          ← Back to Children
        </Link>
        <p className="text-gray-600 font-medium">ID: {child.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Measurements</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Age:</span>
              <span className="text-gray-900 font-semibold">{child.age} months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Weight:</span>
              <span className="text-gray-900 font-semibold">{child.body_weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Height:</span>
              <span className="text-gray-900 font-semibold">{child.body_length} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Stunting Status:</span>
              <span className={`font-semibold ${child.stunting ? 'text-red-600' : 'text-green-600'}`}>
                {child.stunting ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Breastfeeding:</span>
              <span className={`font-semibold ${child.breast_feeding ? 'text-green-600' : 'text-red-600'}`}>
                {child.breast_feeding ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Recommendations</h2>
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="text-gray-800 leading-relaxed flex items-start">
                <span className="text-blue-600 mr-2 mt-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {child.latitude && child.longitude && (
        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Location</h2>
          </div>
          <Map 
            center={[child.latitude, child.longitude]} 
            markers={[{ 
              position: [child.latitude, child.longitude],
              popup: `Child's Location`
            }]} 
          />
        </Card>
      )}

      <Card className="p-6 bg-white shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Record Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Record Date:</span>
            <span className="text-gray-900 font-semibold">
              {new Date(child.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Gender:</span>
            <span className="text-gray-900 font-semibold">
              {child.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Birth Weight:</span>
            <span className="text-gray-900 font-semibold">{child.birth_weight} kg</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">Birth Length:</span>
            <span className="text-gray-900 font-semibold">{child.birth_length} cm</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function getRecommendations(record: any) {
  const recommendations = [];

  // Basic recommendations based on stunting status
  if (record.stunting) {
    recommendations.push(
      "Konsultasikan dengan dokter atau ahli gizi untuk penanganan stunting",
      "Pastikan asupan protein yang cukup (daging, ikan, telur, kacang-kacangan)",
      "Berikan makanan yang kaya zat besi dan zinc",
      "Terapkan pola makan gizi seimbang"
    );
  }

  // Recommendations based on breastfeeding status
  if (!record.breast_feeding && record.age <= 24) {
    recommendations.push(
      "Pertimbangkan untuk memberikan ASI eksklusif sampai usia 6 bulan",
      "Konsultasikan dengan konselor laktasi untuk bantuan menyusui"
    );
  }

  // General recommendations for all children
  recommendations.push(
    "Lakukan pemeriksaan pertumbuhan secara rutin",
    "Pastikan imunisasi lengkap sesuai usia",
    "Terapkan pola hidup bersih dan sehat"
  );

  return recommendations;
}