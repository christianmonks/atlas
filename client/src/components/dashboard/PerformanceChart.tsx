import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";

interface BarChartDataItem {
  name: string;
  value: number;
}

interface LineChartDataItem {
  date: string;
  test: number;
  control: number;
}

interface PerformanceChartProps {
  type: "bar" | "line";
  title: string;
  data: BarChartDataItem[] | LineChartDataItem[];
  filterOptions: string[];
  onFilterChange?: (value: string) => void;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  type,
  title,
  data,
  filterOptions,
  onFilterChange,
}) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-medium text-neutral-700">{title}</h4>
          <div className="text-sm text-neutral-500">
            <Select onValueChange={onFilterChange}>
              <SelectTrigger className="border-none text-sm text-neutral-500 focus:ring-0 p-0 pr-6 w-auto">
                <SelectValue placeholder={filterOptions[0]} />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="h-[280px]">
          {type === "bar" && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data as BarChartDataItem[]}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis 
                  dataKey="name" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(value) => `${value}%`} 
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, "Incrementality"]}
                  labelStyle={{ fontSize: 12 }}
                  contentStyle={{ fontSize: 12, borderRadius: 4 }}
                />
                <Bar dataKey="value" fill="#1C64F2" radius={2} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          )}
          {type === "line" && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data as LineChartDataItem[]}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis 
                  dataKey="date" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                  dy={10}
                />
                <YAxis 
                  tickFormatter={(value) => `$${value}K`} 
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: "#E5E7EB" }}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}K`, ""]}
                  labelStyle={{ fontSize: 12 }}
                  contentStyle={{ fontSize: 12, borderRadius: 4 }}
                />
                <Legend verticalAlign="top" height={36} />
                <Line 
                  type="monotone" 
                  dataKey="test" 
                  name="Test Markets"
                  stroke="#1C64F2" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="control" 
                  name="Control Markets"
                  stroke="#EF4444" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
