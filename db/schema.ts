import { pgTable, text, serial, timestamp, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const workOrders = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull(),
  // Contact Information
  requestorName: text("requestor_name").notNull(),
  requestorPhone: text("requestor_phone").notNull(),
  requestorEmail: text("requestor_email").notNull(),
  municipality: text("municipality").notNull(),
  executionContactName: text("execution_contact_name").notNull(),
  executionContactPhone: text("execution_contact_phone").notNull(),
  executionContactEmail: text("execution_contact_email").notNull(),

  // Work Details
  status: text("status").notNull().default("PENDING"),
  actionType: text("action_type").notNull(),
  furnitureType: text("furniture_type").notNull(),
  abriFormat: text("abri_format"),
  objectNumber: text("object_number"),
  desiredDate: date("desired_date").notNull(),
  locationSketch: text("location_sketch"),

  // Removal Location
  removalCity: text("removal_city"),
  removalStreet: text("removal_street"),
  removalPostcode: text("removal_postcode"),

  // Installation Location
  installationCity: text("installation_city"),
  installationXCoord: text("installation_x_coord"),
  installationYCoord: text("installation_y_coord"),
  installationAddress: text("installation_address"),
  installationPostcode: text("installation_postcode"),
  installationStopName: text("installation_stop_name"),

  // Ground Work Removal
  groundRemovalPaving: boolean("ground_removal_paving").default(false),
  groundRemovalExcavation: boolean("ground_removal_excavation").default(false),
  groundRemovalFilling: boolean("ground_removal_filling").default(false),
  groundRemovalRepaving: boolean("ground_removal_repaving").default(false),
  groundRemovalMaterials: boolean("ground_removal_materials").default(false),

  // Ground Work Installation
  groundInstallationExcavation: boolean("ground_installation_excavation").default(false),
  groundInstallationFilling: boolean("ground_installation_filling").default(false),
  groundInstallationRepaving: boolean("ground_installation_repaving").default(false),
  groundInstallationMaterials: boolean("ground_installation_materials").default(false),
  groundInstallationExcessSoilAddress: text("ground_installation_excess_soil_address"),

  // Electrical Work
  electricalDisconnect: boolean("electrical_disconnect").default(false),
  electricalConnect: boolean("electrical_connect").default(false),

  // Billing Information
  billingCity: text("billing_city").notNull(),
  billingAddress: text("billing_address").notNull(),
  billingPostcode: text("billing_postcode").notNull(),
  billingDepartment: text("billing_department"),
  billingAttention: text("billing_attention"),
  billingReference: text("billing_reference"),

  additionalNotes: text("additional_notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workOrderLogs = pgTable("work_order_logs", {
  id: serial("id").primaryKey(),
  workOrderId: serial("work_order_id").references(() => workOrders.id),
  status: text("status").notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const workOrderRelations = relations(workOrders, ({ many }) => ({
  logs: many(workOrderLogs),
}));

const municipalities = [
  "Amsterdam",
  "Rotterdam",
  "Den Haag",
  "Utrecht",
  "Eindhoven",
  "Groningen",
  "Tilburg",
  "Almere",
  "Breda",
  "Nijmegen",
] as const;

// Zod schemas
export const insertWorkOrderSchema = createInsertSchema(workOrders, {
  actionType: z.enum(["verwijderen", "verplaatsen", "ophogen", "plaatsen"]),
  furnitureType: z.enum(["abri", "mupi", "driehoeksbord", "reclamezuil"]),
  municipality: z.enum(municipalities.map(m => m.toLowerCase()) as [string, ...string[]]),
});

export const selectWorkOrderSchema = createSelectSchema(workOrders);

export type InsertWorkOrder = typeof workOrders.$inferInsert;
export type SelectWorkOrder = typeof workOrders.$inferSelect;
export type WorkOrderLog = typeof workOrderLogs.$inferSelect;