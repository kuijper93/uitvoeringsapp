import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { workOrders } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { InsertWorkOrder } from "@db/schema";

const dummyData: Partial<InsertWorkOrder>[] = [
  {
    municipality: "amsterdam",
    requestorName: "Jan de Vries",
    requestorPhone: "020-5555123",
    requestorEmail: "j.devries@amsterdam.nl",
    executionContactName: "Peter Bakker",
    executionContactPhone: "020-5555124",
    executionContactEmail: "p.bakker@amsterdam.nl",
    actionType: "plaatsen",
    furnitureType: "abri",
    abriFormat: "2.5m breed",
    desiredDate: new Date("2025-03-01"),
    installationCity: "Amsterdam",
    installationAddress: "Damrak 1",
    installationPostcode: "1012LG",
    installationStopName: "Centraal Station",
  },
  {
    municipality: "rotterdam",
    requestorName: "Marie Jansen",
    requestorPhone: "010-5555123",
    requestorEmail: "m.jansen@rotterdam.nl",
    executionContactName: "Kees Visser",
    executionContactPhone: "010-5555124",
    executionContactEmail: "k.visser@rotterdam.nl",
    actionType: "verplaatsen",
    furnitureType: "mupi",
    desiredDate: new Date("2025-03-15"),
    removalCity: "Rotterdam",
    removalStreet: "Coolsingel 40",
    removalPostcode: "3011AD",
    installationCity: "Rotterdam",
    installationAddress: "Blaak 31",
    installationPostcode: "3011GA",
  },
  {
    municipality: "utrecht",
    requestorName: "Sophie van Dijk",
    requestorPhone: "030-5555123",
    requestorEmail: "s.vandijk@utrecht.nl",
    executionContactName: "Thomas Berg",
    executionContactPhone: "030-5555124",
    executionContactEmail: "t.berg@utrecht.nl",
    actionType: "verwijderen",
    furnitureType: "driehoeksbord",
    objectNumber: "UTR-123",
    desiredDate: new Date("2025-03-10"),
    removalCity: "Utrecht",
    removalStreet: "Oudegracht 50",
    removalPostcode: "3511AR",
  }
];

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
      status: "PENDING",
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
      status: "PENDING",
    }).returning();

    res.json(request[0]);
  });

  // Endpoint to populate dummy data
  app.post("/api/populate-dummy-data", async (_req, res) => {
    try {
      const insertedData = [];
      for (const data of dummyData) {
        const orderNumber = nanoid(8).toUpperCase();
        const request = await db.insert(workOrders).values({
          ...(data as InsertWorkOrder),
          orderNumber,
          status: "PENDING",
          billingCity: data.municipality?.charAt(0).toUpperCase() + data.municipality?.slice(1) || "",
          billingAddress: data.installationAddress || data.removalStreet || "",
          billingPostcode: data.installationPostcode || data.removalPostcode || "",
        }).returning();
        insertedData.push(request[0]);
      }
      res.json({ message: "Dummy data inserted successfully", data: insertedData });
    } catch (error) {
      console.error("Error inserting dummy data:", error);
      res.status(500).json({ error: "Failed to insert dummy data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}