import { z } from "zod";

// Constants for dropdown options
export const municipalities = [
  "Amsterdam",
  "Rotterdam",
  "Den Haag",
  "Utrecht",
  "Eindhoven",
  "Groningen",
  "Tilburg",
  "Almere",
  "Breda",
  "Nijmegen",
] as const;

export const furnitureTypes = [
  { value: "abri", label: "Abri" },
  { value: "mupi", label: "Mupi" },
  { value: "driehoeksbord", label: "Driehoeksbord" },
  { value: "reclamezuil", label: "Reclamezuil" },
] as const;

export const actionTypes = [
  { value: "plaatsen", label: "Plaatsen" },
  { value: "verwijderen", label: "Verwijderen" },
  { value: "verplaatsen", label: "Verplaatsen" },
  { value: "ophogen", label: "Ophogen" },
] as const;

// Base schema for work request form
export const workRequestSchema = z.object({
  // Contact Information
  requestorName: z.string().min(1, "Naam is verplicht"),
  requestorPhone: z.string().min(1, "Telefoonnummer is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres"),
  municipality: z.enum(municipalities.map(m => m.toLowerCase()) as [string, ...string[]]),
  executionContactName: z.string().min(1, "Naam uitvoerder is verplicht"),
  executionContactPhone: z.string().min(1, "Telefoonnummer uitvoerder is verplicht"),
  executionContactEmail: z.string().email("Ongeldig e-mailadres uitvoerder"),

  // Work Details
  actionType: z.enum(actionTypes.map(t => t.value) as [string, ...string[]]),
  furnitureType: z.enum(furnitureTypes.map(t => t.value) as [string, ...string[]]),
  desiredDate: z.string().min(1, "Datum is verplicht"),

  // Optional fields that become required based on conditions
  abriFormat: z.string().optional(),
  objectNumber: z.string().optional(),
  locationSketch: z.string().url("Ongeldige URL").optional(),

  // Removal Location
  removalCity: z.string().optional(),
  removalStreet: z.string().optional(),
  removalPostcode: z.string().optional(),

  // Installation Location
  installationCity: z.string().optional(),
  installationXCoord: z.string().optional(),
  installationYCoord: z.string().optional(),
  installationAddress: z.string().optional(),
  installationPostcode: z.string().optional(),
  installationStopName: z.string().optional(),

  // Ground Work Related
  groundRemovalPaving: z.boolean().optional(),
  groundRemovalExcavation: z.boolean().optional(),
  groundRemovalFilling: z.boolean().optional(),
  groundRemovalRepaving: z.boolean().optional(),
  groundRemovalMaterials: z.boolean().optional(),

  groundInstallationExcavation: z.boolean().optional(),
  groundInstallationFilling: z.boolean().optional(),
  groundInstallationRepaving: z.boolean().optional(),
  groundInstallationMaterials: z.boolean().optional(),
  groundInstallationExcessSoilAddress: z.string().optional(),

  // Electrical Work
  electricalDisconnect: z.boolean().optional(),
  electricalConnect: z.boolean().optional(),

  // Billing Information
  billingCity: z.string().min(1, "Plaats is verplicht"),
  billingAddress: z.string().min(1, "Adres is verplicht"),
  billingPostcode: z.string().min(1, "Postcode is verplicht"),
  billingDepartment: z.string().optional(),
  billingAttention: z.string().optional(),
  billingReference: z.string().optional(),

  additionalNotes: z.string().optional(),
}).refine((data) => {
  // Amsterdam-specific validation
  if (data.municipality.toLowerCase() === "amsterdam" && 
      data.furnitureType === "abri" && 
      data.actionType === "plaatsen") {
    return !!data.abriFormat || "Abri formaat is verplicht voor Amsterdam";
  }
  return true;
}).refine((data) => {
  // Validate object number for specific actions
  if (["verwijderen", "ophogen", "verplaatsen"].includes(data.actionType)) {
    return !!data.objectNumber || "Objectnummer is verplicht voor deze actie";
  }
  return true;
}).refine((data) => {
  // Validate location sketch for placement/relocation
  if (["plaatsen", "verplaatsen"].includes(data.actionType)) {
    return !!data.locationSketch || "Locatieschets is verplicht voor deze actie";
  }
  return true;
});

export type WorkRequestFormData = z.infer<typeof workRequestSchema>;