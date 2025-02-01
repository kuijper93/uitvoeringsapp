import { z } from "zod";

export const workOrderFormSchema = z.object({
  // Contact (rows 1-7)
  requestorName: z.string().min(1, "Naam opdrachtgever is verplicht"),
  requestorPhone: z.string().min(1, "Tel. Nr. Opdrachtgever is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres"),
  municipality: z.string().min(1, "Gemeente is verplicht"),
  executionContact: z.string().min(1, "Contactpersoon Uitvoering is verplicht"),
  executionPhone: z.string().min(1, "Tel. Nr. Uitvoering is verplicht"),
  executionEmail: z.string().email("Ongeldig e-mailadres Uitvoering"),

  // Gegevens werkzaamheden (rows 8-17)
  abriFormat: z.string().optional(), // Only for Amsterdam
  streetFurnitureType: z.enum([
    "Abri", "Mupi", "Vitrine", "Digitaal object", "Billboard", 
    "Zuil", "Toilet", "Hekwerk", "Haltepaal", "Prullenbak", "Overig"
  ]),
  actionType: z.enum(["Verwijderen", "Verplaatsen", "Ophogen", "Plaatsen"]),
  objectNumber: z.string().regex(/^NL-AB-\d{5}$/, "Format: NL-AB-12345").optional(),
  city: z.string().min(1, "Stad is verplicht"),
  desiredDate: z.string().min(1, "Gewenste uitvoeringsdatum is verplicht"),
  additionalNotes: z.string().optional(),
  locationSketch: z.any().optional(), // PDF and AutoCAD (NLCS-DWG)

  // Verwijderen / verplaatsen (rows 19-21)
  currentLocation: z.object({
    street: z.string().min(1, "Straat is verplicht"),
    postcode: z.string().min(1, "Postcode is verplicht")
  }),

  // Plaatsen / verplaatsen (rows 22-26)
  newLocation: z.object({
    xCoordinate: z.string().optional(),
    yCoordinate: z.string().optional(),
    streetAndNumber: z.string().optional(),
    busStopName: z.string().optional(), // Optional - only for AB
    postcode: z.string().optional()
  }).optional(),

  // Infrastructure (rows 29-40)
  jcdecaux: z.object({
    executionRequired: z.boolean().default(false),
    streetwork: z.object({
      remove: z.boolean().default(false),
      excavate: z.boolean().default(false),
      fill: z.boolean().default(false),
      repave: z.boolean().default(false),
      provideMaterials: z.boolean().default(false),
    }),
    newInstallation: z.object({
      digFoundation: z.boolean().default(false),
      fill: z.boolean().default(false),
      pave: z.boolean().default(false),
      provideMaterials: z.boolean().default(false),
    }),
    excessSoilAddress: z.string().optional()
  }),

  // Elektra (rows 42-44)
  electrical: z.object({
    jcdecauxRequest: z.boolean().default(false),
    disconnect: z.boolean().default(false),
    connect: z.boolean().default(false)
  }),

  // Kosten (rows 46-53)
  billing: z.object({
    municipality: z.string().optional(),
    postcode: z.string().optional(),
    city: z.string().optional(),
    poBox: z.string().optional(),
    department: z.string().optional(),
    attention: z.string().optional(),
    reference: z.string().optional()
  }),

  // Additional settings
  termsAccepted: z.boolean().default(false)
});

export type WorkOrderFormData = z.infer<typeof workOrderFormSchema>;

export const initialFormData: WorkOrderFormData = {
  requestorName: "",
  requestorPhone: "",
  requestorEmail: "",
  municipality: "",
  executionContact: "",
  executionPhone: "",
  executionEmail: "",

  abriFormat: undefined,
  streetFurnitureType: "Abri",
  actionType: "Plaatsen",
  objectNumber: "",
  city: "",
  desiredDate: "",
  additionalNotes: "",
  locationSketch: null,

  currentLocation: {
    street: "",
    postcode: ""
  },

  newLocation: {
    xCoordinate: "",
    yCoordinate: "",
    streetAndNumber: "",
    busStopName: "",
    postcode: ""
  },

  jcdecaux: {
    executionRequired: false,
    streetwork: {
      remove: false,
      excavate: false,
      fill: false,
      repave: false,
      provideMaterials: false
    },
    newInstallation: {
      digFoundation: false,
      fill: false,
      pave: false,
      provideMaterials: false
    },
    excessSoilAddress: ""
  },

  electrical: {
    jcdecauxRequest: false,
    disconnect: false,
    connect: false
  },

  billing: {
    municipality: "",
    postcode: "",
    city: "",
    poBox: "",
    department: "",
    attention: "",
    reference: ""
  },

  termsAccepted: false
};