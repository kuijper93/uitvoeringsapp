import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { workOrders } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

export function registerRoutes(app: Express): Server {
  app.get("/api/work-orders", async (_req, res) => {
    const orders = await db.query.workOrders.findMany({
      orderBy: [desc(workOrders.createdAt)],
    });
    res.json(orders);
  });

  app.post("/api/work-orders", async (req, res) => {
    const orderNumber = nanoid(8).toUpperCase();

    const order = await db.insert(workOrders).values({
      ...req.body,
      orderNumber,
      status: "draft",
    }).returning();

    res.json(order[0]);
  });

  app.patch("/api/work-orders/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await db
      .update(workOrders)
      .set({ status })
      .where(eq(workOrders.id, parseInt(id)))
      .returning();

    res.json(order[0]);
  });

  const httpServer = createServer(app);
  return httpServer;
}