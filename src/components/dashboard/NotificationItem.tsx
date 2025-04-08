
import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface NotificationItemProps {
  id: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  onClick?: () => void;
}

export const NotificationItem = ({
  message,
  timestamp,
  isRead,
  link,
  onClick
}: NotificationItemProps) => {
  const content = (
    <div
      className={cn(
        "flex items-start space-x-2 p-3 rounded-md transition-colors",
        link && "hover:bg-muted cursor-pointer",
        !isRead && "border-l-2 border-primary"
      )}
      onClick={onClick}
    >
      {!isRead && (
        <span className="h-2 w-2 mt-1.5 rounded-full bg-primary flex-shrink-0"></span>
      )}
      <div className={isRead ? "ml-4" : ""}>
        <p className="text-sm text-foreground">{message}</p>
        <p className="text-xs text-muted-foreground mt-1">{timestamp}</p>
      </div>
    </div>
  );

  if (link) {
    return <Link to={link} className="no-underline text-foreground">{content}</Link>;
  }

  return content;
};

export default NotificationItem;
