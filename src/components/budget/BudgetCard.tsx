
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface BudgetCardProps {
  id: string;
  title: string;
  department: string;
  allocated: number;
  spent: number;
  remaining: number;
  lastUpdated: string;
}

export const BudgetCard = ({
  id,
  title,
  department,
  allocated,
  spent,
  remaining,
  lastUpdated,
}: BudgetCardProps) => {
  const percentSpent = Math.round((spent / allocated) * 100);
  
  const getProgressColor = (percent: number) => {
    if (percent > 90) return 'bg-red-500';
    if (percent > 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <Card className="overflow-hidden h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">{department}</p>
      </CardHeader>
      
      <CardContent className="py-2">
        <div className="grid grid-cols-3 gap-2 text-sm mb-4">
          <div>
            <p className="text-gray-500">Allocated</p>
            <p className="font-medium">${allocated.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Spent</p>
            <p className="font-medium">${spent.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Remaining</p>
            <p className="font-medium">${remaining.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>Budget Usage</span>
            <span className={percentSpent > 90 ? 'text-red-500 font-medium' : ''}>{percentSpent}%</span>
          </div>
          <Progress value={percentSpent} className={getProgressColor(percentSpent)} />
        </div>
        
        <p className="text-xs text-gray-500 mt-2">Last updated: {lastUpdated}</p>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link to={`/budget/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BudgetCard;
