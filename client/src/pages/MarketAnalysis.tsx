import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import FileUpload from "@/components/marketAnalysis/FileUpload";
import MarketTiersView from "@/components/marketAnalysis/MarketTiersView";
import MatchedMarketsView from "@/components/marketAnalysis/MatchedMarketsView";
import SampleDataGenerator from "@/components/marketAnalysis/SampleDataGenerator";

const MarketAnalysis: React.FC = () => {
  const [csvData, setCsvData] = useState<any[] | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [activeTest, setActiveTest] = useState<string>("upload");

  // Handle processed CSV data from FileUpload component
  const handleFileProcessed = (data: any[], name: string) => {
    setCsvData(data);
    setFileName(name);
    setActiveTest("analysis");
  };

  const handleExportAnalysis = () => {
    if (!csvData) return;
    
    // Create CSV content from the data
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      ).join(',')
    );
    const csvContent = [headers, ...rows].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `atlas_${fileName}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Market Analysis</h1>
      
      <div className="flex justify-between mb-6">
        <Select 
          value={activeTest} 
          onValueChange={setActiveTest}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select Data Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upload">Upload New Data</SelectItem>
            {csvData && <SelectItem value="analysis">Current Analysis</SelectItem>}
            <SelectItem value="test1">Q2 Brand Campaign</SelectItem>
            <SelectItem value="test2">TV Attribution Study</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          onClick={handleExportAnalysis} 
          disabled={!csvData}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export Analysis
        </Button>
      </div>
      
      {activeTest === "upload" ? (
        <div className="space-y-6">
          <FileUpload onFileProcessed={handleFileProcessed} />
          <SampleDataGenerator onDataGenerated={(data) => {
            setCsvData(data);
            setFileName("sample_market_data.csv");
            setActiveTest("analysis");
          }} />
        </div>
      ) : (
        <Tabs defaultValue="market-tiers">
          <TabsList className="mb-6">
            <TabsTrigger value="market-tiers">Market Tiers</TabsTrigger>
            <TabsTrigger value="matched-markets">Matched Markets</TabsTrigger>
            <TabsTrigger value="overview">Test Overview</TabsTrigger>
            <TabsTrigger value="power">Power Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="market-tiers">
            <MarketTiersView csvData={csvData} />
          </TabsContent>
          
          <TabsContent value="matched-markets">
            <MatchedMarketsView csvData={csvData} />
          </TabsContent>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Overview</CardTitle>
                  <CardDescription>Key details about the current test</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm text-neutral-500">Test Name:</div>
                      <div className="text-sm font-medium">
                        {fileName ? fileName.replace(/\.[^/.]+$/, "") : "Q2 Brand Campaign"}
                      </div>
                      
                      <div className="text-sm text-neutral-500">Client:</div>
                      <div className="text-sm font-medium">Acme Corporation</div>
                      
                      <div className="text-sm text-neutral-500">Test Period:</div>
                      <div className="text-sm font-medium">
                        {new Date().toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })} - {new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      
                      <div className="text-sm text-neutral-500">Status:</div>
                      <div className="text-sm font-medium">
                        <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                          Active
                        </span>
                      </div>
                      
                      <div className="text-sm text-neutral-500">Market Pairs:</div>
                      <div className="text-sm font-medium">
                        {csvData ? Math.ceil(csvData.length / 2) : 6} pairs
                      </div>
                      
                      <div className="text-sm text-neutral-500">Data Points:</div>
                      <div className="text-sm font-medium">
                        {csvData ? csvData.length.toLocaleString() : 0} rows
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Market Distribution</CardTitle>
                  <CardDescription>Geographic distribution of markets</CardDescription>
                </CardHeader>
                <CardContent className="h-64">
                  {csvData ? (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="text-center mb-4">
                        <div className="font-medium">Market Counts by Type</div>
                        <div className="text-sm text-neutral-600">
                          Based on uploaded data
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-blue-100 p-4 rounded-md text-center">
                          <div className="text-lg font-semibold text-blue-800">
                            {Math.ceil(csvData.length / 2)}
                          </div>
                          <div className="text-sm text-blue-600">Test Markets</div>
                        </div>
                        <div className="bg-red-100 p-4 rounded-md text-center">
                          <div className="text-lg font-semibold text-red-800">
                            {Math.floor(csvData.length / 2)}
                          </div>
                          <div className="text-sm text-red-600">Control Markets</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center border border-dashed border-neutral-300 rounded-md">
                      <p className="text-neutral-500">Upload data to view market distribution</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="power">
            <Card>
              <CardHeader>
                <CardTitle>Power Analysis</CardTitle>
                <CardDescription>Statistical power and minimum detectable effects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <h3 className="text-lg font-medium mb-4">Power Analysis</h3>
                  <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                    Power analysis helps determine the minimum effect size that can be detected 
                    with your current test setup. With the current number of markets and 
                    historical variance, your test can reliably detect the following effects:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
                    <div className="bg-neutral-100 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-primary">80%</div>
                      <div className="text-sm text-neutral-600 mt-2">Statistical Power</div>
                    </div>
                    
                    <div className="bg-neutral-100 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-primary">5.2%</div>
                      <div className="text-sm text-neutral-600 mt-2">Minimum Detectable Effect</div>
                    </div>
                    
                    <div className="bg-neutral-100 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-primary">95%</div>
                      <div className="text-sm text-neutral-600 mt-2">Confidence Level</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default MarketAnalysis;
