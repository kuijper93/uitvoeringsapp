import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { workOrders } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { InsertWorkOrder } from "@db/schema";

export function registerRoutes(app: Express): Server {
  app.get("/api/requests", async (_req, res) => {
    try {
      const requests = await db.query.workOrders.findMany({
        orderBy: [desc(workOrders.createdAt)],
      });
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  app.post("/api/requests", async (req, res) => {
    try {
      const orderNumber = nanoid(8).toUpperCase();
      const data = req.body;

      // Ensure dates are properly formatted
      const now = new Date().toISOString();
      const formattedData = {
        ...data,
        orderNumber,
        status: "PENDING",
        createdAt: now,
        updatedAt: now,
        // Handle desiredDate if present
        desiredDate: data.desiredDate ? new Date(data.desiredDate).toISOString() : null,
      };

      const request = await db.insert(workOrders)
        .values(formattedData)
        .returning();

      res.json(request[0]);
    } catch (error) {
      console.error("Error creating request:", error);
      res.status(500).json({ 
        error: "Failed to create request",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}