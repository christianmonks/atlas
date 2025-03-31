import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Info, Database, Calculator, GitBranch, GitCommit, GitMerge } from "lucide-react";

const ModelOperations: React.FC = () => {
  const [activeStep, setActiveStep] = useState("data-processing");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Model Operations</h1>
        <div className="space-x-2">
          <Button variant="outline">
            <Info className="h-4 w-4 mr-2" />
            Documentation
          </Button>
          <Button>View Model Logs</Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Model Pipeline Visualization</CardTitle>
          <CardDescription>
            Step-by-step visualization of the matched market model pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between overflow-x-auto py-4 px-2">
            <PipelineStep 
              icon={<Database className="h-5 w-5" />}
              title="Data Processing"
              isActive={activeStep === "data-processing"}
              isCompleted={true}
              onClick={() => setActiveStep("data-processing")}
            />
            <div className="w-10 h-0.5 bg-neutral-200 mx-1"></div>
            
            <PipelineStep 
              icon={<Calculator className="h-5 w-5" />}
              title="Similarity Scoring"
              isActive={activeStep === "similarity-scoring"}
              isCompleted={true}
              onClick={() => setActiveStep("similarity-scoring")}
            />
            <div className="w-10 h-0.5 bg-neutral-200 mx-1"></div>
            
            <PipelineStep 
              icon={<GitBranch className="h-5 w-5" />}
              title="Market Pairing"
              isActive={activeStep === "market-pairing"}
              isCompleted={true}
              onClick={() => setActiveStep("market-pairing")}
            />
            <div className="w-10 h-0.5 bg-neutral-200 mx-1"></div>
            
            <PipelineStep 
              icon={<GitCommit className="h-5 w-5" />}
              title="Counterfactual Generation"
              isActive={activeStep === "counterfactual-generation"}
              isCompleted={false}
              onClick={() => setActiveStep("counterfactual-generation")}
            />
            <div className="w-10 h-0.5 bg-neutral-200 mx-1"></div>
            
            <PipelineStep 
              icon={<GitMerge className="h-5 w-5" />}
              title="Incrementality Calculation"
              isActive={activeStep === "incrementality-calculation"}
              isCompleted={false}
              onClick={() => setActiveStep("incrementality-calculation")}
            />
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <TabsList className="mb-6 w-full justify-start">
          <TabsTrigger value="data-processing">Data Processing</TabsTrigger>
          <TabsTrigger value="similarity-scoring">Similarity Scoring</TabsTrigger>
          <TabsTrigger value="market-pairing">Market Pairing</TabsTrigger>
          <TabsTrigger value="counterfactual-generation">Counterfactual Generation</TabsTrigger>
          <TabsTrigger value="incrementality-calculation">Incrementality Calculation</TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Algorithm Details</CardTitle>
              <CardDescription>Technical implementation details</CardDescription>
            </CardHeader>
            <CardContent>
              <StepDetails step={activeStep} technical={true} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Non-Technical Explanation</CardTitle>
              <CardDescription>Simplified explanation of the process</CardDescription>
            </CardHeader>
            <CardContent>
              <StepDetails step={activeStep} technical={false} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Step Visualization</CardTitle>
              <CardDescription>Visual representation of the process</CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center border border-dashed border-neutral-300 rounded-md">
              <p className="text-neutral-500">Visualization for {getStepDisplayName(activeStep)} would be displayed here</p>
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

interface PipelineStepProps {
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

const PipelineStep: React.FC<PipelineStepProps> = ({
  icon,
  title,
  isActive,
  isCompleted,
  onClick,
}) => {
  return (
    <button
      className={`flex flex-col items-center px-4 py-3 rounded-md transition-colors ${
        isActive
          ? "bg-primary-50 border border-primary-200"
          : "hover:bg-neutral-50"
      }`}
      onClick={onClick}
    >
      <div
        className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 ${
          isActive
            ? "bg-primary text-white"
            : isCompleted
            ? "bg-green-100 text-green-600"
            : "bg-neutral-100 text-neutral-500"
        }`}
      >
        {icon}
      </div>
      <span
        className={`text-sm font-medium whitespace-nowrap ${
          isActive ? "text-primary" : "text-neutral-700"
        }`}
      >
        {title}
      </span>
      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`h-1 w-1 rounded-full mx-0.5 ${
              isActive || isCompleted
                ? "bg-primary"
                : "bg-neutral-300"
            }`}
          ></div>
        ))}
      </div>
    </button>
  );
};

const getStepDisplayName = (step: string): string => {
  switch (step) {
    case "data-processing":
      return "Data Processing";
    case "similarity-scoring":
      return "Similarity Scoring";
    case "market-pairing":
      return "Market Pairing";
    case "counterfactual-generation":
      return "Counterfactual Generation";
    case "incrementality-calculation":
      return "Incrementality Calculation";
    default:
      return step;
  }
};

interface StepDetailsProps {
  step: string;
  technical: boolean;
}

const StepDetails: React.FC<StepDetailsProps> = ({ step, technical }) => {
  const details = {
    "data-processing": {
      technical: (
        <div className="space-y-3">
          <p>
            The data processing stage involves cleaning and normalizing raw client sales data across multiple dimensions:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Temporal alignment of time-series data across all markets</li>
            <li>Outlier detection and treatment using modified Z-score method</li>
            <li>Missing value imputation with forward-fill/backward-fill</li>
            <li>Normalization using min-max scaling to account for market size differences</li>
            <li>Seasonal decomposition using STL (Seasonal and Trend decomposition using Loess)</li>
          </ul>
          <p className="text-sm">
            <code className="bg-neutral-100 px-1 py-0.5 rounded">cleanData(data, options)</code> function applies these transformations sequentially with configurable parameters.
          </p>
        </div>
      ),
      nonTechnical: (
        <div className="space-y-3">
          <p>
            In this step, we prepare the raw sales data so it can be accurately compared:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>We make sure all data points line up on the same calendar</li>
            <li>We identify and adjust any unusual spikes or drops in sales</li>
            <li>We fill in any missing data points</li>
            <li>We adjust for different market sizes (like comparing NYC to a smaller city)</li>
            <li>We separate regular seasonal patterns (like holiday shopping) from the underlying trends</li>
          </ul>
          <p className="text-sm italic">
            Think of it like making sure we're comparing apples to apples, not apples to oranges, before we match markets.
          </p>
        </div>
      )
    },
    "similarity-scoring": {
      technical: (
        <div className="space-y-3">
          <p>
            The similarity scoring module calculates multi-dimensional similarity between markets using:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Dynamic Time Warping (DTW) for time-series similarity</li>
            <li>Pearson and Spearman correlation coefficients</li>
            <li>Jensen-Shannon divergence for distribution similarity</li>
            <li>Euclidean and Manhattan distances for demographic variable proximity</li>
            <li>Weighted feature importance based on client-specific business objectives</li>
          </ul>
          <p className="text-sm">
            Final similarity scores are computed as <code className="bg-neutral-100 px-1 py-0.5 rounded">S = Σ(w_i * s_i)</code> where w_i are the weights and s_i are individual similarity measures.
          </p>
        </div>
      ),
      nonTechnical: (
        <div className="space-y-3">
          <p>
            In this step, we measure how similar different markets are to each other:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>We look at how sales patterns move over time</li>
            <li>We check if sales go up and down together across markets</li>
            <li>We compare how similar or different consumer behavior is</li>
            <li>We measure how close markets are in terms of population, income, etc.</li>
            <li>We focus more on factors that matter most to your business</li>
          </ul>
          <p className="text-sm italic">
            Think of it like finding twins among markets - they might not be identical, but they should be as similar as possible in ways that matter to your business.
          </p>
        </div>
      )
    },
    "market-pairing": {
      technical: (
        <div className="space-y-3">
          <p>
            The market pairing algorithm uses advanced optimization techniques:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Hungarian algorithm for optimal bipartite matching</li>
            <li>Hierarchical clustering with custom distance metrics</li>
            <li>Constraint satisfaction for client-specified market exclusions</li>
            <li>Monte Carlo simulations for statistical power validation</li>
            <li>Greedy optimization for budget allocation constraints</li>
          </ul>
          <p className="text-sm">
            This implementation achieves O(n³) time complexity with substantial optimizations for real-time interactive use.
          </p>
        </div>
      ),
      nonTechnical: (
        <div className="space-y-3">
          <p>
            In this step, we match markets into pairs for testing:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>We find the optimal pairings that maximize overall similarity</li>
            <li>We group markets that naturally cluster together</li>
            <li>We respect any markets you've asked to exclude</li>
            <li>We ensure the test will be powerful enough to detect meaningful results</li>
            <li>We work within your budget constraints</li>
          </ul>
          <p className="text-sm italic">
            Think of it like creating the perfect dance partners - each test market gets paired with a control market that moves in the same way, so we can spot when the test market starts dancing differently.
          </p>
        </div>
      )
    },
    "counterfactual-generation": {
      technical: (
        <div className="space-y-3">
          <p>
            Our counterfactual modeling employs several forecasting techniques:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>ARIMA (AutoRegressive Integrated Moving Average) models</li>
            <li>Prophet time-series forecasting with seasonality components</li>
            <li>GBM (Gradient Boosting Machines) for non-linear relationships</li>
            <li>Bayesian structural time-series models for causal inference</li>
            <li>Ensemble methods combining multiple forecasting approaches</li>
          </ul>
          <p className="text-sm">
            Model selection uses cross-validation with MAPE (Mean Absolute Percentage Error) and RMSE (Root Mean Square Error) metrics.
          </p>
        </div>
      ),
      nonTechnical: (
        <div className="space-y-3">
          <p>
            In this step, we predict "what would have happened" in test markets if no campaign had run:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>We use historical patterns to forecast expected sales</li>
            <li>We account for seasonal factors like holidays or weather</li>
            <li>We capture complex relationships between different variables</li>
            <li>We build models that understand cause and effect</li>
            <li>We combine multiple prediction methods for better accuracy</li>
          </ul>
          <p className="text-sm italic">
            Think of it as creating an alternate reality - we predict what would have happened in the test markets if they hadn't received the media campaign, so we can measure the true impact.
          </p>
        </div>
      )
    },
    "incrementality-calculation": {
      technical: (
        <div className="space-y-3">
          <p>
            Incrementality is calculated through rigorous statistical methods:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Difference-in-Differences (DiD) estimation</li>
            <li>Synthetic control methods for robust counterfactuals</li>
            <li>Bootstrap resampling for confidence interval estimation</li>
            <li>Bayesian inference for probability distributions of lift</li>
            <li>Sequential testing with false discovery rate control</li>
          </ul>
          <p className="text-sm">
            The primary incrementality formula is: <code className="bg-neutral-100 px-1 py-0.5 rounded">Inc(%) = [(Actual - Predicted)/Predicted] * 100</code>
          </p>
        </div>
      ),
      nonTechnical: (
        <div className="space-y-3">
          <p>
            In this final step, we measure the true impact of your media campaign:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>We compare what actually happened to what we predicted would happen</li>
            <li>We create the most accurate comparison possible</li>
            <li>We calculate how confident we can be in the results</li>
            <li>We determine the range of possible impact, not just a single number</li>
            <li>We ensure we're not seeing patterns that aren't really there</li>
          </ul>
          <p className="text-sm italic">
            Think of it as measuring the ripples - we can see exactly how much your media campaign moved the needle by comparing real results to our alternate reality prediction.
          </p>
        </div>
      )
    }
  };

  const content = details[step as keyof typeof details];
  if (!content) return <p>Select a step to view details</p>;

  return technical ? content.technical : content.nonTechnical;
};

export default ModelOperations;
