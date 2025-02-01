import { z } from "zod";

// Action types
export const actionTypes = ["", "Verwijderen", "Verplaatsen", "Ophogen", "Plaatsen"] as const;

// Basic form schema
export const workOrderFormSchema = z.object({
  actionType: z.enum(actionTypes)
});

export type WorkOrderFormData = z.infer<typeof workOrderFormSchema>;
