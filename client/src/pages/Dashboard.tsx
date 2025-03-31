import React, { useState } from "react";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import TestCard from "@/components/dashboard/TestCard";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import QuickCreateTestCard from "@/components/dashboard/QuickCreateTestCard";
import { useQuery } from "@tanstack/react-query";
import { Test } from "@/types";
import CreateTestModal from "@/components/createTest/CreateTestModal";

// Sample data for charts
const channelIncrementalityData = [
  { name: "Social", value: 11 },
  { name: "Display", value: 14 },
  { name: "Video", value: 8 },
  { name: "TV", value: 16 },
  { name: "Radio", value: 7 },
  { name: "OOH", value: 12 },
];

const generateMarketComparisonData = (startDate: string) => {
  const data = [];
  const start = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i * 7);
    
    const formattedDate = currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Generate realistic looking data with test markets generally outperforming control
    const testValue = 75 - Math.floor(Math.random() * 15) + (i * 5);
    const controlValue = testValue - 5 - Math.floor(Math.random() * 10);
    
    data.push({
      date: formattedDate,
      test: testValue,
      control: controlValue
    });
  }
  
  return data;
};

const Dashboard = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [timeRange, setTimeRange] = useState("Last 12 months");
  const [selectedTest, setSelectedTest] = useState("Q2 Brand Campaign");

  // Fetch tests
  const { data: tests = [], isLoading } = useQuery<Test[]>({
    queryKey: ["/api/tests"],
    queryFn: async () => {
      // For the MVP, we'll use this mock data
      // In a real app, we would fetch from the backend API
      return [
        {
          id: "1",
          name: "Q2 Brand Campaign",
          status: "Active",
          client: "Acme Corporation",
          startDate: "2023-04-15",
          endDate: "2023-06-20",
          marketPairs: 6,
          budget: 150000,
          progress: 45,
        },
        {
          id: "2",
          name: "TV Attribution Study",
          status: "Completed",
          client: "Global Media Inc.",
          startDate: "2023-01-10",
          endDate: "2023-03-25",
          marketPairs: 8,
          incrementality: 12.4,
          keyFindings: "Test markets outperformed control markets with 12.4% higher conversion rate and 8.7% increased revenue."
        },
      ];
    },
  });

  // Calculate dashboard metrics
  const activeTests = tests.filter(test => test.status === "Active").length;
  const completedTests = tests.filter(test => test.status === "Completed").length;
  const pendingTests = tests.filter(test => test.status === "Pending").length;

  // Get market comparison data for the selected test
  const marketComparisonData = React.useMemo(() => {
    const test = tests.find(t => t.name === selectedTest);
    return test ? generateMarketComparisonData(test.startDate) : [];
  }, [tests, selectedTest]);

  // Filter options
  const timeRangeOptions = ["Last 12 months", "Last 6 months", "Last 30 days"];
  const testOptions = tests.map(test => test.name);

  return (
    <>
      <WelcomeCard
        activeTests={activeTests}
        completedTests={completedTests}
        pendingTests={pendingTests}
      />

      <h3 className="text-lg font-medium text-neutral-800 mb-4">Recent Tests</h3>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {isLoading ? (
          <p>Loading tests...</p>
        ) : (
          tests.map((test) => <TestCard key={test.id} test={test} />)
        )}
      </div>

      <h3 className="text-lg font-medium text-neutral-800 mt-8 mb-4">
        Performance Overview
      </h3>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PerformanceChart
          type="bar"
          title="Incrementality by Channel"
          data={channelIncrementalityData}
          filterOptions={timeRangeOptions}
          onFilterChange={setTimeRange}
        />
        <PerformanceChart
          type="line"
          title="Market Performance Comparison"
          data={marketComparisonData}
          filterOptions={testOptions}
          onFilterChange={setSelectedTest}
        />
      </div>

      <QuickCreateTestCard />

      {/* Create Test Modal */}
      <CreateTestModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
};

export default Dashboard;
