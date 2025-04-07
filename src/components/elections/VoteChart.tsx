
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';

interface Candidate {
  id: string;
  name: string;
  votes: number;
  color: string;
}

interface VoteChartProps {
  candidates: Candidate[];
  isLive?: boolean;
  totalVotes: number;
}

export const VoteChart = ({ candidates, isLive = false, totalVotes }: VoteChartProps) => {
  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Election Results</CardTitle>
          {isLive && (
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm text-green-600 font-medium">Live Updates</span>
            </div>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Total Votes: {totalVotes}</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedCandidates}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12 }} 
                width={100}
              />
              <Tooltip 
                formatter={(value) => [`${value} votes`, 'Votes']}
                labelFormatter={(value) => `Candidate: ${value}`}
              />
              <Legend />
              <Bar 
                dataKey="votes" 
                name="Votes" 
                radius={[0, 4, 4, 0]}
              >
                {candidates.map((candidate) => (
                  <Cell key={candidate.id} fill={candidate.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoteChart;
