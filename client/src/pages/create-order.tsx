import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { workOrderFormSchema, type WorkOrderFormData, initialFormData } from "@/lib/forms";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const municipalities = ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht"];

export default function CreateOrder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: initialFormData,
  });

  const municipality = form.watch("municipality");

  const createMutation = useMutation({
    mutationFn: async (data: WorkOrderFormData) => {
      if (!data.location.lat || !data.location.lng) {
        data.location = {
          ...data.location,
          lat: initialFormData.location.lat,
          lng: initialFormData.location.lng,
        };
      }
      await apiRequest("POST", "/api/work-orders", data);
    },
    onSuccess: () => {
      toast({
        title: "Succes",
        description: "Mutatie succesvol aangemaakt",
      });
      navigate("/work-orders");
    },
    onError: (error) => {
      toast({
        title: "Fout",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: WorkOrderFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Nieuwe Mutatie</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Contactgegevens</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requestorPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefoonnummer</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                            key={municipality}
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
                  name="requestType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type Aanvraag</FormLabel>
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
                          <SelectItem value="Abri">Abri</SelectItem>
                          <SelectItem value="Mupi">Mupi</SelectItem>
                          <SelectItem value="Vitrine">Vitrine</SelectItem>
                          <SelectItem value="Digitaal object">Digitaal object</SelectItem>
                          <SelectItem value="Billboard">Billboard</SelectItem>
                          <SelectItem value="Zuil">Zuil</SelectItem>
                          <SelectItem value="Toilet">Toilet</SelectItem>
                          <SelectItem value="Hekwerk">Hekwerk</SelectItem>
                          <SelectItem value="Haltepaal">Haltepaal</SelectItem>
                          <SelectItem value="Prullenbak">Prullenbak</SelectItem>
                          <SelectItem value="Overig">Overig</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {municipality === "amsterdam" && (
                <FormField
                  control={form.control}
                  name="objectFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Abri Formaat</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer formaat" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="standard">Standaard</SelectItem>
                          <SelectItem value="large">Groot</SelectItem>
                          <SelectItem value="custom">Aangepast</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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
                    <FormLabel>Gewenste Uitvoeringsdatum</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

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

                <FormField
                  control={form.control}
                  name="streetwork.vrijgraven"
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
                      <FormLabel className="!mt-0">Vrijgraven</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="streetwork.aanvullen"
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
                      <FormLabel className="!mt-0">Aanvullen</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="streetwork.herstraten"
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
                      <FormLabel className="!mt-0">Herstraten</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="streetwork.materiaalLevering"
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
                      <FormLabel className="!mt-0">Materiaal Levering</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="streetwork.overtolligeGrondAdres"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Afleveradres Overtollige Grond</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Facturering</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="billing.municipality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gemeente</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billing.postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postcode</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="billing.department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Afdeling</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billing.poBox"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postbus</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="billing.attention"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ter Attentie Van</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billing.reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uw Referentie</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/work-orders")}
            >
              Annuleren
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              Aanmaken
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}