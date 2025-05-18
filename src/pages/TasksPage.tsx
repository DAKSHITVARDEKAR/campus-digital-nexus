
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import TaskList from '@/components/tasks/TaskList';
import useTasks from '@/hooks/useTasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  ListTodo,
  Calendar,
  BookOpen,
  Building,
  Briefcase,
  CircleUser,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const TasksPage = () => {
  const { tasks, loading, addTask, toggleTask, deleteTask } = useTasks();
  const [category, setCategory] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Tasks', icon: <ListTodo className="h-4 w-4" /> },
    { id: 'academic', name: 'Academic', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'facility', name: 'Facilities', icon: <Building className="h-4 w-4" /> },
    { id: 'career', name: 'Career', icon: <Briefcase className="h-4 w-4" /> },
    { id: 'personal', name: 'Personal', icon: <CircleUser className="h-4 w-4" /> },
  ];

  const filteredTasks = category && category !== 'all' 
    ? tasks.filter(task => task.category === category) 
    : tasks;

  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const completedTasks = filteredTasks.filter(task => task.completed);
  
  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          <Skeleton className="h-16 w-full" />
          
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
            <p className="text-muted-foreground">
              Manage your personal tasks and academic responsibilities
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={category || 'all'} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <div className="flex items-center">
                      {cat.icon}
                      <span className="ml-2">{cat.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <TaskList
            title="Pending Tasks"
            description="Tasks that need your attention"
            tasks={pendingTasks}
            onTaskToggle={toggleTask}
            onTaskAdd={addTask}
            onTaskDelete={deleteTask}
          />
          
          <TaskList
            title="Completed Tasks"
            description="Tasks you have finished"
            tasks={completedTasks}
            onTaskToggle={toggleTask}
            onTaskAdd={addTask}
            onTaskDelete={deleteTask}
          />
        </div>
      </div>
    </Layout>
  );
};

export default TasksPage;
