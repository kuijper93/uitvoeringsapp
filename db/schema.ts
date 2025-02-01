import { pgTable, text, serial, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Location schema for validation
const locationSchema = z.object({
  street: z.string(),
  postcode: z.string(),
  halteName: z.string().optional(),
  coordinates: z.object({
    x: z.string(),
    y: z.string()
  }).optional()
});

// Infrastructure work schema
const infrastructureSchema = z.object({
  roadwork: z.object({
    removeExisting: z.boolean(),
    excavate: z.boolean(),
    fill: z.boolean(),
    repave: z.boolean(),
    provideMaterials: z.boolean()
  }),
  newLocation: z.object({
    excavateCunet: z.boolean(),
    fill: z.boolean(),
    repave: z.boolean(),
    provideMaterials: z.boolean()
  }),
  surplusSoilAddress: z.string().optional()
});

// Electrical work schema
const electricalSchema = z.object({
  jcdecauxRequest: z.boolean(),
  disconnect: z.boolean(),
  connect: z.boolean()
});

// Billing information schema
const billingSchema = z.object({
  municipality: z.string().optional(),
  postcode: z.string(),
  city: z.string(),
  poBox: z.string(),
  department: z.string(),
  attention: z.string(),
  reference: z.string()
});

export const workOrders = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull(),

  // Contact information (rows 1-7)
  requestorName: text("requestor_name").notNull(),
  requestorPhone: text("requestor_phone").notNull(),
  requestorEmail: text("requestor_email").notNull(),
  municipality: text("municipality").notNull(),
  executionContact: text("execution_contact").notNull(),
  executionPhone: text("execution_phone").notNull(),
  executionEmail: text("execution_email").notNull(),

  // Work details (rows 8-17)
  abriFormat: text("abri_format"),
  streetFurnitureType: text("street_furniture_type").notNull(),
  actionType: text("action_type").notNull(), // Verwijderen / Verplaatsen / Ophogen / Plaatsen
  objectNumber: text("object_number"),
  city: text("city").notNull(),
  desiredDate: date("desired_date").notNull(),
  additionalNotes: text("additional_notes"),
  locationSketch: jsonb("location_sketch"), // For PDF and AutoCAD files

  // Location information (conditional based on action type)
  currentLocation: jsonb("current_location").$type<z.infer<typeof locationSchema>>(),
  newLocation: jsonb("new_location").$type<z.infer<typeof locationSchema>>(),

  // Infrastructure work
  infrastructure: jsonb("infrastructure").$type<z.infer<typeof infrastructureSchema>>().notNull(),

  // Electrical work
  electrical: jsonb("electrical").$type<z.infer<typeof electricalSchema>>().notNull(),

  // Billing information
  billing: jsonb("billing").$type<z.infer<typeof billingSchema>>().notNull(),

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

// Create base schema
const baseWorkOrderSchema = createInsertSchema(workOrders);

// Custom validation schema with conditional fields based on action type
export const insertWorkOrderSchema = baseWorkOrderSchema.extend({
  actionType: z.enum(["Verwijderen", "Verplaatsen", "Ophogen", "Plaatsen"]),
  currentLocation: locationSchema.optional().refine(
    (data, ctx) => {
      const actionType = ctx.path[0] as string;
      if (["Verwijderen", "Verplaatsen"].includes(actionType) && !data) {
        return false;
      }
      return true;
    },
    { message: "Current location is required for removal and relocation" }
  ),
  newLocation: locationSchema.optional().refine(
    (data, ctx) => {
      const actionType = ctx.path[0] as string;
      if (["Plaatsen", "Verplaatsen"].includes(actionType) && !data) {
        return false;
      }
      return true;
    },
    { message: "New location is required for placement and relocation" }
  ),
});

export const selectWorkOrderSchema = createSelectSchema(workOrders);

export type InsertWorkOrder = typeof workOrders.$inferInsert;
export type SelectWorkOrder = typeof workOrders.$inferSelect;
export type WorkOrderLog = typeof workOrderLogs.$inferSelect;