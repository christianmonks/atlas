import React, { useState, useEffect } from "react";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TIER, COLOR_MAPPING } from "@/lib/constants";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

interface MatchedMarketsViewProps {
  csvData: any[] | null;
}

const MatchedMarketsView: React.FC<MatchedMarketsViewProps> = ({ csvData }) => {
  const [matchedMarkets, setMatchedMarkets] = useState<any[]>([]);
  const [tierFilter, setTierFilter] = useState<string[]>([]);
  const [marketToExclude, setMarketToExclude] = useState<string[]>([]);
  const [specificTestMarkets, setSpecificTestMarkets] = useState<string[]>([]);
  const [marketPairsCount, setMarketPairsCount] = useState<number>(10);
  const [marketColumn, setMarketColumn] = useState<string>("");
  const [dateColumn, setDateColumn] = useState<string | null>(null);
  const [kpiColumn, setKpiColumn] = useState<string>("");
  const [testMarketKPI, setTestMarketKPI] = useState<any[]>([]);
  const [controlMarketKPI, setControlMarketKPI] = useState<any[]>([]);
  const [correlation, setCorrelation] = useState<number>(0);
  const [testAverage, setTestAverage] = useState<number>(0);
  const [controlAverage, setControlAverage] = useState<number>(0);
  
  // Initialize data when csvData changes
  useEffect(() => {
    if (csvData && csvData.length > 0) {
      const columns = Object.keys(csvData[0]);
      
      // Find appropriate columns in the data
      const marketCol = columns.find(col => 
        col.toLowerCase().includes('market') || 
        col.toLowerCase().includes('region') ||
        col.toLowerCase().includes('dma') ||
        col.toLowerCase().includes('state')
      ) || columns[0];
      
      const dateCol = columns.find(col => 
        col.toLowerCase().includes('date') || 
        col.toLowerCase().includes('time') ||
        col.toLowerCase().includes('period')
      ) || null;
      
      const kpiCol = columns.find(col => 
        col.toLowerCase().includes('kpi') || 
        col.toLowerCase().includes('sales') ||
        col.toLowerCase().includes('revenue') ||
        col.toLowerCase().includes('value')
      ) || columns.find(col => {
        // Find a numeric column that's not the date or market column
        if (col !== marketCol && col !== dateCol) {
          const sample = csvData[0][col];
          return typeof sample === 'number';
        }
        return false;
      }) || columns[columns.length - 1];
      
      setMarketColumn(marketCol);
      setDateColumn(dateCol);
      setKpiColumn(kpiCol);
      
      // Get unique tiers if present
      const tiersInData = Array.from(
        new Set(csvData.map(row => row[TIER]).filter(Boolean))
      );
      
      if (tiersInData.length > 0) {
        setTierFilter(tiersInData);
      } else if (csvData.some(row => row[TIER])) {
        // If TIER column exists but no values are set, create default tiers
        setTierFilter(["Tier 1", "Tier 2", "Tier 3", "Tier 4"]);
      }
      
      // Get unique market names
      const markets = Array.from(
        new Set(csvData.map(row => row[marketCol]).filter(Boolean))
      );
      
      // Generate initial matched markets
      generateMatchedMarketPairs(csvData, marketCol, kpiCol, dateCol, markets);
    }
  }, [csvData]);
  
  // Generate matched market pairs
  const generateMatchedMarketPairs = (
    data: any[], 
    marketCol: string, 
    kpiCol: string, 
    dateCol: string | null,
    allMarkets: string[]
  ) => {
    // Simple implementation of market matching for demonstration purposes
    // In a real app, this would use sophisticated algorithms for similarity matching
    
    // Filter by selected tiers if available
    const filteredData = tierFilter.length > 0 
      ? data.filter(row => tierFilter.includes(row[TIER]))
      : data;
    
    // Exclude markets if specified
    const availableMarkets = allMarkets.filter(
      market => !marketToExclude.includes(market)
    );
    
    // Prioritize specific test markets if selected
    const testMarkets = specificTestMarkets.length > 0
      ? specificTestMarkets.filter(market => availableMarkets.includes(market))
      : availableMarkets.slice(0, Math.ceil(availableMarkets.length / 2));
    
    const controlMarkets = availableMarkets.filter(
      market => !testMarkets.includes(market)
    );
    
    const pairs: any[] = [];
    
    // Create market pairs
    testMarkets.forEach((testMarket, i) => {
      if (controlMarkets[i]) {
        const similarity = Math.random() * 0.5 + 0.5; // Simulated similarity score (0.5 - 1.0)
        
        pairs.push({
          [TIER]: data.find(row => row[marketCol] === testMarket)?.[TIER] || "Tier 1",
          "Test Market Identifier": testMarket,
          "Test Market Name": testMarket,
          "Control Market Identifier": controlMarkets[i],
          "Control Market Name": controlMarkets[i],
          "Similarity Index": similarity.toFixed(4)
        });
      }
    });
    
    setMatchedMarkets(pairs.slice(0, marketPairsCount));
    
    // Generate KPI data for matched pairs
    if (pairs.length > 0) {
      generateKPIData(
        data, 
        pairs.slice(0, marketPairsCount), 
        marketCol, 
        kpiCol, 
        dateCol
      );
    }
  };
  
  // Generate KPI data for test and control markets
  const generateKPIData = (
    data: any[], 
    pairs: any[],
    marketCol: string, 
    kpiCol: string,
    dateCol: string | null
  ) => {
    const testMarketIds = pairs.map(pair => pair["Test Market Identifier"]);
    const controlMarketIds = pairs.map(pair => pair["Control Market Identifier"]);
    
    // Filter data for test and control markets
    const testData = data.filter(row => testMarketIds.includes(row[marketCol]));
    const controlData = data.filter(row => controlMarketIds.includes(row[marketCol]));
    
    if (dateCol) {
      // Group by date for time series data
      const testByDate = testData.reduce((acc: Record<string, number>, row) => {
        const date = row[dateCol];
        if (!acc[date]) acc[date] = 0;
        acc[date] += parseFloat(row[kpiCol]) || 0;
        return acc;
      }, {});
      
      const controlByDate = controlData.reduce((acc: Record<string, number>, row) => {
        const date = row[dateCol];
        if (!acc[date]) acc[date] = 0;
        acc[date] += parseFloat(row[kpiCol]) || 0;
        return acc;
      }, {});
      
      // Convert to array for charts
      const chartData: { date: string; testValue: number; controlValue: number }[] = [];
      
      Object.keys(testByDate).forEach(date => {
        chartData.push({
          date,
          testValue: testByDate[date],
          controlValue: controlByDate[date] || 0
        });
      });
      
      // Add any missing dates from control data
      Object.keys(controlByDate).forEach(date => {
        if (!testByDate[date]) {
          chartData.push({
            date,
            testValue: 0,
            controlValue: controlByDate[date]
          });
        }
      });
      
      // Sort by date
      chartData.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      });
      
      setTestMarketKPI(chartData.map(item => item.testValue));
      setControlMarketKPI(chartData.map(item => item.controlValue));
      
      // Calculate correlation and averages
      calculateMetrics(
        chartData.map(item => item.testValue),
        chartData.map(item => item.controlValue)
      );
    } else {
      // Aggregate totals for non-time series data
      const testTotal = testData.reduce((sum, row) => sum + (parseFloat(row[kpiCol]) || 0), 0);
      const controlTotal = controlData.reduce((sum, row) => sum + (parseFloat(row[kpiCol]) || 0), 0);
      
      setTestMarketKPI([testTotal]);
      setControlMarketKPI([controlTotal]);
      
      // Set metrics
      setCorrelation(0); // No correlation for single values
      setTestAverage(testTotal / testMarketIds.length || 0);
      setControlAverage(controlTotal / controlMarketIds.length || 0);
    }
  };
  
  // Calculate correlation and averages from two data series
  const calculateMetrics = (testData: number[], controlData: number[]) => {
    // Ensure arrays are of same length
    const length = Math.min(testData.length, controlData.length);
    const testSeries = testData.slice(0, length);
    const controlSeries = controlData.slice(0, length);
    
    // Calculate averages
    const testAvg = testSeries.reduce((sum, val) => sum + val, 0) / length;
    const controlAvg = controlSeries.reduce((sum, val) => sum + val, 0) / length;
    
    setTestAverage(testAvg);
    setControlAverage(controlAvg);
    
    // Calculate correlation
    if (length > 1) {
      let numerator = 0;
      let testDenominator = 0;
      let controlDenominator = 0;
      
      for (let i = 0; i < length; i++) {
        const testDiff = testSeries[i] - testAvg;
        const controlDiff = controlSeries[i] - controlAvg;
        
        numerator += testDiff * controlDiff;
        testDenominator += testDiff * testDiff;
        controlDenominator += controlDiff * controlDiff;
      }
      
      const denominator = Math.sqrt(testDenominator * controlDenominator);
      const correlation = denominator === 0 ? 0 : numerator / denominator;
      
      setCorrelation(correlation);
    } else {
      setCorrelation(0);
    }
  };
  
  // Handle regenerating market pairs when settings change
  const regenerateMarketPairs = () => {
    if (csvData && csvData.length > 0) {
      const markets = Array.from(
        new Set(csvData.map(row => row[marketColumn]).filter(Boolean))
      );
      
      generateMatchedMarketPairs(
        csvData, 
        marketColumn, 
        kpiColumn, 
        dateColumn,
        markets
      );
    }
  };
  
  // Prepare data for line or bar chart
  const chartData = dateColumn 
    ? testMarketKPI.map((value, index) => ({
        date: index, // Using index as a placeholder for the actual date
        testMarkets: value,
        controlMarkets: controlMarketKPI[index] || 0
      }))
    : [
        { market: 'Test Markets', value: testAverage },
        { market: 'Control Markets', value: controlAverage }
      ];
  
  if (!csvData || csvData.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-neutral-600">Please upload market data to view matched markets analysis</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label>Select Tiers</Label>
          <Select 
            value={tierFilter.join(',')}
            onValueChange={(value) => setTierFilter(value.split(',').filter(Boolean))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select tiers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tier 1,Tier 2,Tier 3,Tier 4">All Tiers</SelectItem>
              <SelectItem value="Tier 1">Tier 1</SelectItem>
              <SelectItem value="Tier 2">Tier 2</SelectItem>
              <SelectItem value="Tier 3">Tier 3</SelectItem>
              <SelectItem value="Tier 4">Tier 4</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Number of Market Pairs</Label>
          <Input 
            type="number" 
            min={1} 
            max={50} 
            value={marketPairsCount} 
            onChange={(e) => setMarketPairsCount(parseInt(e.target.value) || 1)} 
          />
        </div>
        
        <div className="md:col-span-2">
          <Button 
            onClick={regenerateMarketPairs} 
            className="mt-6"
          >
            Generate Matched Markets
          </Button>
        </div>
      </div>
      
      {matchedMarkets.length > 0 && (
        <>
          <Card className="p-4">
            <CardHeader className="pb-0">
              <CardTitle className="text-center">Matched Markets Based on Similarity Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Test Market</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Control Market</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Similarity Index</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {matchedMarkets.map((pair, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{pair[TIER]}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pair["Test Market Name"]}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pair["Control Market Name"]}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{pair["Similarity Index"]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-center">Matched Markets Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">KPI Name</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-semibold">{kpiColumn}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Correlation: Test vs Control</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-semibold">{correlation.toFixed(2)}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Test Average</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-semibold">{testAverage.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Control Average</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-2xl font-semibold">{controlAverage.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {dateColumn ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        label={{ value: 'Time Period', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        label={{ value: kpiColumn, angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="testMarkets" 
                        name="Test Markets" 
                        stroke={COLOR_MAPPING["Test Markets"]} 
                        strokeWidth={2} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="controlMarkets" 
                        name="Control Markets" 
                        stroke={COLOR_MAPPING["Control Markets"]} 
                        strokeWidth={2} 
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="market" />
                      <YAxis 
                        label={{ value: kpiColumn, angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name={kpiColumn} 
                        fill="#8884d8" 
                      >
                        {chartData.map((entry, index) => {
                          const market = 'market' in entry ? entry.market : '';
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLOR_MAPPING[market as keyof typeof COLOR_MAPPING] || '#8884d8'} 
                            />
                          );
                        })}
                      </Bar>
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default MatchedMarketsView;