'use client';

import { AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/card';

// Import map component dynamically
const DistributionMap = dynamic(() => import('@/components/distribution-map'), { 
  ssr: false,
  loading: () => <div className="w-full h-[600px] bg-gray-100 rounded-lg animate-pulse" />
});

export default function DistributionPage() {
  // Hardcoded data untuk daerah terpencil yang high risk
  const hardcodedAreas = [
    {
      name: "Desa Terpencil Papua",
      coordinates: [-4.2699, 138.0803] as [number, number],
      total: 45,
      stunting: 18,
      children: [],
      description: "Daerah pegunungan dengan akses terbatas"
    },
    {
      name: "Pulau Nias",
      coordinates: [1.1000, 97.6000] as [number, number],
      total: 32,
      stunting: 12,
      children: [],
      description: "Pulau terpencil dengan infrastruktur minimal"
    },
    {
      name: "Sumba Timur",
      coordinates: [-9.6500, 120.2500] as [number, number],
      total: 28,
      stunting: 11,
      children: [],
      description: "Daerah kering dengan keterbatasan air bersih"
    },
    {
      name: "Pulau Mentawai",
      coordinates: [-2.2000, 99.2000] as [number, number],
      total: 38,
      stunting: 15,
      children: [],
      description: "Kepulauan terpencil dengan akses kesehatan terbatas"
    },
    {
      name: "Pegunungan Meratus",
      coordinates: [-2.5000, 115.5000] as [number, number],
      total: 25,
      stunting: 8,
      children: [],
      description: "Daerah pegunungan dengan isolasi geografis"
    },
    {
      name: "Pulau Alor",
      coordinates: [-8.2500, 124.7500] as [number, number],
      total: 30,
      stunting: 9,
      children: [],
      description: "Pulau kecil dengan sumber daya terbatas"
    },
    {
      name: "Pegunungan Arfak",
      coordinates: [-1.2000, 133.8000] as [number, number],
      total: 35,
      stunting: 14,
      children: [],
      description: "Daerah pegunungan tinggi dengan akses sulit"
    },
    {
      name: "Pulau Simeulue",
      coordinates: [2.5000, 96.0000] as [number, number],
      total: 22,
      stunting: 6,
      children: [],
      description: "Pulau terpencil dengan infrastruktur dasar"
    }
  ];

  // Calculate statistics from hardcoded data
  const totalChildren = hardcodedAreas.reduce((sum, area) => sum + area.total, 0);
  const stuntingCases = hardcodedAreas.reduce((sum, area) => sum + area.stunting, 0);
  const stuntingRate = totalChildren > 0 ? (stuntingCases / totalChildren * 100).toFixed(1) : 0;

  const areas = hardcodedAreas;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Stunting Distribution Map</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Children: {totalChildren}</p>
          <p className="text-sm text-gray-600">Stunting Rate: {stuntingRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Tidak Stunting</h3>
              <p className="text-2xl font-bold text-green-600">
                {totalChildren - stuntingCases}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Stunting</h3>
              <p className="text-2xl font-bold text-red-600">
                {stuntingCases}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-white shadow-lg border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Distribution Map</h2>
        <DistributionMap areas={areas} />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Area Recommendations</h3>
          <div className="space-y-4">
            {areas.map((area, index) => {
              const stuntingRate = (area.stunting / area.total * 100).toFixed(1);
              const isHighRisk = stuntingRate > 30;
              
              return (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-gray-900">{area.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isHighRisk ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {stuntingRate}% stunting
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {area.total} children, {area.stunting} stunting cases
                  </p>
                  <p className="text-sm text-gray-600 mb-2 italic">
                    {area.description}
                  </p>
                  <div className="text-sm text-gray-700">
                    {isHighRisk ? (
                      <p className="text-red-700 font-medium">
                        ⚠️ High stunting rate. Immediate intervention needed. Focus on nutrition programs and healthcare access.
                      </p>
                    ) : (
                      <p className="text-green-700 font-medium">
                        ✅ Good status. Maintain current programs and continue monitoring.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4 text-gray-900">Government Actions</h3>
          <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2">High Stunting Rate Areas (&gt;30%)</h4>
              <ul className="text-sm text-red-800 space-y-1">
                <li>• Deploy mobile health clinics</li>
                <li>• Provide nutritional supplements</li>
                <li>• Conduct intensive education programs</li>
                <li>• Establish monitoring systems</li>
                <li>• Emergency nutrition intervention</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Low Stunting Rate Areas (&lt;=30%)</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Maintain current programs</li>
                <li>• Regular monitoring</li>
                <li>• Preventive education</li>
                <li>• Community awareness</li>
                <li>• Continue best practices</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 