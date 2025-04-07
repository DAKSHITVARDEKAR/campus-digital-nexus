
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { BudgetCard } from '@/components/budget/BudgetCard';
import { ExpenseChart } from '@/components/budget/ExpenseChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Mock data
const departmentBudgets = [
  {
    id: '1',
    title: 'Computer Science Department',
    department: 'Academic',
    allocated: 50000,
    spent: 32500,
    remaining: 17500,
    lastUpdated: 'Apr 1, 2023',
  },
  {
    id: '2',
    title: 'Engineering Department',
    department: 'Academic',
    allocated: 75000,
    spent: 42000,
    remaining: 33000,
    lastUpdated: 'Apr 3, 2023',
  },
  {
    id: '3',
    title: 'Business School',
    department: 'Academic',
    allocated: 60000,
    spent: 38500,
    remaining: 21500,
    lastUpdated: 'Apr 2, 2023',
  },
];

const eventBudgets = [
  {
    id: '4',
    title: 'Annual Tech Fest',
    department: 'Events',
    allocated: 25000,
    spent: 5000,
    remaining: 20000,
    lastUpdated: 'Mar 28, 2023',
  },
  {
    id: '5',
    title: 'Cultural Week',
    department: 'Events',
    allocated: 30000,
    spent: 12500,
    remaining: 17500,
    lastUpdated: 'Apr 5, 2023',
  },
];

const facilityBudgets = [
  {
    id: '6',
    title: 'Library Resources',
    department: 'Facilities',
    allocated: 35000,
    spent: 22000,
    remaining: 13000,
    lastUpdated: 'Mar 25, 2023',
  },
  {
    id: '7',
    title: 'Sports Equipment',
    department: 'Facilities',
    allocated: 28000,
    spent: 15500,
    remaining: 12500,
    lastUpdated: 'Apr 4, 2023',
  },
];

const recentExpenses = [
  {
    id: '1',
    description: 'Computer Lab Equipment',
    amount: 12500,
    date: 'Apr 3, 2023',
    budget: 'Computer Science Department',
    status: 'approved',
  },
  {
    id: '2',
    description: 'Tech Fest Marketing Materials',
    amount: 3500,
    date: 'Mar 30, 2023',
    budget: 'Annual Tech Fest',
    status: 'approved',
  },
  {
    id: '3',
    description: 'Library Books',
    amount: 8200,
    date: 'Mar 28, 2023',
    budget: 'Library Resources',
    status: 'approved',
  },
  {
    id: '4',
    description: 'Engineering Lab Supplies',
    amount: 5600,
    date: 'Apr 2, 2023',
    budget: 'Engineering Department',
    status: 'pending',
  },
  {
    id: '5',
    description: 'Cultural Week Decorations',
    amount: 4200,
    date: 'Apr 4, 2023',
    budget: 'Cultural Week',
    status: 'approved',
  },
];

const totalExpensesByCategory = [
  { name: 'Academic Departments', value: 113000, color: '#0088FE' },
  { name: 'Events', value: 17500, color: '#00C49F' },
  { name: 'Facilities', value: 37500, color: '#FFBB28' },
  { name: 'Administration', value: 25000, color: '#FF8042' },
  { name: 'Student Services', value: 18000, color: '#8884D8' },
];

const Budget = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Budget Tracking</h1>
        <p className="text-muted-foreground">View college budgets, expenses, and financial allocations transparently.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <ExpenseChart categories={totalExpensesByCategory} title="College-wide Budget Allocation" />
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Budget Statistics</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">Total Allocated</p>
              <p className="text-2xl font-bold text-blue-900">$303,000</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg">
              <p className="text-sm text-emerald-700">Total Remaining</p>
              <p className="text-2xl font-bold text-emerald-900">$135,000</p>
            </div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-purple-700">Utilization Rate</p>
            <p className="text-2xl font-bold text-purple-900">55.4%</p>
          </div>
          <div className="mt-auto">
            <p className="text-xs text-gray-500">Last updated: April 7, 2023</p>
            <p className="text-xs text-gray-500">Fiscal Year: 2023-2024</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="departments" className="mb-6">
        <TabsList>
          <TabsTrigger value="departments">Department Budgets</TabsTrigger>
          <TabsTrigger value="events">Event Budgets</TabsTrigger>
          <TabsTrigger value="facilities">Facility Budgets</TabsTrigger>
          <TabsTrigger value="expenses">Recent Expenses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="departments">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {departmentBudgets.map((budget) => (
              <BudgetCard 
                key={budget.id}
                id={budget.id}
                title={budget.title}
                department={budget.department}
                allocated={budget.allocated}
                spent={budget.spent}
                remaining={budget.remaining}
                lastUpdated={budget.lastUpdated}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="events">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {eventBudgets.map((budget) => (
              <BudgetCard 
                key={budget.id}
                id={budget.id}
                title={budget.title}
                department={budget.department}
                allocated={budget.allocated}
                spent={budget.spent}
                remaining={budget.remaining}
                lastUpdated={budget.lastUpdated}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="facilities">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {facilityBudgets.map((budget) => (
              <BudgetCard 
                key={budget.id}
                id={budget.id}
                title={budget.title}
                department={budget.department}
                allocated={budget.allocated}
                spent={budget.spent}
                remaining={budget.remaining}
                lastUpdated={budget.lastUpdated}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="expenses">
          <div className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Proof</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">{expense.description}</TableCell>
                    <TableCell>${expense.amount.toLocaleString()}</TableCell>
                    <TableCell>{expense.date}</TableCell>
                    <TableCell>{expense.budget}</TableCell>
                    <TableCell>
                      <Badge className={
                        expense.status === 'approved' 
                          ? 'bg-green-100 text-green-800 border-green-100' 
                          : 'bg-amber-100 text-amber-800 border-amber-100'
                      }>
                        {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-amber-800 mb-2">Budget Transparency Policy</h2>
        <ul className="list-disc pl-5 text-amber-700 space-y-1">
          <li>All college budgets and expenses are publicly visible to students and faculty</li>
          <li>Expense proofs (receipts, invoices) are required and available for viewing</li>
          <li>Budget allocations are updated quarterly</li>
          <li>Questions about budget items can be directed to the Finance Office</li>
        </ul>
      </div>
    </Layout>
  );
};

export default Budget;
