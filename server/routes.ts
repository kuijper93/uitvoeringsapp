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
    const data = req.body;

    const order = await db.insert(workOrders).values({
      ...data,
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

  app.get("/api/requests", async (_req, res) => {
    const requests = await db.query.workOrders.findMany({
      where: eq(workOrders.type, "request"),
      orderBy: [desc(workOrders.createdAt)],
    });
    res.json(requests);
  });

  app.post("/api/requests", async (req, res) => {
    const orderNumber = nanoid(8).toUpperCase();
    const data = req.body;

    const request = await db.insert(workOrders).values({
      ...data,
      orderNumber,
      type: "request",
      status: "draft",
      // Ensure all required fields are present
      currentAddress: data.currentAddress || {
        street: "",
        number: "",
        postcode: "",
        city: "",
        coordinates: { x: "", y: "" },
      },
      streetwork: data.streetwork || {
        required: false,
        vrijgraven: false,
        aanvullen: false,
        herstraten: false,
        materiaalLevering: false,
      },
      electricity: data.electricity || {
        required: false,
        afkoppelen: false,
        aansluiten: false,
      },
      billing: data.billing || {},
    }).returning();

    res.json(request[0]);
  });

  const httpServer = createServer(app);
  return httpServer;
}