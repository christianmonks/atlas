import Papa from 'papaparse';
import { TIER } from './constants';

/**
 * Parse a CSV file and return the data
 * @param file The CSV file to parse
 * @returns A promise that resolves to the parsed data
 */
export const parseCSVFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors.length) {
          reject(results.errors[0]);
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

/**
 * Group data by a specific column (e.g., tier)
 * @param data The data to group
 * @param groupByColumn The column to group by
 * @returns An object with the grouped data
 */
export const groupDataByColumn = (data: any[], groupByColumn: string): Record<string, any[]> => {
  return data.reduce((acc, item) => {
    const key = item[groupByColumn];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {});
};

/**
 * Calculate the average value for a column in a dataset
 * @param data The data to calculate the average for
 * @param column The column to calculate the average for
 * @returns The average value
 */
export const calculateAverage = (data: any[], column: string): number => {
  if (!data.length) return 0;
  const sum = data.reduce((acc, item) => acc + (parseFloat(item[column]) || 0), 0);
  return sum / data.length;
};

/**
 * Extract feature weights from data
 * @param data The data to extract feature weights from
 * @param featuresArray Array of feature names to extract
 * @returns An array of feature weight objects
 */
export const extractFeatureWeights = (data: any[], featuresArray: string[]): { Feature: string, Weight: number }[] => {
  // Create a map to sum the values for each feature
  const featureSums: Record<string, number> = {};
  
  // Initialize with zero
  featuresArray.forEach(feature => {
    featureSums[feature] = 0;
  });
  
  // Sum up feature values
  data.forEach(item => {
    featuresArray.forEach(feature => {
      if (item[feature] !== undefined) {
        featureSums[feature] += parseFloat(item[feature]) || 0;
      }
    });
  });
  
  // Calculate total for normalization
  const total = Object.values(featureSums).reduce((sum, value) => sum + value, 0);
  
  // Create normalized feature weight objects
  return featuresArray.map(feature => ({
    Feature: feature,
    Weight: total > 0 ? featureSums[feature] / total : 0
  }));
};

/**
 * Generate market tiers from data
 * @param data The data to generate tiers from
 * @param scoreColumn The column containing the score
 * @returns Data with tier information added
 */
export const generateMarketTiers = (data: any[], scoreColumn: string): any[] => {
  // Sort data by score
  const sortedData = [...data].sort((a, b) => b[scoreColumn] - a[scoreColumn]);
  
  // Determine number of items per tier (approximately 25% in each)
  const itemsPerTier = Math.ceil(sortedData.length / 4);
  
  // Assign tiers
  return sortedData.map((item, index) => {
    const tierNumber = Math.min(Math.floor(index / itemsPerTier) + 1, 4);
    return {
      ...item,
      [TIER]: `Tier ${tierNumber}`,
      TierRank: (index % itemsPerTier) + 1
    };
  });
};