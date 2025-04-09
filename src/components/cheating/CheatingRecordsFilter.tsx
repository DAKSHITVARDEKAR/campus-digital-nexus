
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CheatingRecordsFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  severityFilter: string;
  onSeverityChange: (value: string) => void;
  timeFilter: string;
  onTimeChange: (value: string) => void;
}

const CheatingRecordsFilter: React.FC<CheatingRecordsFilterProps> = ({
  searchQuery,
  onSearchChange,
  severityFilter,
  onSeverityChange,
  timeFilter,
  onTimeChange
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search by student name, ID or course..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Severity</label>
          <Select
            value={severityFilter}
            onValueChange={onSeverityChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="minor">Minor</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="severe">Severe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Period</label>
          <Select
            value={timeFilter}
            onValueChange={onTimeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="recent">Last 30 Days</SelectItem>
              <SelectItem value="semester">Current Semester</SelectItem>
              <SelectItem value="year">This Academic Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CheatingRecordsFilter;
