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

export const workOrderFormSchema = z.object({
  // Contact (fields 1-7)
  requestorName: z.string().min(1, "Naam opdrachtgever is verplicht"),
  requestorPhone: z.string().min(1, "Tel. Nr. Opdrachtgever is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres"),
  municipality: z.string().min(1, "Gemeente is verplicht"),
  executionContact: z.string().min(1, "Contactpersoon Uitvoering is verplicht"),
  executionPhone: z.string().min(1, "Tel. Nr. Uitvoering is verplicht"),
  executionEmail: z.string().email("Ongeldig e-mailadres"),

  // Gegevens werkzaamheden (fields 8-18, 46)
  abriFormat: z.string().optional(), // Only for Amsterdam
  streetFurnitureType: z.enum(straatmeubilairTypes, {
    required_error: "Type straatmeubilair is verplicht",
  }),
  actionType: z.enum(actieTypes, {
    required_error: "Uit te voeren actie is verplicht",
  }),
  objectNumber: z.string().regex(/^NL-AB-\d{5}$/, "Format: NL-AB-12345").optional(),
  city: z.string().min(1, "Stad is verplicht"),
  desiredDate: z.string().min(1, "Gewenste uitvoeringsdatum is verplicht"),
  additionalNotes: z.string().optional(),
  locationSketch: z.any().optional(), // PDF and AutoCAD files

  // Verwijderen/verplaatsen (fields 12, 12B)
  removalLocation: z.object({
    street: z.string().min(1, "Straat is verplicht"),
    postcode: z.string().min(1, "Postcode is verplicht")
  }).optional().superRefine((data, ctx) => {
    if (!data && ["Verwijderen", "Verplaatsen"].includes(ctx.parent.actionType)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Huidige locatie is verplicht voor verwijderen en verplaatsen"
      });
    }
  }),

  // Plaatsen/verplaatsen (fields 14-17, 12C)
  installationLocation: z.object({
    xCoordinate: z.string().min(1, "X coördinaten is verplicht"),
    yCoordinate: z.string().min(1, "Y coördinaten is verplicht"),
    streetAndNumber: z.string().min(1, "Straatnaam + huisnummer is verplicht"),
    busStopName: z.string().optional(),
    postcode: z.string().min(1, "Postcode is verplicht")
  }).optional().superRefine((data, ctx) => {
    if (!data && ["Plaatsen", "Verplaatsen"].includes(ctx.parent.actionType)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Nieuwe locatie is verplicht voor plaatsen en verplaatsen"
      });
    }
  }),

  // Bespreken met Arthur (fields 20-30)
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
  }),

  // Elektra (fields 32-34)
  electrical: z.object({
    jcdecauxRequest: z.boolean(),
    disconnect: z.boolean(),
    connect: z.boolean()
  }),

  // Kosten (fields 39-45)
  billing: z.object({
    municipality: z.string().optional(),
    postcode: z.string().optional(),
    city: z.string().optional(),
    poBox: z.string().optional(),
    department: z.string().optional(),
    attention: z.string().optional(),
    reference: z.string().optional()
  })
});

export type WorkOrderFormData = z.infer<typeof workOrderFormSchema>;

export const initialFormData: WorkOrderFormData = {
  // Contact
  requestorName: "",
  requestorPhone: "",
  requestorEmail: "",
  municipality: "",
  executionContact: "",
  executionPhone: "",
  executionEmail: "",

  // Gegevens werkzaamheden
  abriFormat: undefined,
  streetFurnitureType: "Abri",
  actionType: "Plaatsen",
  objectNumber: "",
  city: "",
  desiredDate: "",
  additionalNotes: "",
  locationSketch: null,

  // Verwijderen/verplaatsen
  removalLocation: {
    street: "",
    postcode: ""
  },

  // Plaatsen/verplaatsen
  installationLocation: {
    xCoordinate: "",
    yCoordinate: "",
    streetAndNumber: "",
    busStopName: "",
    postcode: ""
  },

  // Bespreken met Arthur
  jcdecauxWork: {
    required: false,
    existingWork: {
      removeStreetwork: false,
      excavate: false,
      fill: false,
      repave: false,
      provideMaterials: false
    },
    newWork: {
      digFoundation: false,
      fill: false,
      pave: false,
      provideMaterials: false
    },
    excessSoilAddress: ""
  },

  // Elektra
  electrical: {
    jcdecauxRequest: false,
    disconnect: false,
    connect: false
  },

  // Kosten
  billing: {
    municipality: "",
    postcode: "",
    city: "",
    poBox: "",
    department: "",
    attention: "",
    reference: ""
  }
};