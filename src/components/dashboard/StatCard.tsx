
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  className?: string;
  iconClassName?: string;
}

export const StatCard = ({ 
  title, 
  value, 
  icon, 
  change, 
  className,
  iconClassName
}: StatCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            {change !== undefined && (
              <div className="flex items-center mt-1">
                <span className={cn(
                  "text-xs font-medium",
                  change >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {change >= 0 ? `+${change}%` : `${change}%`}
                </span>
                <span className="text-xs text-gray-500 ml-1">since last month</span>
              </div>
            )}
          </div>
          
          <div className={cn(
            "p-3 rounded-full",
            iconClassName || "bg-primary/10"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
