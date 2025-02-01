import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { workOrderFormSchema, type WorkOrderFormData, initialFormData } from "@/lib/forms";
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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const municipalities = ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht"] as const;

export default function CreateOrder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: initialFormData,
  });

  const createMutation = useMutation({
    mutationFn: async (data: WorkOrderFormData) => {
      return await apiRequest("/api/work-orders", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Werk order aangemaakt",
        description: "De werk order is succesvol aangemaakt.",
      });
      navigate("/work-orders");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het aanmaken van de werk order.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Nieuwe aanvraag</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(createMutation.mutate)} className="space-y-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="requestorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naam opdrachtgever</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requestorPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tel. Nr. Opdrachtgever</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
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
                      <FormLabel>Email Opdrachtgever</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer gemeente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {municipalities.map((municipality) => (
                            <SelectItem key={municipality} value={municipality}>
                              {municipality}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="executionContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contactpersoon Uitvoering (gemeente)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="executionPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tel. Nr. Uitvoering (gemeente)</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="executionEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Uitvoering (gemeente)</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" />
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
            <CardHeader>
              <CardTitle>Gegevens werkzaamheden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {form.watch("municipality")?.toLowerCase() === "amsterdam" && (
                  <FormField
                    control={form.control}
                    name="abriFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abri formaat</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecteer formaat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="2m²">2m²</SelectItem>
                            <SelectItem value="2,16m²">2,16m²</SelectItem>
                            <SelectItem value="2,5m²">2,5m²</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="streetFurnitureType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type straatmeubilair</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
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

                <FormField
                  control={form.control}
                  name="actionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Uit te voeren actie</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer actie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Verwijderen">Verwijderen</SelectItem>
                          <SelectItem value="Verplaatsen">Verplaatsen</SelectItem>
                          <SelectItem value="Ophogen">Ophogen</SelectItem>
                          <SelectItem value="Plaatsen">Plaatsen</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="objectNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Betreft objectnummer</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="NL-AB-12345" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stad</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Gewenste uitvoeringsdatum</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overige opmerking voor opdrachtgever</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationSketch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locatieschets (PDF en autocad NLCS-DWG)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept=".pdf,.dwg" 
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/work-orders")}
            >
              Annuleren
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Bezig met opslaan..." : "Opslaan"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}