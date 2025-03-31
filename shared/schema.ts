import { pgTable, text, serial, integer, boolean, date, timestamp, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  role: true,
});

// Clients table
export const clients = pgTable("clients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry"),
  contactName: text("contact_name"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertClientSchema = createInsertSchema(clients).pick({
  name: true,
  industry: true,
  contactName: true,
  contactEmail: true,
  contactPhone: true,
});

// Markets table
export const markets = pgTable("markets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  type: text("type").notNull(),
  population: integer("population"),
  metrics: jsonb("metrics"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMarketSchema = createInsertSchema(markets).pick({
  name: true,
  code: true,
  type: true,
  population: true,
  metrics: true,
});

// Tests table
export const tests = pgTable("tests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("Draft"),
  clientId: integer("client_id").notNull(),
  startDate: date("start_date"),
  endDate: date("end_date"),
  marketPairs: integer("market_pairs"),
  budget: real("budget"),
  progress: real("progress"),
  incrementality: real("incrementality"),
  keyFindings: text("key_findings"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTestSchema = createInsertSchema(tests).pick({
  name: true,
  status: true,
  clientId: true,
  startDate: true,
  endDate: true,
  marketPairs: true,
  budget: true,
});

// Market Pairs table
export const marketPairs = pgTable("market_pairs", {
  id: serial("id").primaryKey(),
  testId: integer("test_id").notNull(),
  testMarketId: integer("test_market_id").notNull(),
  controlMarketId: integer("control_market_id").notNull(),
  similarityScore: real("similarity_score").notNull(),
  correlationScore: real("correlation_score"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertMarketPairSchema = createInsertSchema(marketPairs).pick({
  testId: true,
  testMarketId: true,
  controlMarketId: true,
  similarityScore: true,
  correlationScore: true,
});

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  testId: integer("test_id").notNull(),
  date: date("date").notNull(),
  type: text("type").notNull(),
  content: jsonb("content"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertReportSchema = createInsertSchema(reports).pick({
  title: true,
  description: true,
  testId: true,
  date: true,
  type: true,
  content: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertMarket = z.infer<typeof insertMarketSchema>;
export type Market = typeof markets.$inferSelect;

export type InsertTest = z.infer<typeof insertTestSchema>;
export type Test = typeof tests.$inferSelect;

export type InsertMarketPair = z.infer<typeof insertMarketPairSchema>;
export type MarketPair = typeof marketPairs.$inferSelect;

export type InsertReport = z.infer<typeof insertReportSchema>;
export type Report = typeof reports.$inferSelect;
