import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import DataUploadForm from "./DataUploadForm";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

interface CreateTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateTestModal: React.FC<CreateTestModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [testData, setTestData] = useState({
    name: "",
    client: "",
    geoLevel: "DMA",
    dateFrequency: "Daily",
    file: null as File | null,
  });
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const steps = [
    "Upload Data",
    "Configure Test",
    "Select Markets",
    "Review & Launch",
  ];

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
    // Basic validation for step 1
    if (step === 1) {
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
    }

    if (step < steps.length) {
      setStep(step + 1);
    } else {
      // Final step, create the test
      toast({
        title: "Test Created",
        description: `Test "${testData.name}" has been created successfully.`,
      });
      onClose();
      navigate("/market-analysis");
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-neutral-800">
            Create New Matched Market Test
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6">
          <div className="flex mb-6 border-b border-neutral-200">
            {steps.map((stepName, index) => (
              <div
                key={index}
                className={`pb-2 px-1 ${
                  index > 0 ? "ml-8" : ""
                } ${
                  step === index + 1
                    ? "border-b-2 border-primary text-primary font-medium"
                    : "text-neutral-500"
                }`}
              >
                {index + 1}. {stepName}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium text-neutral-800 mb-2">
                  Test Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="test-name"
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
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h4 className="text-base font-medium text-neutral-800 mb-2">
                Configure Test Parameters
              </h4>
              <p className="text-neutral-600">
                The next step would show test configuration options...
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h4 className="text-base font-medium text-neutral-800 mb-2">
                Select Markets
              </h4>
              <p className="text-neutral-600">
                The third step would show market selection options...
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h4 className="text-base font-medium text-neutral-800 mb-2">
                Review & Launch
              </h4>
              <p className="text-neutral-600">
                The final step would show a summary for review...
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-end border-t border-neutral-200 pt-6">
            <Button
              variant="outline"
              onClick={step === 1 ? onClose : handlePreviousStep}
              className="mr-3"
            >
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            <Button onClick={handleNextStep}>
              {step < steps.length ? `Next: ${steps[step]}` : "Create Test"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTestModal;
