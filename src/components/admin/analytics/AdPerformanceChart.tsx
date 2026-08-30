'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export interface AdPerformancePoint {
  date: string;
  impressions: number;
  clicks: number;
}

interface AdPerformanceChartProps {
  data: AdPerformancePoint[];
}

export function AdPerformanceChart({ data }: AdPerformanceChartProps) {
  const ctr = data.length > 0
    ? (
        (data.reduce((sum, point) => sum + point.clicks, 0) /
          Math.max(data.reduce((sum, point) => sum + point.impressions, 0), 1)) *
        100
      ).toFixed(2)
    : '0.00';

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div>
          <p className="text-xs font-semibold text-slate-500">कुल इंप्रेशन (Impressions)</p>
          <p className="text-2xl font-extrabold text-slate-900">
            {data.reduce((sum, point) => sum + point.impressions, 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500">कुल क्लिक (Clicks)</p>
          <p className="text-2xl font-extrabold text-slate-900">
            {data.reduce((sum, point) => sum + point.clicks, 0).toLocaleString('en-IN')}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500">क्लिक थ्रू रेट (CTR)</p>
          <p className="text-2xl font-extrabold text-red-700">{ctr}%</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="impressions" name="इंप्रेशन" stroke="#334155" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="clicks" name="क्लिक" stroke="#b91c1c" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
