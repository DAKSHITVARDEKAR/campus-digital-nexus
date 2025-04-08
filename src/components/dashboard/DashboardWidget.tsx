
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface DashboardWidgetProps {
  title: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const DashboardWidget = ({
  title,
  icon,
  footer,
  isLoading = false,
  className,
  children
}: DashboardWidgetProps) => {
  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          children
        )}
      </CardContent>
      {footer && <CardFooter className="pt-1">{footer}</CardFooter>}
    </Card>
  );
};

export default DashboardWidget;
