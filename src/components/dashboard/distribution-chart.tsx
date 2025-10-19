'use client';

import { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const COLORS = ['#22c55e', '#ef4444']; // Hijau untuk Tidak Stunting, Merah untuk Stunting

import { getStuntingDistribution } from '@/services/child.service';
import { useUser } from '@/contexts/UserContext';

type DistributionData = {
  name: string;
  value: number;
};

export function DistributionChart() {
  const [data, setData] = useState<DistributionData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    async function fetchData() {
      try {
        const distributionData = await getStuntingDistribution(user?.role, user?.kecamatan);
        setData(distributionData);
      } catch (error) {
        console.error('Failed to fetch distribution data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} anak`, '']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}