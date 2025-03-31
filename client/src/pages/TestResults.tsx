import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

const TestResults: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Test Results</h1>
      
      <div className="flex justify-between mb-6">
        <Select defaultValue="test2">
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select Test" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test1">Q2 Brand Campaign</SelectItem>
            <SelectItem value="test2">TV Attribution Study</SelectItem>
          </SelectContent>
        </Select>
        
        <Button>Export Results</Button>
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-4 rounded-lg border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">Incrementality</div>
              <div className="text-2xl font-semibold text-green-600">+12.4%</div>
              <div className="text-xs text-neutral-400 mt-1">vs control markets</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">ROI</div>
              <div className="text-2xl font-semibold text-primary">3.2x</div>
              <div className="text-xs text-neutral-400 mt-1">return on ad spend</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">Statistical Confidence</div>
              <div className="text-2xl font-semibold text-amber-600">95%</div>
              <div className="text-xs text-neutral-400 mt-1">significance level</div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-neutral-200">
              <div className="text-sm text-neutral-500 mb-1">Revenue Lift</div>
              <div className="text-2xl font-semibold text-green-600">$245K</div>
              <div className="text-xs text-neutral-400 mt-1">incremental revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="performance">
        <TabsList className="mb-6">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="counterfactual">Counterfactual Analysis</TabsTrigger>
          <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Over Time</CardTitle>
                <CardDescription>Comparing test vs control markets</CardDescription>
              </CardHeader>
              <CardContent className="h-72 flex items-center justify-center border border-dashed border-neutral-300 rounded-md">
                <p className="text-neutral-500">Time series chart would be displayed here</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Metric Comparison</CardTitle>
                <CardDescription>Key metrics comparison between markets</CardDescription>
              </CardHeader>
              <CardContent className="h-72 flex items-center justify-center border border-dashed border-neutral-300 rounded-md">
                <p className="text-neutral-500">Bar chart comparison would be displayed here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="counterfactual">
          <Card>
            <CardHeader>
              <CardTitle>Counterfactual Analysis</CardTitle>
              <CardDescription>
                Comparison between actual results and predicted counterfactual results
              </CardDescription>
            </CardHeader>
            <CardContent className="h-96 flex items-center justify-center border border-dashed border-neutral-300 rounded-md">
              <p className="text-neutral-500">
                Counterfactual comparison visualization would be displayed here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="breakdown">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-4">Results Breakdown</h3>
            <p className="text-neutral-600 mb-6">
              In a full implementation, this tab would display detailed breakdowns 
              of results by various dimensions.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>
                Automatically generated insights from test results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="mr-2 mt-0.5 text-primary">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Strong incremental performance</p>
                    <p className="text-sm text-neutral-600">
                      Test markets showed 12.4% higher conversion rates than control markets, 
                      indicating a significant impact of the TV campaign.
                    </p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="mr-2 mt-0.5 text-primary">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Regional variations</p>
                    <p className="text-sm text-neutral-600">
                      Western markets showed 3.5% higher response to the campaign than 
                      eastern markets, suggesting regional targeting opportunities.
                    </p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="mr-2 mt-0.5 text-primary">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Timing effects</p>
                    <p className="text-sm text-neutral-600">
                      Weekend performance was 22% stronger than weekday performance, 
                      indicating opportunity for daypart optimization.
                    </p>
                  </div>
                </li>
                
                <li className="flex">
                  <div className="mr-2 mt-0.5 text-primary">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">ROI implications</p>
                    <p className="text-sm text-neutral-600">
                      The strong 3.2x ROI suggests increasing investment in TV would 
                      likely deliver additional incremental returns.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestResults;
