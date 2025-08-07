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
} from 'recharts';

import { getChildGrowthTrend } from '@/services/child.service';

type GrowthData = {
  age: number;
  weight: number;
  height: number;
};

export function StuntingChart() {
  const [data, setData] = useState<GrowthData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const trendData = await getChildGrowthTrend();
        const formattedData = trendData.map(item => ({
          age: item.age,
          weight: item.body_weight,
          height: item.body_length,
        }));
        setData(formattedData);
      } catch (error) {
        console.error('Failed to fetch growth trend data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
            dataKey="age"
            label={{ value: 'Usia (bulan)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis yAxisId="left" label={{ value: 'Berat (kg)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" label={{ value: 'Tinggi (cm)', angle: 90, position: 'insideRight' }} />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="weight"
            stroke="#8884d8"
            name="Berat Badan"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="height"
            stroke="#82ca9d"
            name="Tinggi Badan"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}