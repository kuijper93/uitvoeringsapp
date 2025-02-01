import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const workOrders = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull(),

  // Contact Information (CSV rows 1-7)
  requestorName: text("requestor_name").notNull(),
  requestorPhone: text("requestor_phone").notNull(),
  requestorEmail: text("requestor_email").notNull(),
  municipality: text("municipality").notNull(),
  executionContact: text("execution_contact").notNull(),
  executionPhone: text("execution_phone").notNull(),
  executionEmail: text("execution_email").notNull(),

  // Work Details (CSV rows 8-16)
  type: text("type").notNull(), // 'work_order' or 'request'
  requestType: text("request_type").notNull(), // verwijderen, verplaatsen, etc.
  objectType: text("object_type").notNull(), // Abri, Mupi, etc.
  objectNumber: text("object_number"),
  objectFormat: text("object_format"), // For Amsterdam specific
  city: text("city").notNull(),
  status: text("status").notNull().default("draft"),
  desiredDate: timestamp("desired_date").notNull(),

  // Location Information (CSV rows 19-26)
  currentLocation: jsonb("current_location").notNull(), // {
    // street: string,
    // postcode: string,
    // city: string,
    // coordinates: { x: string, y: string },
    // halteName: string,
    // remarks: string
  // }

  newLocation: jsonb("new_location"), // Same structure as currentLocation

  // Street Work (CSV rows 30-40)
  streetwork: jsonb("streetwork").notNull(), // {
    // jcdecauxExecution: boolean,
    // required: boolean,
    // vrijgraven: boolean,
    // aanvullen: boolean,
    // herstraten: boolean,
    // materiaalLevering: boolean,
    // cunetGraven: boolean,
    // overtolligeGrondAdres: string,
    // remarks: string
  // }

  // Electrical Work (CSV rows 42-44)
  electricity: jsonb("electricity").notNull(), // {
    // jcdecauxRequest: boolean,
    // afkoppelen: boolean,
    // aansluiten: boolean,
    // meterNumber: string,
    // remarks: string
  // }

  // Billing Information (CSV rows 46-53)
  billing: jsonb("billing").notNull(), // {
    // municipality: string,
    // postcode: string,
    // city: string,
    // poBox: string,
    // department: string,
    // attention: string,
    // reference: string
  // }

  // Additional Information
  generalRemarks: text("general_remarks"),
  documentationFiles: jsonb("documentation_files"), // For location sketches (PDF/AutoCAD)
  termsApproved: boolean("terms_approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const workOrderLogs = pgTable("work_order_logs", {
  id: serial("id").primaryKey(),
  workOrderId: integer("work_order_id").notNull().references(() => workOrders.id),
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