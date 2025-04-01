import React, { useState, useEffect } from "react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { COLOR_MAPPING, DEMOGRAPHIC_FEATURES, TIER } from "@/lib/constants";
import { extractFeatureWeights, generateMarketTiers } from "@/lib/csvUtils";

interface MarketTiersViewProps {
  csvData: any[] | null;
}

const MarketTiersView: React.FC<MarketTiersViewProps> = ({ csvData }) => {
  const [featureWeights, setFeatureWeights] = useState<{ Feature: string, Weight: number }[]>([]);
  const [markets, setMarkets] = useState<any[]>([]);
  const [topMarkets, setTopMarkets] = useState<any[]>([]);
  const [topMarketsCount, setTopMarketsCount] = useState<number>(4);
  const [selectedTiers, setSelectedTiers] = useState<string[]>(["Tier 1", "Tier 2", "Tier 3", "Tier 4"]);
  const [advancedFeaturesEnabled, setAdvancedFeaturesEnabled] = useState<boolean>(false);
  const [scoreColumn, setScoreColumn] = useState<string>("");
  const [marketNameColumn, setMarketNameColumn] = useState<string>("");
  const [marketCodeColumn, setMarketCodeColumn] = useState<string>("");
  
  // Initialize data when csvData changes
  useEffect(() => {
    if (csvData && csvData.length > 0) {
      // Get all column names from the first row
      const columns = Object.keys(csvData[0]);
      
      // Select reasonable defaults for required columns
      const defaultScoreCol = columns.find(col => 
        col.toLowerCase().includes('score') || 
        col.toLowerCase().includes('value')
      ) || columns[columns.length - 1];
      
      const defaultNameCol = columns.find(col => 
        col.toLowerCase().includes('name') || 
        col.toLowerCase().includes('market')
      ) || columns[0];
      
      const defaultCodeCol = columns.find(col => 
        col.toLowerCase().includes('code') || 
        col.toLowerCase().includes('id')
      ) || columns[1];
      
      setScoreColumn(defaultScoreCol);
      setMarketNameColumn(defaultNameCol);
      setMarketCodeColumn(defaultCodeCol);
      
      // Generate market tiers based on the score column
      const marketTiers = generateMarketTiers(csvData as any[], defaultScoreCol);
      setMarkets(marketTiers);
      
      // Extract relevant demographic features (if they exist in the data)
      const availableFeatures = DEMOGRAPHIC_FEATURES.filter(
        feature => columns.some(col => col.includes(feature))
      );
      
      // Extract feature weights
      const weights = extractFeatureWeights(csvData as any[], availableFeatures);
      setFeatureWeights(weights);
      
      // Update top markets
      updateTopMarkets(marketTiers, 4, ["Tier 1", "Tier 2", "Tier 3", "Tier 4"]);
    }
  }, [csvData]);
  
  // Update top markets when count or selected tiers change
  useEffect(() => {
    if (markets.length > 0) {
      updateTopMarkets(markets, topMarketsCount, selectedTiers);
    }
  }, [topMarketsCount, selectedTiers, markets]);
  
  // Function to update top markets based on filters
  const updateTopMarkets = (data: any[], count: number, tiers: string[]) => {
    // Filter by selected tiers
    const filtered = data.filter(item => tiers.includes(item[TIER]));
    
    // Group by tier
    const byTier = filtered.reduce((acc, item) => {
      const tier = item[TIER];
      if (!acc[tier]) acc[tier] = [];
      acc[tier].push(item);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Get top N from each tier
    const topN: any[] = [];
    Object.entries(byTier).forEach(([tier, items]) => {
      // Sort by score (assuming higher is better)
      const sorted = [...items].sort((a, b) => {
        const scoreA = typeof b[scoreColumn] === 'number' ? b[scoreColumn] : 0;
        const scoreB = typeof a[scoreColumn] === 'number' ? a[scoreColumn] : 0;
        return scoreA - scoreB;
      });
      topN.push(...sorted.slice(0, count));
    });
    
    setTopMarkets(topN);
  };
  
  // Handle tier selection change
  const handleTierChange = (tier: string) => {
    setSelectedTiers(prev => {
      if (prev.includes(tier)) {
        return prev.filter(t => t !== tier);
      } else {
        return [...prev, tier];
      }
    });
  };
  
  // Regenerate market tiers when columns change
  const regenerateMarketTiers = () => {
    if (csvData && csvData.length > 0) {
      const marketTiers = generateMarketTiers(csvData, scoreColumn);
      setMarkets(marketTiers);
      updateTopMarkets(marketTiers, topMarketsCount, selectedTiers);
    }
  };
  
  // Format data for the pie chart
  const pieChartData = featureWeights.filter(item => item.Weight > 0);
  
  // Prepare colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Format market data for the bar chart
  const marketBarData = topMarkets.map(market => ({
    name: market[marketNameColumn] || 'Unknown',
    value: market[scoreColumn] || 0,
    tier: market[TIER] || 'Unknown'
  }));
  
  if (!csvData || csvData.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-neutral-600">Please upload market data to view tier analysis</p>
      </div>
    );
  }
  
  const columns = Object.keys(csvData[0]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label>Advanced Features Enabled</Label>
          <Select 
            value={advancedFeaturesEnabled ? "Yes" : "No"} 
            onValueChange={(value) => setAdvancedFeaturesEnabled(value === "Yes")}
          >
            <SelectTrigger>
              <SelectValue placeholder="No" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="No">No</SelectItem>
              <SelectItem value="Yes">Yes</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Top Markets Per Tier</Label>
          <Input 
            type="number" 
            min={1} 
            max={10} 
            value={topMarketsCount} 
            onChange={(e) => setTopMarketsCount(parseInt(e.target.value) || 1)} 
          />
        </div>
        
        <div>
          <Label>Tier Filter</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {["Tier 1", "Tier 2", "Tier 3", "Tier 4"].map((tier) => (
              <div 
                key={tier}
                className={`p-1 rounded-md cursor-pointer ${
                  selectedTiers.includes(tier) 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-200 text-neutral-700'
                }`}
                onClick={() => handleTierChange(tier)}
              >
                {tier} {selectedTiers.includes(tier) && '✓'}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {advancedFeaturesEnabled && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-3">Advanced Column Selection</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Score Column</Label>
              <Select 
                value={scoreColumn} 
                onValueChange={setScoreColumn}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Market Name Column</Label>
              <Select 
                value={marketNameColumn} 
                onValueChange={setMarketNameColumn}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Market Code Column</Label>
              <Select 
                value={marketCodeColumn} 
                onValueChange={setMarketCodeColumn}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select column" />
                </SelectTrigger>
                <SelectContent>
                  {columns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button 
            onClick={regenerateMarketTiers} 
            className="mt-4"
          >
            Regenerate Market Tiers
          </Button>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4 text-center">Socioeconomic Feature Weights for Users Tiers</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="Weight"
                  nameKey="Feature"
                  label={({ name, percent }: {name: string, percent: number}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `${(Number(value) * 100).toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4 text-center">
            Top {topMarketsCount} Markets Per Tier Based on Users Score
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={marketBarData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Market Score">
                  {marketBarData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLOR_MAPPING[entry.tier as keyof typeof COLOR_MAPPING] || '#8884d8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4 text-center">
          Top {topMarketsCount} Markets Per Tier Based on Users Score
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tier</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Market Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Market Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Tier Rank</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {topMarkets
                .sort((a, b) => {
                  // Sort by tier first, then by score (descending)
                  if (a[TIER] !== b[TIER]) {
                    return a[TIER].localeCompare(b[TIER]);
                  }
                  return b[scoreColumn] - a[scoreColumn];
                })
                .map((market, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{market[TIER]}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{market[marketNameColumn]}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{market[marketCodeColumn]}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{market[scoreColumn].toFixed(4)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{market.TierRank}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MarketTiersView;