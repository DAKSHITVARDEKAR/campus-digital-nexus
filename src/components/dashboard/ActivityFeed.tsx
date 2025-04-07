
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Activity {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'election' | 'budget' | 'facility' | 'application' | 'complaint';
  user?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  const getTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'election':
        return 'bg-blue-100 text-blue-800';
      case 'budget':
        return 'bg-green-100 text-green-800';
      case 'facility':
        return 'bg-purple-100 text-purple-800';
      case 'application':
        return 'bg-yellow-100 text-yellow-800';
      case 'complaint':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto">
        <div className="relative">
          {/* Vertical line connecting timeline dots */}
          <div className="absolute h-full w-0.5 bg-gray-200 left-1.5 top-0"></div>
          
          <ul className="space-y-4">
            {activities.map((activity) => (
              <li key={activity.id} className="relative pl-6 pb-4">
                {/* Timeline dot */}
                <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ${getTypeColor(activity.type)}`}></div>
                
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getTypeColor(activity.type)}`}>
                      {activity.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    {activity.user && (
                      <span className="text-xs text-gray-500">by {activity.user}</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
