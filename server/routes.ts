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
    execution_contact: "Peter Bakker",
    execution_phone: "020-5555124",
    execution_email: "p.bakker@amsterdam.nl",
    action_type: "plaatsen",
    furniture_type: "abri",
    street_furniture_type: "abri",
    city: "Amsterdam",
    desired_date: new Date("2025-03-01").toISOString().split('T')[0],
    status: "PENDING",
    terms_accepted: true,
    additional_notes: "Nieuwe abri voor drukke OV-locatie"
  },
  {
    requestorName: "Marie Jansen",
    requestorPhone: "010-5555123",
    requestorEmail: "m.jansen@rotterdam.nl",
    municipality: "rotterdam",
    execution_contact: "Kees Visser",
    execution_phone: "010-5555124",
    execution_email: "k.visser@rotterdam.nl",
    action_type: "verplaatsen",
    furniture_type: "mupi",
    street_furniture_type: "mupi",
    city: "Rotterdam",
    desired_date: new Date("2025-03-15").toISOString().split('T')[0],
    status: "PENDING",
    terms_accepted: true,
    additional_notes: "Verplaatsing i.v.m. herinrichting plein"
  },
  {
    requestorName: "Sophie van Dijk",
    requestorPhone: "030-5555123",
    requestorEmail: "s.vandijk@utrecht.nl",
    municipality: "utrecht",
    execution_contact: "Thomas Berg",
    execution_phone: "030-5555124",
    execution_email: "t.berg@utrecht.nl",
    action_type: "verwijderen",
    furniture_type: "driehoeksbord",
    street_furniture_type: "driehoeksbord",
    city: "Utrecht",
    desired_date: new Date("2025-03-10").toISOString().split('T')[0],
    status: "PENDING",
    terms_accepted: true,
    additional_notes: "Verwijdering i.v.m. einde contract"
  }
];

// Transform data to match exact schema requirements
function transformWorkOrderData(data: Partial<InsertWorkOrder>): Partial<InsertWorkOrder> {
  // Only include fields that exist in the schema
  const {
    requestorName,
    requestorPhone,
    requestorEmail,
    municipality,
    execution_contact,
    execution_phone,
    execution_email,
    action_type,
    furniture_type,
    street_furniture_type,
    city,
    desired_date,
    status,
    terms_accepted,
    additional_notes
  } = data;

  return {
    requestorName,
    requestorPhone,
    requestorEmail,
    municipality,
    execution_contact,
    execution_phone,
    execution_email,
    action_type,
    furniture_type,
    street_furniture_type,
    city,
    desired_date,
    status,
    terms_accepted,
    additional_notes
  };
}

export function registerRoutes(app: Express): Server {
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

  app.post("/api/populate-dummy-data", async (_req, res) => {
    try {
      const insertedData = [];
      for (const data of dummyData) {
        const orderNumber = nanoid(8).toUpperCase();
        const transformedData = transformWorkOrderData(data);

        const request = await db.insert(workOrders).values({
          ...transformedData,
          orderNumber,
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