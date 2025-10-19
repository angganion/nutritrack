'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { useUser } from '@/contexts/UserContext';

export function StuntingPrevalenceChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    async function fetchData() {
      try {
        const params = new URLSearchParams();
        params.append('period', '180');
        if (user?.role) params.append('userRole', user.role);
        if (user?.kecamatan) params.append('userKecamatan', user.kecamatan);
        
        const response = await fetch(`/api/dashboard/stats?${params.toString()}`);
        const result = await response.json();
        
        if (result.monthlyTrend) {
          const chartData = result.monthlyTrend.map((item: any) => ({
            month: item.month,
            rate: parseFloat(item.rate),
            total: item.total,
            stunting: item.stunting,
          }));
          setData(chartData);
        }
      } catch (error) {
        console.error('Failed to fetch prevalence data:', error);
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
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'Prevalensi Stunting (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 'auto']}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900">{data.month}</p>
                    <p className="text-sm text-gray-600">Total: {data.total} anak</p>
                    <p className="text-sm text-red-600">Stunting: {data.stunting} anak</p>
                    <p className="text-sm font-bold text-gray-900">Prevalensi: {data.rate}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" label="Target WHO (20%)" />
          <Line
            type="monotone"
            dataKey="rate"
            stroke="#ef4444"
            strokeWidth={3}
            name="Prevalensi Stunting (%)"
            dot={{ fill: '#ef4444', r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


