import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClientSchema, insertTestSchema, insertMarketSchema, insertMarketPairSchema, insertReportSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - prefix all routes with /api
  
  // Error handler for Zod validation errors
  const handleZodError = (error: unknown) => {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return { message: validationError.message };
    }
    return { message: "An unexpected error occurred" };
  };

  // Client routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve clients" });
    }
  });
  
  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(parseInt(req.params.id));
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve client" });
    }
  });
  
  app.post("/api/clients", async (req, res) => {
    try {
      const validData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      res.status(500).json({ message: "Failed to create client" });
    }
  });

  // Test routes
  app.get("/api/tests", async (req, res) => {
    try {
      const tests = await storage.getAllTests();
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve tests" });
    }
  });
  
  app.get("/api/tests/:id", async (req, res) => {
    try {
      const test = await storage.getTest(parseInt(req.params.id));
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      res.json(test);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve test" });
    }
  });
  
  app.post("/api/tests", async (req, res) => {
    try {
      const validData = insertTestSchema.parse(req.body);
      const test = await storage.createTest(validData);
      res.status(201).json(test);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      res.status(500).json({ message: "Failed to create test" });
    }
  });
  
  app.patch("/api/tests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const test = await storage.getTest(id);
      if (!test) {
        return res.status(404).json({ message: "Test not found" });
      }
      
      // Update the test
      const updatedTest = await storage.updateTest(id, req.body);
      res.json(updatedTest);
    } catch (error) {
      res.status(500).json({ message: "Failed to update test" });
    }
  });

  // Market routes
  app.get("/api/markets", async (req, res) => {
    try {
      const markets = await storage.getAllMarkets();
      res.json(markets);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve markets" });
    }
  });
  
  app.post("/api/markets", async (req, res) => {
    try {
      const validData = insertMarketSchema.parse(req.body);
      const market = await storage.createMarket(validData);
      res.status(201).json(market);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      res.status(500).json({ message: "Failed to create market" });
    }
  });

  // Market Pair routes
  app.get("/api/tests/:testId/market-pairs", async (req, res) => {
    try {
      const testId = parseInt(req.params.testId);
      const marketPairs = await storage.getMarketPairsByTest(testId);
      res.json(marketPairs);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve market pairs" });
    }
  });
  
  app.post("/api/market-pairs", async (req, res) => {
    try {
      const validData = insertMarketPairSchema.parse(req.body);
      const marketPair = await storage.createMarketPair(validData);
      res.status(201).json(marketPair);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      res.status(500).json({ message: "Failed to create market pair" });
    }
  });

  // Report routes
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve reports" });
    }
  });
  
  app.get("/api/tests/:testId/reports", async (req, res) => {
    try {
      const testId = parseInt(req.params.testId);
      const reports = await storage.getReportsByTest(testId);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve reports" });
    }
  });
  
  app.post("/api/reports", async (req, res) => {
    try {
      const validData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(validData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json(handleZodError(error));
      }
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  // Data Analysis Routes
  app.post("/api/analyze-data", async (req, res) => {
    try {
      // This would be a more complex endpoint that would process uploaded data
      // For now, we'll just return a simple response
      res.json({
        message: "Data analysis started",
        status: "processing",
        estimatedCompletionTime: "30 seconds"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to start data analysis" });
    }
  });
  
  app.post("/api/generate-market-pairs", async (req, res) => {
    try {
      // This would be a complex endpoint that would generate market pairs
      // based on uploaded data
      res.json({
        message: "Market pair generation complete",
        pairs: [
          { testMarket: "New York", controlMarket: "Chicago", similarityScore: 0.92 },
          { testMarket: "Los Angeles", controlMarket: "Houston", similarityScore: 0.89 },
          { testMarket: "Miami", controlMarket: "Tampa", similarityScore: 0.95 }
        ]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate market pairs" });
    }
  });
  
  app.post("/api/calculate-incrementality", async (req, res) => {
    try {
      // This would be a complex endpoint that would calculate incrementality
      const testId = req.body.testId;
      res.json({
        testId,
        incrementality: 12.4,
        confidence: 0.95,
        revenueImpact: 245000
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate incrementality" });
    }
  });

  const httpServer = createServer(app);
  
  return httpServer;
}
