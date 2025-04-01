// Constants for market tier analysis
export const TIER = "KPI Tier";
export const FEATURE = "Feature";
export const WEIGHT = "Weight";
export const SCORE = "Score";

// Market levels
export const MARKET_LEVELS = ["DMA", "State", "ZipCode", "Other"];

// Date frequencies
export const DATE_FREQUENCIES = ["Daily", "Weekly", "Monthly"];

// Feature categories for tier analysis
export const DEMOGRAPHIC_FEATURES = [
  "Broadband Any Source",
  "In Labor Force",
  "Total Bachelors Or Higher",
  "Owner Occupied",
  "Population",
  "GDP",
  "Total Spanish"
];

// Color mapping for charts
export const COLOR_MAPPING = {
  'Control Markets': 'blue',
  'Test Markets': 'red',
  'Tier 1': '#f44336',
  'Tier 2': '#ff9800',
  'Tier 3': '#2196f3',
  'Tier 4': '#4caf50',
};