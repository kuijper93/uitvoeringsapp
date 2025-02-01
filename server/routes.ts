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
    execution_contact_name: "Peter Bakker",
    execution_contact_phone: "020-5555124",
    execution_contact_email: "p.bakker@amsterdam.nl",
    action_type: "plaatsen",
    furniture_type: "abri",
    street_furniture_type: "abri",
    city: "Amsterdam",
    desired_date: new Date("2025-03-01").toISOString().split('T')[0],
    status: "PENDING",
    terms_accepted: true,
    abri_format: "2.5m breed",
    installation_city: "Amsterdam",
    installation_x_coord: "52.3676",
    installation_y_coord: "4.9041",
    installation_address: "Damrak 1",
    installation_postcode: "1012LG",
    installation_stop_name: "Centraal Station",
    ground_installation_excavation: true,
    ground_installation_filling: true,
    ground_installation_repaving: true,
    ground_installation_materials: true,
    electrical_connect: true,
    billing_city: "Amsterdam",
    billing_address: "Damrak 1",
    billing_postcode: "1012LG",
    billing_department: "Stadsbeheer",
    billing_attention: "Dhr. J. Janssen",
    billing_reference: "AMS-2025-001",
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
    execution_contact_name: "Kees Visser",
    execution_contact_phone: "010-5555124",
    execution_contact_email: "k.visser@rotterdam.nl",
    action_type: "verplaatsen",
    furniture_type: "mupi",
    street_furniture_type: "mupi",
    city: "Rotterdam",
    desired_date: new Date("2025-03-15").toISOString().split('T')[0],
    status: "PENDING",
    terms_accepted: true,
    object_number: "ROT-789",
    removal_city: "Rotterdam",
    removal_street: "Coolsingel 40",
    removal_postcode: "3011AD",
    installation_city: "Rotterdam",
    installation_x_coord: "51.9225",
    installation_y_coord: "4.4792",
    installation_address: "Blaak 31",
    installation_postcode: "3011GA",
    ground_removal_paving: true,
    ground_removal_excavation: true,
    ground_removal_filling: true,
    ground_removal_repaving: true,
    ground_removal_materials: true,
    ground_installation_excavation: true,
    ground_installation_filling: true,
    ground_installation_repaving: true,
    ground_installation_materials: true,
    electrical_disconnect: true,
    electrical_connect: true,
    billing_city: "Rotterdam",
    billing_address: "Coolsingel 40",
    billing_postcode: "3011AD",
    billing_department: "Stadsontwikkeling",
    billing_attention: "Mevr. K. de Groot",
    billing_reference: "ROT-2025-002",
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
    execution_contact_name: "Thomas Berg",
    execution_contact_phone: "030-5555124",
    execution_contact_email: "t.berg@utrecht.nl",
    action_type: "verwijderen",
    furniture_type: "driehoeksbord",
    street_furniture_type: "driehoeksbord",
    city: "Utrecht",
    desired_date: new Date("2025-03-10").toISOString().split('T')[0],
    status: "PENDING",
    terms_accepted: true,
    object_number: "UTR-123",
    removal_city: "Utrecht",
    removal_street: "Oudegracht 50",
    removal_postcode: "3511AR",
    ground_removal_paving: true,
    ground_removal_excavation: true,
    ground_removal_filling: true,
    ground_removal_repaving: true,
    ground_removal_materials: true,
    electrical_disconnect: true,
    billing_city: "Utrecht",
    billing_address: "Oudegracht 50",
    billing_postcode: "3511AR",
    billing_department: "Stadsbeheer",
    billing_attention: "Dhr. P. van der Meer",
    billing_reference: "UTR-2025-003",
    additional_notes: "Verwijdering i.v.m. einde contract"
  }
];

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
        const request = await db.insert(workOrders).values({
          ...data,
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