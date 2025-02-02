import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { workOrders } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { InsertWorkOrder } from "@db/schema";

const dummyData: Partial<InsertWorkOrder>[] = [
  {
    requestorName: "Jan de Vries",
    requestorPhone: "020-5555123",
    requestorEmail: "j.devries@amsterdam.nl",
    municipality: "amsterdam",
    executionContactName: "Peter Bakker",
    executionContactPhone: "020-5555124",
    executionContactEmail: "p.bakker@amsterdam.nl",
    actionType: "plaatsen",
    furnitureType: "abri",
    city: "Amsterdam",
    desiredDate: new Date("2025-03-01").toISOString().split('T')[0],
    status: "PENDING",
    termsAccepted: true,
    abriFormat: "2.5m breed",
    installationCity: "Amsterdam",
    installationXCoord: "52.3676",
    installationYCoord: "4.9041",
    installationAddress: "Damrak 1",
    installationPostcode: "1012LG",
    installationStopName: "Centraal Station",
    groundInstallationExcavation: true,
    groundInstallationFilling: true,
    groundInstallationRepaving: true,
    groundInstallationMaterials: true,
    electricalConnect: true,
    billingCity: "Amsterdam",
    billingAddress: "Damrak 1",
    billingPostcode: "1012LG",
    billingDepartment: "Stadsbeheer",
    billingAttention: "Dhr. J. Janssen",
    billingReference: "AMS-2025-001",
    additionalNotes: "Nieuwe abri voor drukke OV-locatie"
  },
  {
    requestorName: "Marie Jansen",
    requestorPhone: "010-5555123",
    requestorEmail: "m.jansen@rotterdam.nl",
    municipality: "rotterdam",
    executionContactName: "Kees Visser",
    executionContactPhone: "010-5555124",
    executionContactEmail: "k.visser@rotterdam.nl",
    actionType: "verplaatsen",
    furnitureType: "mupi",
    city: "Rotterdam",
    desiredDate: new Date("2025-03-15").toISOString().split('T')[0],
    status: "PENDING",
    termsAccepted: true,
    objectNumber: "ROT-789",
    removalCity: "Rotterdam",
    removalStreet: "Coolsingel 40",
    removalPostcode: "3011AD",
    installationCity: "Rotterdam",
    installationXCoord: "51.9225",
    installationYCoord: "4.4792",
    installationAddress: "Blaak 31",
    installationPostcode: "3011GA",
    groundRemovalPaving: true,
    groundRemovalExcavation: true,
    groundRemovalFilling: true,
    groundRemovalRepaving: true,
    groundRemovalMaterials: true,
    groundInstallationExcavation: true,
    groundInstallationFilling: true,
    groundInstallationRepaving: true,
    groundInstallationMaterials: true,
    electricalDisconnect: true,
    electricalConnect: true,
    billingCity: "Rotterdam",
    billingAddress: "Coolsingel 40",
    billingPostcode: "3011AD",
    billingDepartment: "Stadsontwikkeling",
    billingAttention: "Mevr. K. de Groot",
    billingReference: "ROT-2025-002",
    additionalNotes: "Verplaatsing i.v.m. herinrichting plein"
  },
  {
    requestorName: "Sophie van Dijk",
    requestorPhone: "030-5555123",
    requestorEmail: "s.vandijk@utrecht.nl",
    municipality: "utrecht",
    executionContactName: "Thomas Berg",
    executionContactPhone: "030-5555124",
    executionContactEmail: "t.berg@utrecht.nl",
    actionType: "verwijderen",
    furnitureType: "driehoeksbord",
    city: "Utrecht",
    desiredDate: new Date("2025-03-10").toISOString().split('T')[0],
    status: "PENDING",
    termsAccepted: true,
    objectNumber: "UTR-123",
    removalCity: "Utrecht",
    removalStreet: "Oudegracht 50",
    removalPostcode: "3511AR",
    groundRemovalPaving: true,
    groundRemovalExcavation: true,
    groundRemovalFilling: true,
    groundRemovalRepaving: true,
    groundRemovalMaterials: true,
    electricalDisconnect: true,
    billingCity: "Utrecht",
    billingAddress: "Oudegracht 50",
    billingPostcode: "3511AR",
    billingDepartment: "Stadsbeheer",
    billingAttention: "Dhr. P. van der Meer",
    billingReference: "UTR-2025-003",
    additionalNotes: "Verwijdering i.v.m. einde contract"
  }
];

export function registerRoutes(app: Express): Server {
  app.get("/api/requests", async (_req, res) => {
    try {
      const requests = await db.query.workOrders.findMany({
        orderBy: [desc(workOrders.createdAt)],
      });
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.post("/api/requests", async (req, res) => {
    try {
      const orderNumber = nanoid(8).toUpperCase();
      const data = {
        ...req.body,
        orderNumber,
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const request = await db.insert(workOrders).values(data).returning();
      res.json(request[0]);
    } catch (error) {
      console.error("Error creating request:", error);
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  app.post("/api/populate-dummy-data", async (_req, res) => {
    try {
      const insertedData = [];
      for (const data of dummyData) {
        const orderNumber = nanoid(8).toUpperCase();
        const request = await db.insert(workOrders).values({
          ...data,
          orderNumber,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();
        insertedData.push(request[0]);
      }
      res.json({ message: "Dummy data inserted successfully", data: insertedData });
    } catch (error) {
      console.error("Error inserting dummy data:", error);
      res.status(500).json({ message: "Failed to insert dummy data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}