
import React from 'react';
import { Trash2, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Task } from '@/services/taskService';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  const priorityColors = {
    high: 'bg-red-100 border-red-300 text-red-800',
    medium: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    low: 'bg-green-100 border-green-300 text-green-800',
  };

  return (
    <div 
      className={cn(
        "p-4 mb-3 border rounded-lg flex items-start justify-between",
        task.completed ? "bg-gray-50 opacity-75" : "bg-white"
      )}
      aria-label={`Task: ${task.title}`}
    >
      <div className="flex items-center flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onToggle(task.id)} 
          className="mr-2 hover:bg-transparent"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {task.completed ? (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : (
            <Circle className="h-6 w-6 text-gray-400" />
          )}
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 
              className={cn(
                "text-lg font-medium",
                task.completed && "line-through text-gray-500"
              )}
            >
              {task.title}
            </h3>
            <span 
              className={cn(
                "text-xs px-2 py-1 rounded-full border",
                priorityColors[task.priority]
              )}
            >
              {task.priority}
            </span>
          </div>
          
          {task.description && (
            <p className={cn(
              "text-sm text-gray-600 mt-1",
              task.completed && "text-gray-400"
            )}>
              {task.description}
            </p>
          )}
          
          {task.dueDate && (
            <p className="text-xs text-gray-500 mt-2">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
          
          {task.category && (
            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded mt-2 inline-block">
              {task.category}
            </span>
          )}
        </div>
      </div>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default TaskItem;
