
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(3, 'Task title must be at least 3 characters')
});

type TaskFormValues = z.infer<typeof taskSchema>;

interface AddTaskFormProps {
  onAddTask: (title: string) => Promise<void>;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: ''
    }
  });

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      await onAddTask(data.title);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input 
                    placeholder="Add a new task..." 
                    {...field} 
                    disabled={isSubmitting}
                    className="border-gray-300"
                    aria-label="New task title"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            aria-label="Add task"
          >
            <PlusCircle className="h-5 w-5 mr-1" />
            Add
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddTaskForm;
