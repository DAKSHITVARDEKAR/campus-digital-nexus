
import React, { useState } from 'react';
import { Loader2, Filter } from 'lucide-react';
import { Task } from '@/services/taskService';
import TaskItem from './TaskItem';
import AddTaskForm from './AddTaskForm';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/hooks/useTasks';

const TaskList: React.FC = () => {
  const { user } = useAuth();
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleAddTask = async (title: string) => {
    await addTask(title);
  };

  if (!user) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <p className="text-center text-gray-600">Please log in to manage tasks.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow" role="region" aria-label="Task List">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Tasks</h2>
        <div className="flex items-center">
          <Filter className="h-4 w-4 mr-2 text-gray-500" aria-hidden="true" />
          <ToggleGroup type="single" value={filter} onValueChange={(value) => value && setFilter(value as any)}>
            <ToggleGroupItem value="all" aria-label="Show all tasks">All</ToggleGroupItem>
            <ToggleGroupItem value="active" aria-label="Show active tasks">Active</ToggleGroupItem>
            <ToggleGroupItem value="completed" aria-label="Show completed tasks">Completed</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      
      <AddTaskForm onAddTask={handleAddTask} />

      {loading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      ) : filteredTasks.length > 0 ? (
        <div role="list" aria-label="Task list">
          {filteredTasks.map(task => (
            <TaskItem 
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          {filter === 'all' ? (
            <p>No tasks yet. Add your first task above!</p>
          ) : filter === 'active' ? (
            <p>No active tasks. Great job!</p>
          ) : (
            <p>No completed tasks yet.</p>
          )}
        </div>
      )}
      
      {tasks.length > 0 && (
        <div className="mt-6 text-sm text-gray-600 text-right">
          {tasks.filter(t => t.completed).length} of {tasks.length} tasks completed
        </div>
      )}
    </div>
  );
};

export default TaskList;
