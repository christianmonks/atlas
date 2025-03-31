import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const MarketAnalysis: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Market Analysis</h1>
      
      <div className="flex justify-between mb-6">
        <Select defaultValue="test1">
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select Test" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test1">Q2 Brand Campaign</SelectItem>
            <SelectItem value="test2">TV Attribution Study</SelectItem>
          </SelectContent>
        </Select>
        
        <Button>Export Analysis</Button>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pairs">Market Pairs</TabsTrigger>
          <TabsTrigger value="similarity">Similarity Metrics</TabsTrigger>
          <TabsTrigger value="power">Power Analysis</TabsTrigger>
        </TabsList>
        
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
                    <div className="text-sm font-medium">Q2 Brand Campaign</div>
                    
                    <div className="text-sm text-neutral-500">Client:</div>
                    <div className="text-sm font-medium">Acme Corporation</div>
                    
                    <div className="text-sm text-neutral-500">Test Period:</div>
                    <div className="text-sm font-medium">Apr 15 - Jun 20, 2023</div>
                    
                    <div className="text-sm text-neutral-500">Status:</div>
                    <div className="text-sm font-medium">
                      <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded-full">
                        Active
                      </span>
                    </div>
                    
                    <div className="text-sm text-neutral-500">Market Pairs:</div>
                    <div className="text-sm font-medium">6 pairs</div>
                    
                    <div className="text-sm text-neutral-500">Overall Match Quality:</div>
                    <div className="text-sm font-medium">
                      <span className="text-green-600">High (94% similarity)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Market Distribution</CardTitle>
                <CardDescription>Geographic distribution of test markets</CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center border border-dashed border-neutral-300 rounded-md">
                <p className="text-neutral-500">Map visualization would be displayed here</p>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Historical Performance</CardTitle>
                <CardDescription>Sales performance prior to test period</CardDescription>
              </CardHeader>
              <CardContent className="h-72 flex items-center justify-center border border-dashed border-neutral-300 rounded-md">
                <p className="text-neutral-500">Historical performance charts would be displayed here</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="pairs">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-4">Market Pairs Analysis</h3>
            <p className="text-neutral-600 mb-6">
              In a full implementation, this tab would show detailed comparisons of each market pair.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="similarity">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-4">Similarity Metrics</h3>
            <p className="text-neutral-600 mb-6">
              In a full implementation, this tab would display metrics showing how similar 
              the test and control markets are across various dimensions.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="power">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-4">Power Analysis</h3>
            <p className="text-neutral-600 mb-6">
              In a full implementation, this tab would show statistical power calculations 
              and minimum detectable effects.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketAnalysis;
