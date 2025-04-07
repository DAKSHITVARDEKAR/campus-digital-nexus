
import React from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine,
  Label
} from 'recharts';

interface ElectionTrendData {
  month: string;
  participation: number;
  target?: number;
}

interface ElectionTrendChartProps {
  data: ElectionTrendData[];
  title?: string;
  showTarget?: boolean;
  targetValue?: number;
}

export const ElectionTrendChart = ({ 
  data, 
  title = "Election Participation Trends", 
  showTarget = true,
  targetValue = 75
}: ElectionTrendChartProps) => {
  // Calculate average participation
  const averageParticipation = data.reduce((sum, item) => sum + item.participation, 0) / data.length;
  
  // Add target value to data if showTarget is true
  const enhancedData = showTarget 
    ? data.map(item => ({ ...item, target: targetValue })) 
    : data;

  // Determine if we're showing improvement or decline
  const firstValue = data[0]?.participation || 0;
  const lastValue = data[data.length - 1]?.participation || 0;
  const trend = lastValue > firstValue 
    ? { color: '#4CAF50', text: 'Improving' }
    : { color: '#F44336', text: 'Declining' };

  return (
    <div className="w-full h-full flex flex-col">
      {title && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <div className="flex items-center text-sm">
            <span className="mr-2">Trend:</span>
            <span style={{ color: trend.color }}>{trend.text}</span>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500 mb-2">
        Average participation: <span className="font-medium">{averageParticipation.toFixed(1)}%</span>
      </div>
      
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={enhancedData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              padding={{ left: 10, right: 10 }}
            >
              <Label value="Month" position="bottom" offset={10} />
            </XAxis>
            <YAxis 
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
              padding={{ top: 10, bottom: 10 }}
            >
              <Label 
                value="Participation Rate" 
                angle={-90} 
                position="left" 
                style={{ textAnchor: 'middle' }} 
                offset={-10} 
              />
            </YAxis>
            
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Participation']}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #f0f0f0',
                borderRadius: '4px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            />
            
            <Legend verticalAlign="top" height={36} />
            
            {/* Average participation reference line */}
            <ReferenceLine 
              y={averageParticipation} 
              stroke="#888" 
              strokeDasharray="3 3"
              isFront={false}
            >
              <Label 
                value="Average" 
                position="right" 
                fill="#888" 
              />
            </ReferenceLine>
            
            {/* Target reference line if showing target */}
            {showTarget && (
              <ReferenceLine 
                y={targetValue} 
                stroke="#ff7300" 
                strokeDasharray="3 3"
                isFront={false}
              >
                <Label 
                  value="Target" 
                  position="right" 
                  fill="#ff7300" 
                />
              </ReferenceLine>
            )}
            
            {/* Target line if showing target */}
            {showTarget && (
              <Line
                type="monotone"
                dataKey="target"
                stroke="#ff7300"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
              />
            )}
            
            {/* Main participation line */}
            <Line
              type="monotone"
              dataKey="participation"
              stroke="#8884d8"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 8, stroke: '#8884d8', strokeWidth: 2, fill: '#fff' }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ElectionTrendChart;
