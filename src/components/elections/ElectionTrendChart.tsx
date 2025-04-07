
import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ElectionTrendData {
  month: string;
  participation: number;
}

interface ElectionTrendChartProps {
  data: ElectionTrendData[];
}

export const ElectionTrendChart = ({ data }: ElectionTrendChartProps) => {
  return (
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
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `${value}%`} />
        <Tooltip formatter={(value) => [`${value}%`, 'Participation']} />
        <Legend />
        <Line
          type="monotone"
          dataKey="participation"
          stroke="#8884d8"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ElectionTrendChart;
