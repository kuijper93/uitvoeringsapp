import { z } from "zod";

export const workOrderFormSchema = z.object({
  requestType: z.enum(["plaatsen", "verwijderen", "verplaatsen", "ophogen"]),
  objectType: z.enum(["Abri", "Mupi", "Vitrine", "Digitaal object", "Billboard", "Zuil", "Toilet", "Hekwerk", "Haltepaal", "Prullenbak", "Overig"]),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string(),
  }),
  requestorName: z.string().min(1),
  requestorPhone: z.string().min(1),
  requestorEmail: z.string().email(),
  municipality: z.string().min(1),
  desiredDate: z.date(),
  formData: z.record(z.any()),
});

export type WorkOrderFormData = z.infer<typeof workOrderFormSchema>;

export const initialFormData: WorkOrderFormData = {
  requestType: "plaatsen",
  objectType: "Abri",
  location: {
    lat: 52.3676,
    lng: 4.9041,
    address: "",
  },
  requestorName: "",
  requestorPhone: "",
  requestorEmail: "",
  municipality: "",
  desiredDate: new Date(),
  formData: {},
};