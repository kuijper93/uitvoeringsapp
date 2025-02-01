import { z } from "zod";

// Define the core action types
const actieTypes = [
  "",  // Empty state for initial selection
  "Verwijderen",
  "Verplaatsen",
  "Ophogen",
  "Plaatsen"
] as const;

// Keep the location schema simple
const locationSchema = z.object({
  street: z.string().min(1, "Straat is verplicht"),
  postcode: z.string().min(1, "Postcode is verplicht")
});

// Start with a minimal form schema
export const workOrderFormSchema = z.object({
  actionType: z.enum(actieTypes),
  currentLocation: locationSchema.optional(),
  newLocation: locationSchema.optional(),
}).superRefine((data, ctx) => {
  // Don't validate if no action is selected
  if (!data.actionType || data.actionType === "") return true;

  // Validate current location for removal and relocation
  if ((data.actionType === "Verwijderen" || data.actionType === "Verplaatsen") && !data.currentLocation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Huidige locatie is verplicht voor verwijderen en verplaatsen",
      path: ["currentLocation"]
    });
  }

  // Validate new location for placement and relocation
  if ((data.actionType === "Plaatsen" || data.actionType === "Verplaatsen") && !data.newLocation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Nieuwe locatie is verplicht voor plaatsen en verplaatsen",
      path: ["newLocation"]
    });
  }
});

export type WorkOrderFormData = z.infer<typeof workOrderFormSchema>;