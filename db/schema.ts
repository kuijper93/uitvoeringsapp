import { pgTable, text, serial, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const workOrders = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull(),

  // Contact (rows 1-7)
  requestorName: text("requestor_name").notNull(),
  requestorPhone: text("requestor_phone").notNull(),
  requestorEmail: text("requestor_email").notNull(),
  municipality: text("municipality").notNull(),
  executionContact: text("execution_contact").notNull(),
  executionPhone: text("execution_phone").notNull(),
  executionEmail: text("execution_email").notNull(),

  // Gegevens werkzaamheden (rows 8-17)
  abriFormat: text("abri_format"),
  streetFurnitureType: text("street_furniture_type").notNull(),
  actionType: text("action_type").notNull(),
  objectNumber: text("object_number"),
  city: text("city").notNull(),
  desiredDate: timestamp("desired_date").notNull(),
  additionalNotes: text("additional_notes"),
  locationSketch: jsonb("location_sketch"),

  // Verwijderen / verplaatsen (rows 19-21)
  currentLocation: jsonb("current_location").notNull(),

  // Plaatsen / verplaatsen (rows 22-26)
  newLocation: jsonb("new_location"),

  // Infrastructure (rows 29-40)
  jcdecaux: jsonb("jcdecaux").notNull(),

  // Elektra (rows 42-44)
  electrical: jsonb("electrical").notNull(),

  // Kosten (rows 46-53)
  billing: jsonb("billing").notNull(),

  // Additional fields
  status: text("status").notNull().default("draft"),
  termsAccepted: boolean("terms_accepted").notNull().default(false),
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

export const insertWorkOrderSchema = createInsertSchema(workOrders);
export const selectWorkOrderSchema = createSelectSchema(workOrders);

export type InsertWorkOrder = typeof workOrders.$inferInsert;
export type SelectWorkOrder = typeof workOrders.$inferSelect;
export type WorkOrderLog = typeof workOrderLogs.$inferSelect;