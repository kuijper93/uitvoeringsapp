import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { workOrderFormSchema, type WorkOrderFormData } from "@/lib/forms";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const municipalities = ["Amsterdam", "Rotterdam", "Den Haag", "Utrecht"] as const;

export default function CreateOrder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderFormSchema),
  });

  const actionType = form.watch("actionType");
  const municipality = form.watch("municipality");

  const createMutation = useMutation({
    mutationFn: async (data: WorkOrderFormData) => {
      const response = await apiRequest("/api/work-orders", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Werk order aangemaakt",
        description: "De werk order is succesvol aangemaakt.",
      });
      navigate("/work-orders");
    },
    onError: () => {
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
          {/* Contact Information Card */}
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

          {/* Work Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Gegevens werkzaamheden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {municipality?.toLowerCase() === "amsterdam" && (
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

          {/* Conditional Location Cards */}
          {actionType && (actionType === "Verwijderen" || actionType === "Verplaatsen") && (
            <Card>
              <CardHeader>
                <CardTitle>Huidige Locatie</CardTitle>
                 <CardDescription>Vul de details van de huidige locatie in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="currentLocation.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Straat</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currentLocation.postcode"
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
              </CardContent>
            </Card>
          )}

          {actionType && (actionType === "Plaatsen" || actionType === "Verplaatsen") && (
            <Card>
              <CardHeader>
                <CardTitle>Nieuwe Locatie</CardTitle>
                <CardDescription>Vul de details van de nieuwe locatie in</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="newLocation.coordinates.x"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X coördinaten</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="bijv. 52.3676" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newLocation.coordinates.y"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Y coördinaten</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="bijv. 4.9041" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="newLocation.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Straatnaam + huisnummer</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newLocation.postcode"
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
                  <FormField
                    control={form.control}
                    name="newLocation.busStopName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Haltenaam (optioneel)</FormLabel>
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
          )}
           {/* Bespreken met Arthur */}
          <Card>
            <CardHeader>
              <CardTitle>Bespreken met Arthur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="jcdecauxWork.required"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Aanvinken indien uitvoering voor JCDecaux gewenst is</FormLabel>
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jcdecauxWork.existingWork.removeStreetwork"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Straatwerk opnemen</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jcdecauxWork.existingWork.excavate"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Vrijgraven</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jcdecauxWork.existingWork.fill"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Aanvullen</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jcdecauxWork.existingWork.repave"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Herstraten</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jcdecauxWork.existingWork.provideMaterials"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Leveren materiaal</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="jcdecauxWork.newWork.digFoundation"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Cunet graven</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jcdecauxWork.newWork.fill"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Aanvullen</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jcdecauxWork.newWork.pave"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Herstraten</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="jcdecauxWork.newWork.provideMaterials"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">Leveren materiaal</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="jcdecauxWork.excessSoilAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Afleveradres overtollige grond</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
            {/* Elektra */}
          <Card>
            <CardHeader>
              <CardTitle>Elektra</CardTitle>
               <CardDescription>(aanvinken indien JCDecaux dit dient aan te vragen)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="electrical.disconnect"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Afkoppelen</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="electrical.connect"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0">Aansluiten</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
             {/* Kosten */}
          <Card>
            <CardHeader>
              <CardTitle>Kosten</CardTitle>
              <CardDescription>In rekening brengen aan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                 <FormField
                  control={form.control}
                  name="billing.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plaats</FormLabel>
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
                  name="billing.attention"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ter attentie van</FormLabel>
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
                      <FormLabel>Uw referentie</FormLabel>
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