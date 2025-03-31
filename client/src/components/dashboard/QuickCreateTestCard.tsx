import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const QuickCreateTestCard: React.FC = () => {
  const steps = [
    {
      title: "Upload Data",
      description: "Upload client sales data by geo and timeframe",
    },
    {
      title: "Pair Markets",
      description: "Identify statistically matched market pairs",
    },
    {
      title: "Design Test",
      description: "Set test parameters and customize design",
    },
    {
      title: "Analyze Results",
      description: "Measure incrementality and generate insights",
    },
  ];

  return (
    <div className="mt-8 bg-gradient-to-r from-primary-700 to-primary-900 rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-8 sm:p-10 sm:pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Ready to start a new test?
            </h3>
            <p className="mt-2 text-primary-100">
              Create a new Matched Market Test in minutes with our guided workflow.
            </p>
            <div className="mt-6">
              <Link href="/create-test">
                <Button variant="outline" className="text-primary-800 bg-white hover:bg-primary-50">
                  Start New Test <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              {steps.map((step, index) => (
                <div key={index} className="bg-white bg-opacity-10 p-4 rounded-lg border border-primary-500">
                  <div className="text-white text-sm font-medium mb-2">{step.title}</div>
                  <p className="text-primary-100 text-xs">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickCreateTestCard;
