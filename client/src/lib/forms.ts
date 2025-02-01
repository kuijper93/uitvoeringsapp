import { z } from "zod";

// Define the exact options from the CSV
const straatmeubilairTypes = [
  "Abri",
  "Mupi", 
  "Vitrine",
  "Digitaal object",
  "Billboard",
  "Zuil",
  "Toilet",
  "Hekwerk", 
  "Haltepaal",
  "Prullenbak",
  "Overig"
] as const;

const actieTypes = [
  "Verwijderen",
  "Verplaatsen", 
  "Ophogen",
  "Plaatsen"
] as const;

// Location schema
const locationSchema = z.object({
  street: z.string().min(1, "Straat is verplicht"),
  postcode: z.string().min(1, "Postcode is verplicht"),
  busStopName: z.string().optional(),
  coordinates: z.object({
    x: z.string().min(1, "X coördinaat is verplicht"),
    y: z.string().min(1, "Y coördinaat is verplicht")
  }).optional()
});

export const workOrderFormSchema = z.object({
  // Contact information
  requestorName: z.string().min(1, "Naam opdrachtgever is verplicht"),
  requestorPhone: z.string().min(1, "Tel. Nr. Opdrachtgever is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres"),
  municipality: z.string().min(1, "Gemeente is verplicht"),
  executionContact: z.string().min(1, "Contactpersoon Uitvoering is verplicht"),
  executionPhone: z.string().min(1, "Tel. Nr. Uitvoering is verplicht"),
  executionEmail: z.string().email("Ongeldig e-mailadres"),

  // Work details
  abriFormat: z.string().optional(),
  streetFurnitureType: z.enum(straatmeubilairTypes),
  actionType: z.enum(actieTypes),
  objectNumber: z.string().regex(/^NL-AB-\d{5}$/, "Format moet zijn: NL-AB-12345").optional(),
  city: z.string().min(1, "Stad is verplicht"),
  desiredDate: z.string().min(1, "Gewenste uitvoeringsdatum is verplicht"),
  additionalNotes: z.string().optional(),
  locationSketch: z.any().optional(),

  // Location details - conditionally required based on actionType
  currentLocation: locationSchema.optional(),
  newLocation: locationSchema.optional(),

  // Work requirements
  jcdecauxWork: z.object({
    required: z.boolean(),
    existingWork: z.object({
      removeStreetwork: z.boolean(),
      excavate: z.boolean(),
      fill: z.boolean(),
      repave: z.boolean(),
      provideMaterials: z.boolean()
    }),
    newWork: z.object({
      digFoundation: z.boolean(),
      fill: z.boolean(),
      pave: z.boolean(),
      provideMaterials: z.boolean()
    }),
    excessSoilAddress: z.string().optional()
  }).optional(),

  // Electrical work
  electrical: z.object({
    jcdecauxRequest: z.boolean(),
    disconnect: z.boolean(),
    connect: z.boolean()
  }),

  // Billing information
  billing: z.object({
    municipality: z.string().optional(),
    postcode: z.string().optional(),
    city: z.string().optional(),
    poBox: z.string().optional(),
    department: z.string().optional(),
    attention: z.string().optional(),
    reference: z.string().optional()
  })
}).refine((data) => {
  // Validation for removal and relocation
  if (["Verwijderen", "Verplaatsen"].includes(data.actionType) && !data.currentLocation) {
    return false;
  }
  // Validation for placement and relocation
  if (["Plaatsen", "Verplaatsen"].includes(data.actionType) && !data.newLocation) {
    return false;
  }
  return true;
}, {
  message: "Location information is required based on the selected action type",
  path: ["actionType"]
});

export type WorkOrderFormData = z.infer<typeof workOrderFormSchema>;