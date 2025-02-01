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
  "",
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
  streetFurnitureType: z.enum(straatmeubilairTypes).optional(),
  actionType: z.enum(actieTypes),
  objectNumber: z.string().regex(/^NL-AB-\d{5}$/, "Format moet zijn: NL-AB-12345").optional(),
  city: z.string().min(1, "Stad is verplicht"),
  desiredDate: z.string().min(1, "Gewenste uitvoeringsdatum is verplicht"),
  additionalNotes: z.string().optional(),
  locationSketch: z.any().optional(),
  
  // Location details
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
}).superRefine((data, ctx) => {
  // Skip validation if no action is selected
  if (data.actionType === "") return true;

  // Validate current location for remove and relocate actions
  if (["Verwijderen", "Verplaatsen"].includes(data.actionType) && !data.currentLocation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Huidige locatie is verplicht voor verwijderen en verplaatsen",
      path: ["currentLocation"]
    });
  }

  // Validate new location for place and relocate actions
  if (["Plaatsen", "Verplaatsen"].includes(data.actionType) && !data.newLocation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Nieuwe locatie is verplicht voor plaatsen en verplaatsen",
      path: ["newLocation"]
    });
  }
});

export type WorkOrderFormData = z.infer<typeof workOrderFormSchema>;