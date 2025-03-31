import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataUploadForm from "@/components/createTest/DataUploadForm";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateTest: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [testData, setTestData] = useState({
    name: "",
    client: "",
    geoLevel: "DMA",
    dateFrequency: "Daily",
    file: null as File | null,
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTestData({ ...testData, [id]: value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setTestData({ ...testData, [field]: value });
  };

  const handleFileChange = (file: File | null) => {
    setTestData({ ...testData, file });
  };

  const handleNextStep = () => {
    // Basic validation for upload tab
    if (activeTab === "upload") {
      if (!testData.name.trim()) {
        toast({
          title: "Error",
          description: "Test name is required",
          variant: "destructive",
        });
        return;
      }
      if (!testData.client) {
        toast({
          title: "Error",
          description: "Please select a client",
          variant: "destructive",
        });
        return;
      }
      if (!testData.file) {
        toast({
          title: "Error",
          description: "Please upload a data file",
          variant: "destructive",
        });
        return;
      }
      setActiveTab("configure");
    } else if (activeTab === "configure") {
      setActiveTab("markets");
    } else if (activeTab === "markets") {
      setActiveTab("review");
    } else {
      // Submit the form
      toast({
        title: "Test Created",
        description: `Test "${testData.name}" has been created successfully.`,
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create New Test</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Matched Market Test Setup</CardTitle>
          <CardDescription>
            Follow the steps below to create a new Matched Market Test
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="upload">1. Upload Data</TabsTrigger>
              <TabsTrigger value="configure">2. Configure Test</TabsTrigger>
              <TabsTrigger value="markets">3. Select Markets</TabsTrigger>
              <TabsTrigger value="review">4. Review & Launch</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-neutral-800 mb-4">
                  Test Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Test Name
                    </label>
                    <Input
                      id="name"
                      value={testData.name}
                      onChange={handleInputChange}
                      placeholder="Enter test name"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="client"
                      className="block text-sm font-medium text-neutral-700 mb-1"
                    >
                      Client
                    </label>
                    <Select
                      value={testData.client}
                      onValueChange={(value) => handleSelectChange("client", value)}
                    >
                      <SelectTrigger id="client">
                        <SelectValue placeholder="Select a client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                        <SelectItem value="Global Media Inc.">Global Media Inc.</SelectItem>
                        <SelectItem value="Tech Innovators Ltd.">Tech Innovators Ltd.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DataUploadForm
                onFileChange={handleFileChange}
                geoLevel={testData.geoLevel}
                onGeoLevelChange={(value) => handleSelectChange("geoLevel", value)}
                dateFrequency={testData.dateFrequency}
                onDateFrequencyChange={(value) => handleSelectChange("dateFrequency", value)}
              />
            </TabsContent>
            
            <TabsContent value="configure">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-4">Configure Test Parameters</h3>
                <p className="text-neutral-600 mb-6">
                  In a full implementation, this tab would include options to:
                </p>
                <ul className="text-left list-disc max-w-md mx-auto text-neutral-600 space-y-2">
                  <li>Set test duration</li>
                  <li>Define budget constraints</li>
                  <li>Configure target metrics</li>
                  <li>Set market exclusions</li>
                  <li>Configure power analysis parameters</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="markets">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-4">Select Market Pairs</h3>
                <p className="text-neutral-600 mb-6">
                  In a full implementation, this tab would include:
                </p>
                <ul className="text-left list-disc max-w-md mx-auto text-neutral-600 space-y-2">
                  <li>Visualization of matched market pairs</li>
                  <li>Statistical similarity scores</li>
                  <li>Option to adjust pairs manually</li>
                  <li>Market pair comparisons</li>
                  <li>Historical performance data</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="review">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium mb-4">Review & Launch</h3>
                <p className="text-neutral-600 mb-6">
                  In a full implementation, this tab would show:
                </p>
                <ul className="text-left list-disc max-w-md mx-auto text-neutral-600 space-y-2">
                  <li>Complete test summary</li>
                  <li>Selected market pairs</li>
                  <li>Budget allocation</li>
                  <li>Timeline</li>
                  <li>Expected statistical power</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end pt-6 border-t border-neutral-200">
            <Button
              variant="outline"
              onClick={() => {
                const tabs = ["upload", "configure", "markets", "review"];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                }
              }}
              className="mr-3"
              disabled={activeTab === "upload"}
            >
              Back
            </Button>
            <Button onClick={handleNextStep}>
              {activeTab === "review" ? (
                "Launch Test"
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTest;
