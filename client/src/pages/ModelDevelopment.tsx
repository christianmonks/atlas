import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Code, Play, Save, FileDown, FileUp, GitMerge, RefreshCw } from "lucide-react";

const ModelDevelopment: React.FC = () => {
  // State for code editors
  const [activeModelTab, setActiveModelTab] = useState("market-matching");
  const [code, setCode] = useState<Record<string, string>>({
    "market-matching": `# Market Matching Algorithm
import pandas as pd
import numpy as np
from scipy.spatial.distance import cdist

def calculate_similarity_matrix(data, market_col, feature_cols, weights=None):
    """
    Calculate similarity between markets based on feature columns
    
    Parameters:
    -----------
    data : pandas.DataFrame
        The dataset containing market data
    market_col : str
        Column name containing market identifiers
    feature_cols : list
        List of column names to use as features
    weights : dict, optional
        Dictionary mapping feature columns to weights
        
    Returns:
    --------
    pandas.DataFrame
        Similarity matrix with markets as index/columns
    """
    # Extract features
    features = data[feature_cols].values
    
    # Normalize features
    normalized_features = (features - np.mean(features, axis=0)) / np.std(features, axis=0)
    
    # Apply weights if provided
    if weights is not None:
        weight_array = np.array([weights.get(col, 1.0) for col in feature_cols])
        normalized_features = normalized_features * weight_array
    
    # Calculate distance matrix (Euclidean)
    dist_matrix = cdist(normalized_features, normalized_features, metric='euclidean')
    
    # Convert to similarity (inverse of distance)
    similarity_matrix = 1 / (1 + dist_matrix)
    
    # Create DataFrame with market labels
    markets = data[market_col].values
    sim_df = pd.DataFrame(similarity_matrix, index=markets, columns=markets)
    
    return sim_df

def find_optimal_pairs(similarity_matrix, test_markets=None, exclude_markets=None):
    """
    Find optimal market pairs maximizing overall similarity
    
    Parameters:
    -----------
    similarity_matrix : pandas.DataFrame
        Similarity matrix with markets as index/columns
    test_markets : list, optional
        List of markets to use as test markets
    exclude_markets : list, optional
        List of markets to exclude from pairing
        
    Returns:
    --------
    list of tuples
        Each tuple contains (test_market, control_market, similarity_score)
    """
    from scipy.optimize import linear_sum_assignment
    
    # Copy the similarity matrix
    sim_matrix = similarity_matrix.copy()
    
    # Exclude markets if specified
    if exclude_markets:
        for market in exclude_markets:
            if market in sim_matrix.index:
                sim_matrix = sim_matrix.drop(market, axis=0).drop(market, axis=1)
    
    # Prepare for Hungarian algorithm
    markets = sim_matrix.index.tolist()
    n_markets = len(markets)
    
    # If test markets are specified, reorder the similarity matrix
    if test_markets:
        test_indices = [markets.index(m) for m in test_markets if m in markets]
        control_indices = [i for i in range(n_markets) if i not in test_indices]
        
        # Create submatrix for test-to-control similarity
        sub_matrix = sim_matrix.iloc[test_indices, control_indices].values
        
        # Find optimal assignment
        row_ind, col_ind = linear_sum_assignment(-sub_matrix)  # Negative for maximization
        
        # Create pairs
        pairs = []
        for i, j in zip(row_ind, col_ind):
            test_market = test_markets[i]
            control_market = markets[control_indices[j]]
            similarity = sim_matrix.loc[test_market, control_market]
            pairs.append((test_market, control_market, similarity))
    
    else:
        # Split markets into two equal groups for test and control
        n_test = n_markets // 2
        cost_matrix = -sim_matrix.values  # Negative for maximization
        
        # Find optimal assignment for the bipartite graph
        row_ind, col_ind = linear_sum_assignment(cost_matrix)
        
        # Create pairs based on assignment
        pairs = []
        for i, j in zip(row_ind[:n_test], col_ind[n_test:]):
            test_market = markets[i]
            control_market = markets[j]
            similarity = sim_matrix.loc[test_market, control_market]
            pairs.append((test_market, control_market, similarity))
    
    return pairs`,

    "counterfactual": `# Counterfactual Generation Model
import pandas as pd
import numpy as np
from statsmodels.tsa.statespace.sarimax import SARIMAX
from sklearn.metrics import mean_absolute_error, mean_squared_error

def generate_counterfactual(test_data, control_data, date_col, kpi_col, forecast_periods=None):
    """
    Generate counterfactual predictions for test markets using control market data
    
    Parameters:
    -----------
    test_data : pandas.DataFrame
        Time series data for test markets
    control_data : pandas.DataFrame
        Time series data for control markets
    date_col : str
        Column name containing dates
    kpi_col : str
        Column name containing the KPI to model
    forecast_periods : int, optional
        Number of periods to forecast
        
    Returns:
    --------
    pandas.DataFrame
        DataFrame with actual and counterfactual values
    """
    # Ensure data is sorted by date
    test_data = test_data.sort_values(date_col).reset_index(drop=True)
    control_data = control_data.sort_values(date_col).reset_index(drop=True)
    
    # Determine training and testing periods
    if forecast_periods is None:
        # Default to forecasting the latest 25% of data
        forecast_periods = len(test_data) // 4
    
    train_test = test_data.iloc[:-forecast_periods]
    train_control = control_data.iloc[:-forecast_periods]
    
    # Train SARIMAX model on training data
    # Note: Order and seasonal_order should be optimized with grid search in practice
    model = SARIMAX(
        train_test[kpi_col],
        exog=train_control[kpi_col],
        order=(1, 1, 1),
        seasonal_order=(1, 1, 1, 12),
        enforce_stationarity=False,
        enforce_invertibility=False
    )
    
    results = model.fit(disp=False)
    
    # Generate counterfactual predictions for the entire period
    counterfactual = results.get_prediction(
        exog=control_data[kpi_col].values,
        start=0,
        end=len(test_data)-1
    )
    
    # Extract predicted values
    pred_mean = counterfactual.predicted_mean
    
    # Create result DataFrame
    result = pd.DataFrame({
        date_col: test_data[date_col],
        'actual': test_data[kpi_col],
        'counterfactual': pred_mean,
        'is_forecast': [i >= len(test_data) - forecast_periods for i in range(len(test_data))]
    })
    
    return result

def calculate_incrementality(counterfactual_df, forecast_only=True):
    """
    Calculate incrementality metrics from counterfactual results
    
    Parameters:
    -----------
    counterfactual_df : pandas.DataFrame
        DataFrame with actual and counterfactual values
    forecast_only : bool, optional
        If True, calculate metrics only on forecast period
        
    Returns:
    --------
    dict
        Dictionary containing incrementality metrics
    """
    if forecast_only:
        df = counterfactual_df[counterfactual_df['is_forecast']].copy()
    else:
        df = counterfactual_df.copy()
    
    # Calculate differences
    df['difference'] = df['actual'] - df['counterfactual']
    df['pct_difference'] = df['difference'] / df['counterfactual'] * 100
    
    # Calculate overall incrementality
    total_actual = df['actual'].sum()
    total_counterfactual = df['counterfactual'].sum()
    absolute_lift = total_actual - total_counterfactual
    percent_lift = (absolute_lift / total_counterfactual * 100)
    
    # Calculate error metrics on non-forecast period for model validation
    if forecast_only and not counterfactual_df[~counterfactual_df['is_forecast']].empty:
        validation_df = counterfactual_df[~counterfactual_df['is_forecast']]
        mae = mean_absolute_error(validation_df['actual'], validation_df['counterfactual'])
        rmse = np.sqrt(mean_squared_error(validation_df['actual'], validation_df['counterfactual']))
    else:
        mae = np.nan
        rmse = np.nan
    
    return {
        'total_actual': total_actual,
        'total_counterfactual': total_counterfactual,
        'absolute_lift': absolute_lift,
        'percent_lift': percent_lift,
        'model_mae': mae,
        'model_rmse': rmse
    }`,

    "power-analysis": `# Power Analysis for Matched Market Testing
import numpy as np
from scipy import stats

def calculate_sample_size(effect_size, power=0.8, alpha=0.05, ratio=1.0, two_sided=True):
    """
    Calculate required sample size for detecting a difference between two groups
    
    Parameters:
    -----------
    effect_size : float
        Expected effect size (Cohen's d)
    power : float, optional
        Statistical power (1-β), default is 0.8
    alpha : float, optional
        Significance level (α), default is 0.05
    ratio : float, optional
        Ratio of control to treatment groups, default is 1.0 (equal sizes)
    two_sided : bool, optional
        Whether to use a two-sided test, default is True
        
    Returns:
    --------
    dict
        Dictionary containing sample size information
    """
    # Calculate required Z values
    if two_sided:
        z_alpha = stats.norm.ppf(1 - alpha/2)
    else:
        z_alpha = stats.norm.ppf(1 - alpha)
    
    z_beta = stats.norm.ppf(power)
    
    # Calculate n for each group
    n1 = (((z_alpha + z_beta)**2) * (1 + 1/ratio)) / effect_size**2
    n2 = n1 * ratio
    
    # Round up to next integer
    n1 = int(np.ceil(n1))
    n2 = int(np.ceil(n2))
    
    return {
        'n_treatment': n1,
        'n_control': n2,
        'total_sample_size': n1 + n2,
        'power': power,
        'alpha': alpha,
        'effect_size': effect_size
    }

def calculate_minimum_detectable_effect(n_treatment, n_control, power=0.8, alpha=0.05, two_sided=True):
    """
    Calculate minimum detectable effect size for a given sample size
    
    Parameters:
    -----------
    n_treatment : int
        Number of units in treatment group
    n_control : int
        Number of units in control group
    power : float, optional
        Statistical power (1-β), default is 0.8
    alpha : float, optional
        Significance level (α), default is 0.05
    two_sided : bool, optional
        Whether to use a two-sided test, default is True
        
    Returns:
    --------
    dict
        Dictionary containing minimum detectable effect information
    """
    # Calculate required Z values
    if two_sided:
        z_alpha = stats.norm.ppf(1 - alpha/2)
    else:
        z_alpha = stats.norm.ppf(1 - alpha)
    
    z_beta = stats.norm.ppf(power)
    
    # Calculate minimum detectable effect size
    ratio = n_control / n_treatment
    mde = np.sqrt((z_alpha + z_beta)**2 * (1 + 1/ratio) / n_treatment)
    
    return {
        'minimum_detectable_effect': mde,
        'n_treatment': n_treatment,
        'n_control': n_control,
        'power': power,
        'alpha': alpha
    }

def power_analysis_for_matched_markets(n_pairs, effect_size=None, variance=1.0, correlation=0.5, alpha=0.05):
    """
    Conduct power analysis for matched market tests
    
    Parameters:
    -----------
    n_pairs : int
        Number of matched market pairs
    effect_size : float, optional
        Expected effect size (Cohen's d)
    variance : float, optional
        Variance of the outcome variable
    correlation : float, optional
        Correlation between matched pairs
    alpha : float, optional
        Significance level (α), default is 0.05
        
    Returns:
    --------
    dict
        Dictionary containing power analysis results
    """
    # Calculate standard error
    std_error = np.sqrt(2 * variance * (1 - correlation) / n_pairs)
    
    # If effect size is provided, calculate power
    if effect_size is not None:
        z_alpha = stats.norm.ppf(1 - alpha/2)
        z_score = effect_size / std_error
        power = stats.norm.cdf(z_score - z_alpha)
        
        return {
            'n_pairs': n_pairs,
            'effect_size': effect_size,
            'power': power,
            'alpha': alpha,
            'correlation': correlation
        }
    
    # If effect size is not provided, calculate minimum detectable effect
    else:
        z_alpha = stats.norm.ppf(1 - alpha/2)
        z_beta = stats.norm.ppf(0.8)  # Default power of 0.8
        mde = (z_alpha + z_beta) * std_error
        
        return {
            'n_pairs': n_pairs,
            'minimum_detectable_effect': mde,
            'power': 0.8,  # Default power
            'alpha': alpha,
            'correlation': correlation
        }`
  });

  // State for model execution
  const [outputResult, setOutputResult] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  
  // State for model parameters
  const [modelParams, setModelParams] = useState<Record<string, any>>({
    "market-matching": {
      dataSource: "sample_market_data.csv",
      marketColumn: "Market",
      featureColumns: "Population,Income,Sales",
      excludeMarkets: "",
      weightPopulation: "1.0",
      weightIncome: "0.8",
      weightSales: "1.2"
    },
    "counterfactual": {
      testData: "test_markets.csv",
      controlData: "control_markets.csv",
      dateColumn: "Date",
      kpiColumn: "Sales",
      forecastPeriods: "8"
    },
    "power-analysis": {
      numPairs: "20",
      effectSize: "0.15",
      variance: "1.0",
      correlation: "0.7",
      alpha: "0.05"
    }
  });

  // Handle model parameter change
  const handleParamChange = (model: string, param: string, value: string) => {
    setModelParams({
      ...modelParams,
      [model]: {
        ...modelParams[model],
        [param]: value
      }
    });
  };

  // Handle code change
  const handleCodeChange = (value: string) => {
    setCode({
      ...code,
      [activeModelTab]: value
    });
  };

  // Simulated progressive model execution with step-by-step output
  const executeModel = () => {
    setIsExecuting(true);
    setOutputResult("");
    
    const params = modelParams[activeModelTab];
    let result = "";
    let steps: string[] = [];
    let stepDelays: number[] = [];
    
    if (activeModelTab === "market-matching") {
      steps = [
        `Importing libraries: pandas, numpy, scipy...
Loading data from ${params.dataSource}...`,
      
        `Data loaded successfully.
Rows: 578, Columns: 15
Features extracted: ${params.featureColumns}
${params.excludeMarkets ? `Excluded markets: ${params.excludeMarkets}` : "No markets excluded"}`,
      
        `Preprocessing data...
Normalizing features...
Applying feature weights:
- Population: ${params.weightPopulation}
- Income: ${params.weightIncome}
- Sales: ${params.weightSales}`,
      
        `Computing similarity matrix (578x578)...
[####################] 100%
Matrix computed in 1.23s`,
      
        `Applying Hungarian algorithm for optimal market pairing...
[####################] 100%
Optimization complete in 0.75s

Results:
Matched 18 test markets with control markets
Average similarity score: 0.83
Top market pairs:
1. New York - Chicago (similarity: 0.92)
2. Los Angeles - Philadelphia (similarity: 0.89)
3. Houston - Phoenix (similarity: 0.85)
4. San Diego - Dallas (similarity: 0.81)
5. Miami - Atlanta (similarity: 0.79)

Market pairs saved to matched_markets.csv
Process completed successfully in 3.71s`
      ];
      stepDelays = [800, 1200, 1000, 1500, 1800];
    } else if (activeModelTab === "counterfactual") {
      steps = [
        `Importing libraries: pandas, numpy, statsmodels, sklearn...
Loading test data from ${params.testData}...
Loading control data from ${params.controlData}...`,
      
        `Data loaded successfully.
Test data: 365 rows x 8 columns
Control data: 365 rows x 8 columns
Date column: ${params.dateColumn}
KPI column: ${params.kpiColumn}`,
      
        `Preprocessing time series data...
Checking for missing values...
Aligning test and control data...
Determining training period (${parseInt(params.forecastPeriods)} periods forecast)...`,
      
        `Fitting SARIMAX model...
Order: (1, 1, 1)
Seasonal Order: (1, 1, 1, 12)
[####################] 100%
Model fit complete in 2.84s`,
      
        `Generating counterfactual predictions...
[####################] 100%
Predictions generated for all ${parseInt(params.forecastPeriods)} periods

Results:
Model fit statistics:
- AIC: 876.32
- BIC: 892.15
- RMSE on validation data: 234.56

Incrementality Results:
- Total Actual: 2,345,678
- Total Counterfactual: 2,156,789
- Absolute Lift: 188,889
- Percent Lift: 8.76%

Counterfactual results saved to counterfactual_results.csv
Visualization saved to counterfactual_plot.png
Process completed successfully in 4.35s`
      ];
      stepDelays = [800, 1000, 1200, 2000, 1500];
    } else if (activeModelTab === "power-analysis") {
      steps = [
        `Importing libraries: numpy, scipy...
Initializing power analysis with parameters:
- Number of Market Pairs: ${params.numPairs}
- Expected Effect Size: ${params.effectSize}
- Variance: ${params.variance}
- Correlation between pairs: ${params.correlation}
- Alpha (significance level): ${params.alpha}`,
      
        `Computing standard error...
SE = √(2 * ${params.variance} * (1 - ${params.correlation}) / ${params.numPairs})
SE = ${(Math.sqrt(2 * parseFloat(params.variance) * (1 - parseFloat(params.correlation)) / parseInt(params.numPairs))).toFixed(4)}`,
      
        `Calculating z-scores...
z_alpha (${parseFloat(params.alpha)}) = ${(1.96).toFixed(4)}
z_beta (0.80) = ${(0.84).toFixed(4)}`,
      
        `Computing statistical power...
Power = Φ(z_effect - z_alpha)
[####################] 100%
Power calculation complete in 0.12s

Results:
For ${params.numPairs} market pairs with correlation ${params.correlation}:
- Statistical Power: 86.4%
- Minimum Detectable Effect: 12.3%
- Confidence Level: ${(1 - parseFloat(params.alpha)) * 100}%

With this test design, you have an 86.4% chance of detecting a true effect of ${(parseFloat(params.effectSize) * 100).toFixed(1)}% or larger.

Power curve saved to power_analysis_curve.png
Process completed successfully in 0.94s`
      ];
      stepDelays = [800, 1000, 800, 1500];
    }
    
    // Progressive output simulation
    let currentStep = 0;
    
    const updateOutput = () => {
      if (currentStep < steps.length) {
        // Add new step to the result
        result += (currentStep > 0 ? "\n\n" : "") + steps[currentStep];
        setOutputResult(result);
        
        // Schedule next step
        currentStep++;
        if (currentStep < steps.length) {
          setTimeout(updateOutput, stepDelays[currentStep - 1]);
        } else {
          setTimeout(() => setIsExecuting(false), 500);
        }
      } else {
        setIsExecuting(false);
      }
    };
    
    // Start the progressive output
    setTimeout(updateOutput, 500);
  };

  // Simulated progressive model deployment with step-by-step output
  const deployModel = () => {
    setIsExecuting(true);
    setOutputResult("");
    
    const modelId = `${activeModelTab}-${Date.now().toString().substring(8)}`;
    const timestamp = new Date().toISOString();
    let result = "";
    let steps: string[] = [
      `Preparing ${activeModelTab} model for deployment...
Validating model code...
Running unit tests...`,
      
      `Serializing model objects...
Compressing model artifacts...
[####################] 100%
Model artifacts created successfully.`,
      
      `Connecting to model registry...
Uploading model artifacts...
[####################] 100%
Model uploaded successfully.`,
      
      `Registering API endpoints...
Creating documentation...
Configuring rate limits...
Setting up model monitoring...`,
      
      `Deployment completed successfully!

Version Information:
- Model ID: ${modelId}
- Deployed by: Admin
- Timestamp: ${timestamp}
- Status: Active

The model is now available for use in the production environment.
You can access it through the API at /api/models/${activeModelTab}

Monitoring dashboard: https://dashboard.atlas.ai/models/${modelId}`
    ];
    let stepDelays = [1000, 1500, 2000, 1500, 1000];
    
    // Progressive output simulation
    let currentStep = 0;
    
    const updateOutput = () => {
      if (currentStep < steps.length) {
        // Add new step to the result
        result += (currentStep > 0 ? "\n\n" : "") + steps[currentStep];
        setOutputResult(result);
        
        // Schedule next step
        currentStep++;
        if (currentStep < steps.length) {
          setTimeout(updateOutput, stepDelays[currentStep - 1]);
        } else {
          setTimeout(() => setIsExecuting(false), 500);
        }
      } else {
        setIsExecuting(false);
      }
    };
    
    // Start the progressive output
    setTimeout(updateOutput, 500);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Model Development</h1>
        <div className="space-x-2">
          <Button variant="outline">
            <BookOpen className="h-4 w-4 mr-2" />
            Documentation
          </Button>
          <Button>
            <Code className="h-4 w-4 mr-2" />
            Model Repository
          </Button>
        </div>
      </div>

      <Tabs value={activeModelTab} onValueChange={setActiveModelTab} className="mb-6">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="market-matching">Market Matching</TabsTrigger>
          <TabsTrigger value="counterfactual">Counterfactual Generation</TabsTrigger>
          <TabsTrigger value="power-analysis">Power Analysis</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Code Editor Panel */}
        <Card className="lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span>Model Code Editor</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button 
                  size="sm"
                  onClick={executeModel}
                  disabled={isExecuting}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Execute
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Edit model code and parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border rounded-md overflow-hidden">
              <div className="bg-[#1e1e1e] text-white p-2 flex justify-between items-center">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="text-xs text-gray-400">python - {activeModelTab}.py</div>
                <div className="flex space-x-2 text-xs text-gray-400">
                  <span>Python 3.8.10</span>
                </div>
              </div>
              
              <div className="relative bg-[#1e1e1e] text-white">
                {/* Line numbers */}
                <div className="absolute top-0 left-0 bottom-0 w-12 bg-[#252525] flex flex-col items-end pr-2 pt-2 pb-2 text-[#6e6e6e] font-mono text-xs select-none">
                  {code[activeModelTab].split('\n').map((_, i) => (
                    <div key={i} className="leading-6">{i + 1}</div>
                  ))}
                </div>
                
                {/* Code editor */}
                <Textarea
                  className="min-h-[500px] font-mono text-sm resize-none bg-[#1e1e1e] border-0 focus-visible:ring-0 pl-14 pr-4 pt-2 pb-2 w-full text-[#d4d4d4]"
                  placeholder="# Enter your model code here"
                  value={code[activeModelTab]}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  spellCheck={false}
                />
              </div>
              
              {/* Status bar */}
              <div className="bg-[#007acc] text-white text-xs flex justify-between items-center px-3 py-1">
                <div>Python</div>
                <div className="flex space-x-4">
                  <span>Ln {code[activeModelTab].split('\n').length}</span>
                  <span>UTF-8</span>
                  <span>Spaces: 4</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parameters and Output Panel */}
        <Card className="lg:col-span-3">
          <Tabs defaultValue="parameters">
            <TabsList className="w-full">
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="output">Output</TabsTrigger>
            </TabsList>
            
            <TabsContent value="parameters" className="m-0 pt-4">
              <CardContent className="space-y-6 px-4 pt-0">
                {activeModelTab === "market-matching" && (
                  <>
                    <div className="space-y-2">
                      <Label>Data Source</Label>
                      <Select 
                        value={modelParams["market-matching"].dataSource} 
                        onValueChange={(v) => handleParamChange("market-matching", "dataSource", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select data source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sample_market_data.csv">sample_market_data.csv</SelectItem>
                          <SelectItem value="market_demographics.csv">market_demographics.csv</SelectItem>
                          <SelectItem value="uploaded_data.csv">uploaded_data.csv</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Market Column</Label>
                      <Input 
                        value={modelParams["market-matching"].marketColumn}
                        onChange={(e) => handleParamChange("market-matching", "marketColumn", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Feature Columns (comma-separated)</Label>
                      <Input 
                        value={modelParams["market-matching"].featureColumns}
                        onChange={(e) => handleParamChange("market-matching", "featureColumns", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Exclude Markets (comma-separated)</Label>
                      <Input 
                        value={modelParams["market-matching"].excludeMarkets}
                        onChange={(e) => handleParamChange("market-matching", "excludeMarkets", e.target.value)}
                        placeholder="Optional"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Feature Weights</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Population</Label>
                          <Input 
                            value={modelParams["market-matching"].weightPopulation}
                            onChange={(e) => handleParamChange("market-matching", "weightPopulation", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Income</Label>
                          <Input 
                            value={modelParams["market-matching"].weightIncome}
                            onChange={(e) => handleParamChange("market-matching", "weightIncome", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Sales</Label>
                          <Input 
                            value={modelParams["market-matching"].weightSales}
                            onChange={(e) => handleParamChange("market-matching", "weightSales", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                {activeModelTab === "counterfactual" && (
                  <>
                    <div className="space-y-2">
                      <Label>Test Data</Label>
                      <Select 
                        value={modelParams["counterfactual"].testData} 
                        onValueChange={(v) => handleParamChange("counterfactual", "testData", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select test data" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="test_markets.csv">test_markets.csv</SelectItem>
                          <SelectItem value="test_sales_timeseries.csv">test_sales_timeseries.csv</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Control Data</Label>
                      <Select 
                        value={modelParams["counterfactual"].controlData} 
                        onValueChange={(v) => handleParamChange("counterfactual", "controlData", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select control data" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="control_markets.csv">control_markets.csv</SelectItem>
                          <SelectItem value="control_sales_timeseries.csv">control_sales_timeseries.csv</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Date Column</Label>
                      <Input 
                        value={modelParams["counterfactual"].dateColumn}
                        onChange={(e) => handleParamChange("counterfactual", "dateColumn", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>KPI Column</Label>
                      <Input 
                        value={modelParams["counterfactual"].kpiColumn}
                        onChange={(e) => handleParamChange("counterfactual", "kpiColumn", e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Forecast Periods</Label>
                      <Input 
                        value={modelParams["counterfactual"].forecastPeriods}
                        onChange={(e) => handleParamChange("counterfactual", "forecastPeriods", e.target.value)}
                        type="number"
                        min="1"
                      />
                    </div>
                  </>
                )}
                
                {activeModelTab === "power-analysis" && (
                  <>
                    <div className="space-y-2">
                      <Label>Number of Market Pairs</Label>
                      <Input 
                        value={modelParams["power-analysis"].numPairs}
                        onChange={(e) => handleParamChange("power-analysis", "numPairs", e.target.value)}
                        type="number"
                        min="1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Expected Effect Size</Label>
                      <Input 
                        value={modelParams["power-analysis"].effectSize}
                        onChange={(e) => handleParamChange("power-analysis", "effectSize", e.target.value)}
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="1"
                      />
                      <p className="text-xs text-neutral-500">Value between 0 and 1, e.g., 0.15 means 15% lift</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Variance</Label>
                      <Input 
                        value={modelParams["power-analysis"].variance}
                        onChange={(e) => handleParamChange("power-analysis", "variance", e.target.value)}
                        type="number"
                        step="0.1"
                        min="0.1"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Correlation between pairs</Label>
                      <Input 
                        value={modelParams["power-analysis"].correlation}
                        onChange={(e) => handleParamChange("power-analysis", "correlation", e.target.value)}
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                      />
                      <p className="text-xs text-neutral-500">Value between 0 and 1, higher means better matches</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Alpha (significance level)</Label>
                      <Select 
                        value={modelParams["power-analysis"].alpha} 
                        onValueChange={(v) => handleParamChange("power-analysis", "alpha", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select alpha" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.01">0.01 (99% confidence)</SelectItem>
                          <SelectItem value="0.05">0.05 (95% confidence)</SelectItem>
                          <SelectItem value="0.1">0.10 (90% confidence)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
                
                <div className="flex justify-center space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      // Reset parameters to defaults (not implemented)
                      window.alert("Reset parameters functionality would be implemented here");
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button 
                    onClick={executeModel} 
                    disabled={isExecuting}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Execute
                  </Button>
                </div>
              </CardContent>
            </TabsContent>
            
            <TabsContent value="output" className="m-0 pt-4">
              <CardContent className="px-4 pt-0">
                <div className="mb-4 flex justify-between items-center">
                  <h3 className="text-sm font-medium">Execution Results</h3>
                  <div className="space-x-2">
                    <Button size="sm" variant="outline" disabled={!outputResult}>
                      <FileDown className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" disabled={!outputResult || isExecuting}>
                      <FileUp className="h-4 w-4 mr-1" />
                      Export
                    </Button>
                    {outputResult && !isExecuting && (
                      <Button size="sm" onClick={deployModel}>
                        <GitMerge className="h-4 w-4 mr-1" />
                        Deploy
                      </Button>
                    )}
                  </div>
                </div>
                <div className="bg-[#1e1e1e] border-0 rounded-md min-h-[500px] font-mono text-sm whitespace-pre-wrap overflow-auto">
                  <div className="flex items-center bg-[#252525] px-4 py-2 border-b border-[#3e3e3e] text-xs text-gray-400">
                    <div className="flex-1">Terminal - Python Console</div>
                    <div className="flex space-x-4">
                      <span>Python 3.8.10</span>
                      <span>UTF-8</span>
                    </div>
                  </div>
                  
                  <div className="p-4 text-[#d4d4d4]">
                    {isExecuting ? (
                      <div>
                        <span className="text-green-400">{'>>> '}</span>
                        <span className="text-yellow-300">{`Running ${activeModelTab}...`}</span>
                        <div className="flex mt-2 ml-8">
                          <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full mr-2"></div>
                          <span className="text-blue-400">Processing data...</span>
                        </div>
                      </div>
                    ) : outputResult ? (
                      <div>
                        <span className="text-green-400">{'>>> '}</span>
                        <span className="text-yellow-300">{`${activeModelTab}.execute()`}</span>
                        <div className="mt-2 pl-4 border-l-2 border-[#3e3e3e]">
                          {outputResult.split('\n').map((line, i) => {
                            // Add some color coding to the output
                            if (line.includes('Error') || line.includes('error')) {
                              return <div key={i} className="text-red-400">{line}</div>;
                            } else if (line.includes('Results:') || line.includes('Statistics:') || line.match(/^[A-Za-z]+:/)) {
                              return <div key={i} className="text-blue-400 font-semibold">{line}</div>;
                            } else if (line.match(/^\d+\./)) {
                              return <div key={i}><span className="text-yellow-300">{line.split('.')[0]}.</span>{line.substring(line.indexOf('.') + 1)}</div>;
                            } else if (line.match(/^-/)) {
                              return <div key={i} className="text-gray-400">{line}</div>;
                            }
                            return <div key={i}>{line}</div>;
                          })}
                        </div>
                        <div className="mt-3">
                          <span className="text-green-400">{'>>> '}</span>
                          <span className="opacity-75 animate-pulse">_</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-blue-400">Python {new Date().toLocaleString()}</div>
                        <div className="text-gray-500 mb-4">[Matched Market Testing Environment]</div>
                        <span className="text-green-400">{'>>> '}</span>
                        <span className="opacity-75 animate-pulse">_</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ModelDevelopment;