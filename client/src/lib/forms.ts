import { z } from "zod";

export const workOrderFormSchema = z.object({
  // Contact (fields 1-7)
  requestorName: z.string().min(1, "Naam opdrachtgever is verplicht"),
  requestorPhone: z.string().min(1, "Tel. Nr. Opdrachtgever is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres voor opdrachtgever"),
  municipality: z.string().min(1, "Gemeente is verplicht"),
  executionContactName: z.string().min(1, "Contactpersoon Uitvoering (gemeente) is verplicht"),
  executionContactPhone: z.string().min(1, "Tel. Nr. Uitvoering (gemeente) is verplicht"),
  executionContactEmail: z.string().email("Ongeldig e-mailadres voor uitvoering"),

  // Gegevens werkzaamheden (fields 8-18, 46)
  abriFormat: z.string().optional(), // Only for Amsterdam
  streetFurnitureType: z.enum([
    "Abri", "Mupi", "Vitrine", "Digitaal object", "Billboard", 
    "Zuil", "Toilet", "Hekwerk", "Haltepaal", "Prullenbak", "Overig"
  ], {
    required_error: "Type straatmeubilair is verplicht"
  }),
  actionType: z.enum([
    "Verwijderen", "Verplaatsen", "Ophogen", "Plaatsen"
  ], {
    required_error: "Uit te voeren actie is verplicht"
  }),
  objectNumber: z.string().regex(/^NL-AB-\d{5}$/, "Format: NL-AB-12345").optional(),
  city: z.string().min(1, "Stad is verplicht"),
  desiredDate: z.string().min(1, "Gewenste uitvoeringsdatum is verplicht"),
  additionalNotes: z.string().optional(),
  locationSketch: z.any().optional(), // PDF and AutoCAD (NLCS-DWG)

  // Verwijderen / verplaatsen (fields 12, 12B)
  removalDetails: z.object({
    street: z.string().min(1, "Straat is verplicht"),
    postcode: z.string().min(1, "Postcode is verplicht")
  }),

  // Plaatsen / verplaatsen (fields 14-17, 12C)
  installationDetails: z.object({
    coordinates: z.object({
      x: z.string().min(1, "X coördinaten is verplicht"),
      y: z.string().min(1, "Y coördinaten is verplicht")
    }),
    streetAndNumber: z.string().min(1, "Straatnaam + huisnummer is verplicht"),
    busStopName: z.string().optional(),
    postcode: z.string().min(1, "Postcode is verplicht")
  }),

  // Bespreken met Arthur (fields 20-30)
  jcdecauxExecution: z.object({
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

export const initialWorkOrderData: WorkOrderFormData = {
  requestorName: "",
  requestorPhone: "",
  requestorEmail: "",
  municipality: "",
  executionContactName: "",
  executionContactPhone: "",
  executionContactEmail: "",

  abriFormat: undefined,
  streetFurnitureType: "Abri",
  actionType: "Plaatsen",
  objectNumber: "",
  city: "",
  desiredDate: "",
  additionalNotes: "",
  locationSketch: null,

  removalDetails: {
    street: "",
    postcode: ""
  },

  installationDetails: {
    coordinates: {
      x: "",
      y: ""
    },
    streetAndNumber: "",
    busStopName: "",
    postcode: ""
  },

  jcdecauxExecution: {
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
  }
};