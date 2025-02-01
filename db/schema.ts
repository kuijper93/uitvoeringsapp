import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

export const workOrders = pgTable("work_orders", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'work_order' or 'request'
  orderNumber: text("order_number").notNull(),
  requestType: text("request_type").notNull(), // placement, removal, etc
  status: text("status").notNull().default("draft"),
  objectType: text("object_type").notNull(), // Abri, Mupi, etc

  // Contact Information
  requestorName: text("requestor_name").notNull(),
  requestorPhone: text("requestor_phone").notNull(),
  requestorEmail: text("requestor_email").notNull(),
  municipality: text("municipality").notNull(),
  executionContact: text("execution_contact"),
  executionPhone: text("execution_phone"),
  executionEmail: text("execution_email"),

  // Location Information
  currentLocation: jsonb("current_location").notNull(), // {address, coordinates, remarks}
  newLocation: jsonb("new_location"), // {address, coordinates, remarks}

  // Infrastructure
  streetwork: jsonb("streetwork").notNull(), // {required, type, remarks}
  electricity: jsonb("electricity").notNull(), // {required, connection, meterNumber, remarks}

  // Costs
  costs: jsonb("costs"), // {estimate, approved, remarks}

  generalRemarks: text("general_remarks"),
  desiredDate: timestamp("desired_date").notNull(),
  formData: jsonb("form_data").notNull(), // For storing additional dynamic form fields
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