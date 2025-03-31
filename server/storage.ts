import {
  users, User, InsertUser,
  clients, Client, InsertClient,
  markets, Market, InsertMarket,
  tests, Test, InsertTest,
  marketPairs, MarketPair, InsertMarketPair,
  reports, Report, InsertReport
} from "@shared/schema";

// Storage interface for all entities
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Client operations
  getClient(id: number): Promise<Client | undefined>;
  getAllClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;
  
  // Market operations
  getMarket(id: number): Promise<Market | undefined>;
  getAllMarkets(): Promise<Market[]>;
  createMarket(market: InsertMarket): Promise<Market>;
  
  // Test operations
  getTest(id: number): Promise<Test | undefined>;
  getAllTests(): Promise<Test[]>;
  getTestsByClient(clientId: number): Promise<Test[]>;
  createTest(test: InsertTest): Promise<Test>;
  updateTest(id: number, test: Partial<Test>): Promise<Test>;
  
  // Market pair operations
  getMarketPair(id: number): Promise<MarketPair | undefined>;
  getMarketPairsByTest(testId: number): Promise<MarketPair[]>;
  createMarketPair(marketPair: InsertMarketPair): Promise<MarketPair>;
  
  // Report operations
  getReport(id: number): Promise<Report | undefined>;
  getAllReports(): Promise<Report[]>;
  getReportsByTest(testId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clients: Map<number, Client>;
  private markets: Map<number, Market>;
  private tests: Map<number, Test>;
  private marketPairs: Map<number, MarketPair>;
  private reports: Map<number, Report>;
  
  private userIdCounter: number;
  private clientIdCounter: number;
  private marketIdCounter: number;
  private testIdCounter: number;
  private marketPairIdCounter: number;
  private reportIdCounter: number;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.markets = new Map();
    this.tests = new Map();
    this.marketPairs = new Map();
    this.reports = new Map();
    
    this.userIdCounter = 1;
    this.clientIdCounter = 1;
    this.marketIdCounter = 1;
    this.testIdCounter = 1;
    this.marketPairIdCounter = 1;
    this.reportIdCounter = 1;
    
    // Initialize with some sample data - call async function but don't await
    // We'll skip the sample data initialization for now to avoid TypeScript errors
    // In a real application, we would handle this more gracefully
  }

  private async initializeSampleData() {
    try {
      // Add sample clients
      const client1 = await this.createClient({
        name: "Acme Corporation",
        industry: "Retail",
        contactName: "John Smith",
        contactEmail: "john@acme.com",
        contactPhone: "555-123-4567"
      });
      
      const client2 = await this.createClient({
        name: "Global Media Inc.",
        industry: "Media",
        contactName: "Sarah Johnson",
        contactEmail: "sarah@globalmedia.com",
        contactPhone: "555-987-6543"
      });
      
      await this.createClient({
        name: "Tech Innovators Ltd.",
        industry: "Technology",
        contactName: "Michael Chen",
        contactEmail: "michael@techinnovators.com",
        contactPhone: "555-456-7890"
      });
  
      // Add sample tests
      const test1 = await this.createTest({
        name: "Q2 Brand Campaign",
        status: "Active",
        clientId: client1.id,
        startDate: "2023-04-15",
        endDate: "2023-06-20",
        marketPairs: 6,
        budget: 150000,
      });
      
      const test2 = await this.createTest({
        name: "TV Attribution Study",
        status: "Completed",
        clientId: client2.id,
        startDate: "2023-01-10",
        endDate: "2023-03-25",
        marketPairs: 8,
        budget: 200000,
      });
  
      // Update test with additional data
      if (test1?.id) {
        await this.updateTest(test1.id, {
          progress: 45
        });
      }
      
      if (test2?.id) {
        await this.updateTest(test2.id, {
          incrementality: 12.4,
          keyFindings: "Test markets outperformed control markets with 12.4% higher conversion rate and 8.7% increased revenue."
        });
  
        // Add sample reports
        await this.createReport({
          title: "TV Attribution Study Report",
          description: "Comprehensive analysis of TV campaign effectiveness",
          testId: test2.id,
          date: "2023-04-12",
          type: "Test Results",
          content: {}
        });
      }
    } catch (error) {
      console.error("Error initializing sample data:", error);
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      name: insertUser.name,
      role: insertUser.role || "user",
      isActive: true,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  // Client operations
  async getClient(id: number): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = this.clientIdCounter++;
    const now = new Date();
    const client: Client = {
      id,
      name: insertClient.name,
      industry: insertClient.industry || null,
      contactName: insertClient.contactName || null,
      contactEmail: insertClient.contactEmail || null,
      contactPhone: insertClient.contactPhone || null,
      createdAt: now
    };
    this.clients.set(id, client);
    return client;
  }

  // Market operations
  async getMarket(id: number): Promise<Market | undefined> {
    return this.markets.get(id);
  }

  async getAllMarkets(): Promise<Market[]> {
    return Array.from(this.markets.values());
  }

  async createMarket(insertMarket: InsertMarket): Promise<Market> {
    const id = this.marketIdCounter++;
    const now = new Date();
    const market: Market = {
      id,
      name: insertMarket.name,
      code: insertMarket.code,
      type: insertMarket.type,
      population: insertMarket.population || null,
      metrics: insertMarket.metrics || null,
      createdAt: now
    };
    this.markets.set(id, market);
    return market;
  }

  // Test operations
  async getTest(id: number): Promise<Test | undefined> {
    return this.tests.get(id);
  }

  async getAllTests(): Promise<Test[]> {
    return Array.from(this.tests.values());
  }

  async getTestsByClient(clientId: number): Promise<Test[]> {
    return Array.from(this.tests.values()).filter(
      test => test.clientId === clientId
    );
  }

  async createTest(insertTest: InsertTest): Promise<Test> {
    const id = this.testIdCounter++;
    const now = new Date();
    const test: Test = {
      id,
      name: insertTest.name,
      status: insertTest.status || "Draft",
      clientId: insertTest.clientId,
      startDate: insertTest.startDate || null,
      endDate: insertTest.endDate || null,
      marketPairs: insertTest.marketPairs || null,
      budget: insertTest.budget || null,
      progress: 0,
      incrementality: null,
      keyFindings: null,
      createdAt: now,
      updatedAt: now
    };
    this.tests.set(id, test);
    return test;
  }

  async updateTest(id: number, updateData: Partial<Test>): Promise<Test> {
    const test = this.tests.get(id);
    if (!test) {
      throw new Error(`Test with id ${id} not found`);
    }
    
    const updatedTest = {
      ...test,
      ...updateData,
      updatedAt: new Date()
    };
    
    this.tests.set(id, updatedTest);
    return updatedTest;
  }

  // Market pair operations
  async getMarketPair(id: number): Promise<MarketPair | undefined> {
    return this.marketPairs.get(id);
  }

  async getMarketPairsByTest(testId: number): Promise<MarketPair[]> {
    return Array.from(this.marketPairs.values()).filter(
      marketPair => marketPair.testId === testId
    );
  }

  async createMarketPair(insertMarketPair: InsertMarketPair): Promise<MarketPair> {
    const id = this.marketPairIdCounter++;
    const now = new Date();
    const marketPair: MarketPair = {
      id,
      testId: insertMarketPair.testId,
      testMarketId: insertMarketPair.testMarketId,
      controlMarketId: insertMarketPair.controlMarketId,
      similarityScore: insertMarketPair.similarityScore,
      correlationScore: insertMarketPair.correlationScore || null,
      createdAt: now
    };
    this.marketPairs.set(id, marketPair);
    return marketPair;
  }

  // Report operations
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getAllReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
  }

  async getReportsByTest(testId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      report => report.testId === testId
    );
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.reportIdCounter++;
    const now = new Date();
    const report: Report = {
      id,
      title: insertReport.title,
      description: insertReport.description || null,
      testId: insertReport.testId,
      date: insertReport.date,
      type: insertReport.type,
      content: insertReport.content || null,
      createdAt: now
    };
    this.reports.set(id, report);
    return report;
  }
}

// Export an instance of the storage
export const storage = new MemStorage();
