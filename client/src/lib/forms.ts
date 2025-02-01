import { z } from "zod";

export const workOrderFormSchema = z.object({
  // Contact Information
  requestorName: z.string().min(1, "Naam is verplicht"),
  requestorPhone: z.string().min(1, "Telefoonnummer is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres"),
  municipality: z.string().min(1, "Gemeente is verplicht"),
  executionContact: z.string().min(1, "Contactpersoon uitvoering is verplicht"),
  executionPhone: z.string().min(1, "Telefoonnummer uitvoering is verplicht"),
  executionEmail: z.string().email("Ongeldig e-mailadres uitvoering"),

  // Work Details
  requestType: z.enum(["verwijderen", "verplaatsen", "ophogen", "plaatsen"], {
    required_error: "Type aanvraag is verplicht",
  }),
  objectType: z.enum([
    "Abri", "Mupi", "Vitrine", "Digitaal object", "Billboard", 
    "Zuil", "Toilet", "Hekwerk", "Haltepaal", "Prullenbak", "Overig"
  ], {
    required_error: "Type object is verplicht",
  }),
  objectNumber: z.string().optional(),
  objectFormat: z.string().optional(), // For Amsterdam Abri format

  // Location Information
  currentLocation: z.object({
    address: z.string().min(1, "Adres is verplicht"),
    postcode: z.string().optional(),
    coordinates: z.string().optional(),
    halteName: z.string().optional(),
    remarks: z.string().optional(),
  }),
  newLocation: z.object({
    address: z.string().optional(),
    postcode: z.string().optional(),
    coordinates: z.string().optional(),
    halteName: z.string().optional(),
    remarks: z.string().optional(),
  }).optional(),

  // Infrastructure
  streetwork: z.object({
    required: z.boolean(),
    type: z.enum(["bestrating", "fundering", "beide"]).optional(),
    vrijgraven: z.boolean().optional(),
    aanvullen: z.boolean().optional(),
    herstraten: z.boolean().optional(),
    materiaalLevering: z.boolean().optional(),
    overtolligeGrondAdres: z.string().optional(),
    remarks: z.string().optional(),
  }),

  // Electricity
  electricity: z.object({
    required: z.boolean(),
    connection: z.enum(["nieuwe_aansluiting", "bestaande_aansluiting", "geen"]).optional(),
    afkoppelen: z.boolean().optional(),
    aankoppelen: z.boolean().optional(),
    meterNumber: z.string().optional(),
    remarks: z.string().optional(),
  }),

  // Costs and Billing
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
  desiredDate: z.date(),
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
  requestType: "plaatsen",
  objectType: "Abri",
  objectNumber: "",
  objectFormat: "",
  currentLocation: {
    address: "",
    postcode: "",
    coordinates: "",
    halteName: "",
    remarks: "",
  },
  newLocation: {
    address: "",
    postcode: "",
    coordinates: "",
    halteName: "",
    remarks: "",
  },
  streetwork: {
    required: false,
    vrijgraven: false,
    aanvullen: false,
    herstraten: false,
    materiaalLevering: false,
    overtolligeGrondAdres: "",
    remarks: "",
  },
  electricity: {
    required: false,
    connection: "geen",
    afkoppelen: false,
    aankoppelen: false,
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
  desiredDate: new Date(),
  termsApproved: false,
};