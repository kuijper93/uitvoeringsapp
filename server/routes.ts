import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { workOrders } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

// Dummy data generator function
async function seedDummyData() {
  const dummyRequests = [
    {
      requestorName: "Jan de Vries",
      requestorPhone: "0612345678",
      requestorEmail: "jan.devries@gemeente.nl",
      municipality: "amsterdam",
      executionContactName: "Peter Bakker",
      executionContactPhone: "0687654321",
      executionContactEmail: "p.bakker@uitvoering.nl",
      actionType: "plaatsen",
      furnitureType: "abri",
      abriFormat: "4x1.5m",
      desiredDate: "2025-03-15",
      locationSketch: "https://example.com/sketch1.pdf",
      installationCity: "Amsterdam",
      installationAddress: "Damrak 1",
      installationPostcode: "1012LG",
      installationStopName: "Centraal Station",
      groundInstallationExcavation: true,
      groundInstallationFilling: true,
      groundInstallationRepaving: true,
      electricalConnect: true,
      billingCity: "Amsterdam",
      billingAddress: "Amstel 1",
      billingPostcode: "1011PN",
      billingDepartment: "Infrastructuur",
      status: "PENDING",
    },
    {
      requestorName: "Emma van Dijk",
      requestorPhone: "0623456789",
      requestorEmail: "e.vandijk@gemeente.nl",
      municipality: "rotterdam",
      executionContactName: "Mark Jansen",
      executionContactPhone: "0698765432",
      executionContactEmail: "m.jansen@uitvoering.nl",
      actionType: "verwijderen",
      furnitureType: "mupi",
      objectNumber: "MUP-RTD-001",
      desiredDate: "2025-02-20",
      removalCity: "Rotterdam",
      removalStreet: "Coolsingel 40",
      removalPostcode: "3011AD",
      groundRemovalPaving: true,
      groundRemovalFilling: true,
      electricalDisconnect: true,
      billingCity: "Rotterdam",
      billingAddress: "Coolsingel 40",
      billingPostcode: "3011AD",
      billingReference: "REF-2025-001",
      status: "IN_PROGRESS",
    },
    {
      requestorName: "Lucas de Groot",
      requestorPhone: "0634567890",
      requestorEmail: "l.degroot@gemeente.nl",
      municipality: "utrecht",
      executionContactName: "Sophie Visser",
      executionContactPhone: "0609876543",
      executionContactEmail: "s.visser@uitvoering.nl",
      actionType: "verplaatsen",
      furnitureType: "driehoeksbord",
      objectNumber: "DBD-UTR-003",
      desiredDate: "2025-04-01",
      locationSketch: "https://example.com/sketch2.pdf",
      removalCity: "Utrecht",
      removalStreet: "Oudegracht 50",
      removalPostcode: "3511AR",
      installationCity: "Utrecht",
      installationAddress: "Vredenburg 40",
      installationPostcode: "3511BB",
      groundRemovalPaving: true,
      groundInstallationRepaving: true,
      electricalDisconnect: true,
      electricalConnect: true,
      billingCity: "Utrecht",
      billingAddress: "Stadsplateau 1",
      billingPostcode: "3521AZ",
      billingDepartment: "Stadsontwikkeling",
      status: "SUBMITTED",
    }
  ];

  for (const request of dummyRequests) {
    await db.insert(workOrders).values({
      ...request,
      orderNumber: nanoid(8).toUpperCase(),
    });
  }
}

export function registerRoutes(app: Express): Server {
  app.get("/api/requests", async (_req, res) => {
    const requests = await db.query.workOrders.findMany({
      orderBy: [desc(workOrders.createdAt)],
    });
    res.json(requests);
  });

  // Alias /api/work-orders to /api/requests for backward compatibility
  app.get("/api/work-orders", async (_req, res) => {
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

  // Development only: Endpoint to seed dummy data
  if (process.env.NODE_ENV !== 'production') {
    app.post("/api/seed-dummy-data", async (_req, res) => {
      try {
        await seedDummyData();
        res.json({ message: "Dummy data seeded successfully" });
      } catch (error) {
        console.error("Error seeding dummy data:", error);
        res.status(500).json({ error: "Failed to seed dummy data" });
      }
    });
  }

  const httpServer = createServer(app);
  return httpServer;
}