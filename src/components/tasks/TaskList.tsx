
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CheckCircle2,
  CircleDashed, 
  Plus, 
  Trash2, 
  AlertCircle
} from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignedTo?: string;
  category?: string;
}

interface TaskListProps {
  title: string;
  description?: string;
  tasks: Task[];
  userRole?: string;
  onTaskToggle: (taskId: string) => void;
  onTaskAdd: (taskTitle: string) => void;
  onTaskDelete: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  title,
  description,
  tasks,
  userRole = 'student',
  onTaskToggle,
  onTaskAdd,
  onTaskDelete
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onTaskAdd(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">High</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Medium</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Low</span>;
      default:
        return null;
    }
  };

  // Sort tasks by priority and completion status
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by completion status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority
    const priorityValues = { high: 0, medium: 1, low: 2 };
    return priorityValues[a.priority] - priorityValues[b.priority];
  });

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span> 
          <span className="text-sm font-normal bg-primary/10 text-primary px-2 py-1 rounded">
            {tasks.filter(t => t.completed).length}/{tasks.length} Completed
          </span>
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-start p-3 rounded-lg border ${
                task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => onTaskToggle(task.id)}
                  aria-label={`Mark "${task.title}" as ${task.completed ? 'not done' : 'done'}`}
                />
              </div>
              
              <div className="ml-3 flex-1">
                <label
                  htmlFor={`task-${task.id}`}
                  className={`block font-medium text-sm ${
                    task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}
                >
                  {task.title}
                </label>
                
                {task.description && (
                  <p className={`mt-1 text-xs ${
                    task.completed ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
                
                <div className="mt-2 flex flex-wrap gap-2 items-center">
                  {getPriorityBadge(task.priority)}
                  
                  {task.dueDate && (
                    <span className="text-xs text-gray-500 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  
                  {task.assignedTo && (
                    <span className="text-xs text-gray-500">
                      Assigned to: {task.assignedTo}
                    </span>
                  )}
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onTaskDelete(task.id)}
                className="text-gray-500 hover:text-red-600 ml-2"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete task</span>
              </Button>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <CircleDashed className="mx-auto h-8 w-8 mb-2" />
              <p>No tasks yet. Add your first task below.</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t pt-4">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            className="flex-1"
          />
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskList;
