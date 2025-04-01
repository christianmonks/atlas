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
          <Card className="p-6">
            <CardHeader className="pb-0">
              <CardTitle className="text-center">Matched Market Pairs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 border-separate border-spacing-0">
                  <thead className="bg-neutral-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider rounded-tl-md">Tier</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Test Market</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Control Market</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider rounded-tr-md">Similarity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-neutral-200">
                    {matchedMarkets.map((pair, index) => {
                      // Calculate similarity score percentage
                      const simScore = parseFloat(pair["Similarity Index"]);
                      const scorePercent = Math.round(simScore * 100);
                      
                      // Get tier color
                      const tierColor = COLOR_MAPPING[pair[TIER] as keyof typeof COLOR_MAPPING] || '#888';
                      
                      return (
                        <tr 
                          key={index}
                          className="hover:bg-neutral-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-full mr-2" 
                                style={{ backgroundColor: tierColor }}
                              />
                              <span>{pair[TIER]}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{pair["Test Market Name"]}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-neutral-600">{pair["Control Market Name"]}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end">
                              <div className="w-24 bg-neutral-200 rounded-full h-2 mr-2">
                                <div 
                                  className="h-2 rounded-full bg-primary" 
                                  style={{ width: `${scorePercent}%` }}
                                />
                              </div>
                              <span className={scorePercent > 90 ? "text-green-600 font-medium" : scorePercent > 70 ? "text-amber-600" : "text-neutral-600"}>
                                {scorePercent}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-6 lg:col-span-2">
              <CardHeader className="pb-0">
                <CardTitle className="text-center">KPI Comparison: Test vs Control Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    {dateColumn ? (
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          label={{ value: 'Time Period', position: 'insideBottom', offset: -5 }}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          label={{ value: kpiColumn, angle: -90, position: 'insideLeft' }}
                          tick={{ fontSize: 12 }} 
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: 'none'
                          }}
                          formatter={(value: any) => [Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }), '']}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                          iconType="circle"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="testMarkets" 
                          name="Test Markets" 
                          stroke={COLOR_MAPPING["Tier 1"] || "#0088FE"} 
                          strokeWidth={3}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          dot={{ strokeWidth: 2, r: 4, fill: '#fff' }}
                          animationDuration={1500}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="controlMarkets" 
                          name="Control Markets" 
                          stroke={COLOR_MAPPING["Tier 2"] || "#FF8042"} 
                          strokeWidth={3}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                          dot={{ strokeWidth: 2, r: 4, fill: '#fff' }}
                          animationDuration={1500}
                          animationBegin={300}
                        />
                      </LineChart>
                    ) : (
                      <BarChart 
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} horizontal={true} vertical={false} />
                        <XAxis type="number" />
                        <YAxis 
                          dataKey="market" 
                          type="category"
                          tick={{ fontSize: 14, fontWeight: 500 }} 
                          width={120}
                        />
                        <Tooltip 
                          formatter={(value: any) => [Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 }), kpiColumn]}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            border: 'none'
                          }}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36}
                        />
                        <Bar 
                          dataKey="value" 
                          name={kpiColumn}
                          animationDuration={1500}
                          radius={[0, 4, 4, 0]}
                        >
                          {chartData.map((entry, index) => {
                            const market = 'market' in entry ? entry.market : '';
                            const color = market === 'Test Markets' 
                              ? (COLOR_MAPPING["Tier 1"] || "#0088FE")
                              : (COLOR_MAPPING["Tier 2"] || "#FF8042");
                            return (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={color}
                                fillOpacity={0.85}
                              />
                            );
                          })}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-8 mt-4 text-sm text-neutral-500">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full bg-primary"></span>
                    <span>Selected Test Markets: {matchedMarkets.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: COLOR_MAPPING["Tier 2"] || "#FF8042" }}></span>
                    <span>Selected Control Markets: {matchedMarkets.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="p-6">
              <CardHeader className="pb-2">
                <CardTitle>KPI Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">KPI Metric</h3>
                  <p className="text-xl font-semibold">{kpiColumn}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">
                    Test Market Performance
                  </h3>
                  <p className="text-2xl font-semibold text-primary">
                    {testAverage.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                  <div className="text-sm mt-1">
                    {testAverage > controlAverage ? (
                      <span className="text-green-600">
                        {((testAverage / controlAverage - 1) * 100).toFixed(1)}% higher than control
                      </span>
                    ) : (
                      <span className="text-red-600">
                        {((1 - testAverage / controlAverage) * 100).toFixed(1)}% lower than control
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">
                    Control Market Performance
                  </h3>
                  <p className="text-2xl font-semibold" style={{ color: COLOR_MAPPING["Tier 2"] || "#FF8042" }}>
                    {controlAverage.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">
                    Correlation Coefficient
                  </h3>
                  <div className="flex items-center">
                    <div className="text-2xl font-semibold mr-2">
                      {correlation.toFixed(2)}
                    </div>
                    <div className="flex-1 h-2 bg-neutral-200 rounded-full">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: `${Math.abs(correlation) * 100}%`,
                          backgroundColor: correlation > 0.7 ? '#10b981' : correlation > 0.3 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-sm mt-1">
                    {correlation > 0.7 ? (
                      <span className="text-green-600">Strong correlation</span>
                    ) : correlation > 0.3 ? (
                      <span className="text-amber-600">Moderate correlation</span>
                    ) : (
                      <span className="text-red-600">Weak correlation</span>
                    )}
                  </div>
                </div>
                
                <div className="pt-3">
                  <h3 className="text-sm font-medium text-neutral-500 mb-1">
                    Incrementality Estimate
                  </h3>
                  <div className="text-2xl font-semibold">
                    {((testAverage / controlAverage - 1) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm mt-1 text-neutral-500">
                    Based on selected market pairs
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default MatchedMarketsView;