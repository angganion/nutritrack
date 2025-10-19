'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useUser } from '@/contexts/UserContext';

export function AgeDistributionChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams();
        if (user?.role) params.append('userRole', user.role);
        if (user?.kecamatan) params.append('userKecamatan', user.kecamatan);
        
        const response = await fetch(`/api/dashboard/age-analysis?${params.toString()}`);
        const result = await response.json();
        
        if (result.ageGroups) {
          setData(result.ageGroups);
        }
      } catch (error) {
        console.error('Failed to fetch age distribution:', error);
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

  const COLORS = ['#ef4444', '#22c55e'];

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="ageGroup" 
            label={{ value: 'Kelompok Usia (bulan)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis label={{ value: 'Jumlah Anak', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900">{data.ageGroup} bulan</p>
                    <p className="text-sm text-gray-600">Total: {data.total} anak</p>
                    <p className="text-sm text-red-600">Stunting: {data.stunting}</p>
                    <p className="text-sm text-green-600">Normal: {data.normal}</p>
                    <p className="text-sm font-bold text-gray-900">Rate: {data.rate}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="stunting" name="Stunting" stackId="a">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[0]} />
            ))}
          </Bar>
          <Bar dataKey="normal" name="Normal" stackId="a">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[1]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}


