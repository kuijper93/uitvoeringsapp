import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const requestFormSchema = z.object({
  // Contact Information
  requestorName: z.string().min(1, "Naam is verplicht"),
  requestorPhone: z.string().min(1, "Telefoonnummer is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres"),
  municipality: z.string().min(1, "Gemeente is verplicht"),
  executionContact: z.string().min(1, "Contactpersoon is verplicht"),
  executionPhone: z.string().min(1, "Telefoonnummer is verplicht"),
  executionEmail: z.string().email("Ongeldig e-mailadres"),

  // Work Details
  objectType: z.enum(["abri", "mupi", "vitrine", "digitaal_object", "billboard", "zuil", "toilet", "hekwerk", "haltepaal", "prullenbak", "overig"]),
  actionType: z.enum(["verwijderen", "verplaatsen", "ophogen", "plaatsen"]),
  objectNumber: z.string().optional(),
  desiredDate: z.string().min(1, "Datum is verplicht"),

  // Current Location (for removal/moving)
  currentLocation: z.object({
    address: z.string().min(1, "Adres is verplicht"),
    coordinates: z.string().optional(),
    remarks: z.string().optional(),
  }),

  // New Location (for installation/moving)
  newLocation: z.object({
    address: z.string().optional(),
    coordinates: z.string().optional(),
    remarks: z.string().optional(),
  }).optional(),

  // Infrastructure
  streetwork: z.object({
    required: z.boolean(),
    type: z.enum(["bestrating", "fundering", "beide"]).optional(),
    remarks: z.string().optional(),
  }),

  electricity: z.object({
    required: z.boolean(),
    connection: z.enum(["nieuwe_aansluiting", "bestaande_aansluiting", "geen"]).optional(),
    meterNumber: z.string().optional(),
    remarks: z.string().optional(),
  }),

  // Costs
  costs: z.object({
    estimate: z.string().optional(),
    approved: z.boolean().optional(),
    remarks: z.string().optional(),
  }),

  generalRemarks: z.string().optional(),
});

type RequestFormData = z.infer<typeof requestFormSchema>;

const municipalities = [
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

export default function CreateRequest() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      requestorName: "",
      requestorPhone: "",
      requestorEmail: "",
      municipality: "",
      executionContact: "",
      executionPhone: "",
      executionEmail: "",
      objectType: "abri",
      actionType: "plaatsen",
      objectNumber: "",
      desiredDate: "",
      currentLocation: {
        address: "",
        coordinates: "",
        remarks: "",
      },
      newLocation: {
        address: "",
        coordinates: "",
        remarks: "",
      },
      streetwork: {
        required: false,
        remarks: "",
      },
      electricity: {
        required: false,
        connection: "geen",
        remarks: "",
      },
      costs: {
        estimate: "",
        approved: false,
        remarks: "",
      },
      generalRemarks: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: RequestFormData) => {
      await apiRequest("POST", "/api/requests", data);
    },
    onSuccess: () => {
      toast({
        title: "Succes",
        description: "Aanvraag succesvol ingediend",
      });
      navigate("/requests");
    },
    onError: (error) => {
      toast({
        title: "Fout",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RequestFormData) => {
    createMutation.mutate(data);
  };

  const actionType = form.watch("actionType");
  const requiresElectricity = form.watch("electricity.required");
  const requiresStreetwork = form.watch("streetwork.required");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Nieuwe Aanvraag</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Contactgegevens</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requestorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naam Aanvrager</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="municipality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gemeente</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer gemeente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {municipalities.map((municipality) => (
                            <SelectItem
                              key={municipality.toLowerCase()}
                              value={municipality.toLowerCase()}
                            >
                              {municipality}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requestorPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefoonnummer</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="requestorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Work Details */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Werkzaamheden</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="objectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type Object</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="abri">Abri</SelectItem>
                          <SelectItem value="mupi">Mupi</SelectItem>
                          <SelectItem value="vitrine">Vitrine</SelectItem>
                          <SelectItem value="digitaal_object">Digitaal object</SelectItem>
                          <SelectItem value="billboard">Billboard</SelectItem>
                          <SelectItem value="zuil">Zuil</SelectItem>
                          <SelectItem value="toilet">Toilet</SelectItem>
                          <SelectItem value="hekwerk">Hekwerk</SelectItem>
                          <SelectItem value="haltepaal">Haltepaal</SelectItem>
                          <SelectItem value="prullenbak">Prullenbak</SelectItem>
                          <SelectItem value="overig">Overig</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="actionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type Actie</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer actie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="plaatsen">Plaatsen</SelectItem>
                          <SelectItem value="verwijderen">Verwijderen</SelectItem>
                          <SelectItem value="verplaatsen">Verplaatsen</SelectItem>
                          <SelectItem value="ophogen">Ophogen</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="objectNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objectnummer</FormLabel>
                      <FormControl>
                        <Input placeholder="NL-AB-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="desiredDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gewenste Datum</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Location */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Huidige Locatie</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <FormField
                control={form.control}
                name="currentLocation.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="currentLocation.remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opmerkingen</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* New Location (only for moving/installation) */}
          {(actionType === "verplaatsen" || actionType === "plaatsen") && (
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Nieuwe Locatie</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <FormField
                  control={form.control}
                  name="newLocation.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adres</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newLocation.remarks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opmerkingen</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Infrastructure */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Infrastructuur</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-6">
              {/* Street Work */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="streetwork.required"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Straatwerk nodig</FormLabel>
                    </FormItem>
                  )}
                />

                {requiresStreetwork && (
                  <FormField
                    control={form.control}
                    name="streetwork.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type Straatwerk</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecteer type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bestrating">Bestrating</SelectItem>
                            <SelectItem value="fundering">Fundering</SelectItem>
                            <SelectItem value="beide">Beide</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              {/* Electricity */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="electricity.required"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4"
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Elektra nodig</FormLabel>
                    </FormItem>
                  )}
                />

                {requiresElectricity && (
                  <>
                    <FormField
                      control={form.control}
                      name="electricity.connection"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type Aansluiting</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecteer type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nieuwe_aansluiting">Nieuwe aansluiting</SelectItem>
                              <SelectItem value="bestaande_aansluiting">Bestaande aansluiting</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="electricity.meterNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meternummer</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Costs */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Kosten</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <FormField
                control={form.control}
                name="costs.estimate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kostenschatting</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="costs.remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opmerkingen Kosten</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* General Remarks */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Algemene Opmerkingen</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <FormField
                control={form.control}
                name="generalRemarks"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/requests")}
            >
              Annuleren
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              Aanvraag Indienen
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}