import { z } from "zod";

export const workOrderFormSchema = z.object({
  // Contact Information (CSV rows 1-7)
  requestorName: z.string().min(1, "Naam opdrachtgever is verplicht"),
  requestorPhone: z.string().min(1, "Telefoonnummer opdrachtgever is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres opdrachtgever"),
  municipality: z.string().min(1, "Gemeente is verplicht"),
  executionContact: z.string().min(1, "Contactpersoon uitvoering is verplicht"),
  executionPhone: z.string().min(1, "Telefoonnummer uitvoering is verplicht"),
  executionEmail: z.string().email("Ongeldig e-mailadres uitvoering"),

  // Work Details (CSV rows 8-16)
  type: z.enum(["work_order", "request"]),
  requestType: z.enum(["verwijderen", "verplaatsen", "ophogen", "plaatsen"]),
  objectType: z.enum([
    "Abri", "Mupi", "Vitrine", "Digitaal object", "Billboard",
    "Zuil", "Toilet", "Hekwerk", "Haltepaal", "Prullenbak", "Overig"
  ]),
  objectFormat: z.enum(["standard", "large", "custom"]).optional(), // For Amsterdam only
  objectNumber: z.string().optional(),
  city: z.string().min(1, "Stad is verplicht"),
  desiredDate: z.string().min(1, "Gewenste uitvoeringsdatum is verplicht"),

  // Location Information (CSV rows 19-26)
  currentLocation: z.object({
    street: z.string().min(1, "Straat is verplicht"),
    postcode: z.string().min(1, "Postcode is verplicht"),
    city: z.string().min(1, "Stad is verplicht"),
    coordinates: z.object({
      x: z.string().optional(),
      y: z.string().optional(),
    }),
    halteName: z.string().optional(), // For AB only
    remarks: z.string().optional(),
  }),

  newLocation: z.object({
    street: z.string().optional(),
    postcode: z.string().optional(),
    city: z.string().optional(),
    coordinates: z.object({
      x: z.string().optional(),
      y: z.string().optional(),
    }),
    halteName: z.string().optional(),
    remarks: z.string().optional(),
  }).optional(),

  // Street Work (CSV rows 30-40)
  streetwork: z.object({
    jcdecauxExecution: z.boolean().default(false), // Row 20
    required: z.boolean().default(false),
    vrijgraven: z.boolean().default(false),
    aanvullen: z.boolean().default(false),
    herstraten: z.boolean().default(false),
    materiaalLevering: z.boolean().default(false),
    cunetGraven: z.boolean().default(false), // Row 26
    overtolligeGrondAdres: z.string().optional(),
    remarks: z.string().optional(),
  }),

  // Electrical Work (CSV rows 42-44)
  electricity: z.object({
    jcdecauxRequest: z.boolean().default(false), // Row 32
    afkoppelen: z.boolean().default(false),
    aansluiten: z.boolean().default(false),
    meterNumber: z.string().optional(),
    remarks: z.string().optional(),
  }),

  // Billing Information (CSV rows 46-53)
  billing: z.object({
    municipality: z.string().optional(),
    postcode: z.string().optional(),
    city: z.string().optional(),
    poBox: z.string().optional(),
    department: z.string().optional(),
    attention: z.string().optional(),
    reference: z.string().optional(),
  }),

  // Additional Information
  generalRemarks: z.string().optional(),
  documentationFiles: z.any().optional(), // For location sketches (PDF/AutoCAD)
  termsApproved: z.boolean().default(false),
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
  type: "work_order",
  requestType: "plaatsen",
  objectType: "Abri",
  objectFormat: "standard",
  objectNumber: "",
  city: "",
  desiredDate: "",

  currentLocation: {
    street: "",
    postcode: "",
    city: "",
    coordinates: {
      x: "",
      y: "",
    },
    halteName: "",
    remarks: "",
  },

  newLocation: {
    street: "",
    postcode: "",
    city: "",
    coordinates: {
      x: "",
      y: "",
    },
    halteName: "",
    remarks: "",
  },

  streetwork: {
    jcdecauxExecution: false,
    required: false,
    vrijgraven: false,
    aanvullen: false,
    herstraten: false,
    materiaalLevering: false,
    cunetGraven: false,
    overtolligeGrondAdres: "",
    remarks: "",
  },

  electricity: {
    jcdecauxRequest: false,
    afkoppelen: false,
    aansluiten: false,
    meterNumber: "",
    remarks: "",
  },

  billing: {
    municipality: "",
    postcode: "",
    city: "",
    poBox: "",
    department: "",
    attention: "",
    reference: "",
  },

  generalRemarks: "",
  documentationFiles: null,
  termsApproved: false,
};