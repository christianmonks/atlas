// Test Status Types
export type TestStatus = "Active" | "Completed" | "Pending" | "Draft";

// Test Data Types
export interface Test {
  id: string;
  name: string;
  status: TestStatus;
  client: string;
  startDate: string;
  endDate: string;
  marketPairs: number;
  budget?: number;
  progress?: number;
  incrementality?: number;
  keyFindings?: string;
}

// Market Types
export interface Market {
  id: string;
  name: string;
  code: string;
  type: "DMA" | "State" | "ZipCode" | "Other";
  population?: number;
  metrics?: MarketMetrics;
}

export interface MarketMetrics {
  salesVolume?: number;
  conversionRate?: number;
  customerValue?: number;
  [key: string]: number | undefined;
}

export interface MarketPair {
  id: string;
  testMarketId: string;
  controlMarketId: string;
  similarityScore: number;
  correlationScore: number;
}

// Client Types
export interface Client {
  id: string;
  name: string;
  industry: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
}

// Chart Data Types
export interface BarChartData {
  name: string;
  value: number;
}

export interface LineChartData {
  date: string;
  test: number;
  control: number;
}

// Upload Types
export interface UploadData {
  testName: string;
  client: string;
  geoLevel: "DMA" | "State" | "ZipCode" | "Other";
  dateFrequency: "Daily" | "Weekly" | "Monthly";
  file: File | null;
}

// Report Types
export interface Report {
  id: string;
  title: string;
  description: string;
  date: string;
  client: string;
  type: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  role: "admin" | "user" | "viewer";
  isActive: boolean;
}
