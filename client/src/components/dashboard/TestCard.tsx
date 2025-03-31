import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Test } from "@/types";

interface TestCardProps {
  test: Test;
}

const TestCard: React.FC<TestCardProps> = ({ test }) => {
  const {
    id,
    name,
    status,
    client,
    startDate,
    endDate,
    marketPairs,
    budget,
    progress,
    incrementality,
    keyFindings,
  } = test;

  // Format date range
  const formatDateRange = (start: string, end: string) => {
    const startObj = new Date(start);
    const endObj = new Date(end);
    
    const startFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(startObj);
    const endFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(endObj);
    
    return `${startFormat} - ${endFormat}`;
  };

  // Determine badge color based on status
  const getBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-primary-100 text-primary-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden h-full">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-neutral-800">{name}</h4>
          <span className={`px-2 py-1 ${getBadgeColor(status)} text-xs rounded-full`}>
            {status}
          </span>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Client:</span>
            <span className="font-medium text-neutral-800">{client}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Test Period:</span>
            <span className="font-medium text-neutral-800">
              {formatDateRange(startDate, endDate)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Market Pairs:</span>
            <span className="font-medium text-neutral-800">{marketPairs} pairs</span>
          </div>
          {status.toLowerCase() === 'active' && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Test Budget:</span>
              <span className="font-medium text-neutral-800">${budget.toLocaleString()}</span>
            </div>
          )}
          {status.toLowerCase() === 'completed' && incrementality && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Incrementality:</span>
              <span className="font-medium text-green-600">{incrementality > 0 ? '+' : ''}{incrementality}%</span>
            </div>
          )}
        </div>
        <div className="mt-5 pt-5 border-t border-neutral-200">
          {status.toLowerCase() === 'active' && (
            <div>
              <h5 className="text-sm font-medium text-neutral-700 mb-2">Campaign Progress</h5>
              <Progress value={progress} />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-neutral-500">Started {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-xs font-medium text-primary">{progress}% Complete</span>
              </div>
            </div>
          )}
          {status.toLowerCase() === 'completed' && keyFindings && (
            <div>
              <h5 className="text-sm font-medium text-neutral-700 mb-2">Key Findings</h5>
              <p className="text-sm text-neutral-600">{keyFindings}</p>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <Link href={`/test-results/${id}`}>
              <a className="text-sm font-medium text-primary hover:text-primary-700 flex items-center">
                {status.toLowerCase() === 'completed' ? 'View Report' : 'View Details'} 
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TestCard;
