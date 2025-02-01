import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const requestFormSchema = z.object({
  // Contact Information
  requestorName: z.string().min(1, "Naam is verplicht"),
  requestorPhone: z.string().min(1, "Telefoonnummer is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres"),
  municipality: z.string().min(1, "Gemeente is verplicht"),

  // Operational Contact
  executionContactName: z.string().min(1, "Naam uitvoerder is verplicht"),
  executionContactPhone: z.string().min(1, "Telefoonnummer uitvoerder is verplicht"),
  executionContactEmail: z.string().email("Ongeldig e-mailadres uitvoerder"),

  // Work Details
  actionType: z.enum(["verwijderen", "verplaatsen", "ophogen", "plaatsen"]),
  furnitureType: z.enum(["abri", "mupi", "driehoeksbord", "reclamezuil"]),
  abriFormat: z.string().optional(),
  objectNumber: z.string().optional(),
  desiredDate: z.string().min(1, "Datum is verplicht"),
  locationSketch: z.string().optional(),
  additionalNotes: z.string().optional(),
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
  "Apeldoorn",
  "Arnhem",
  "Zoetermeer",
  "Zwolle",
  "Amersfoort",
  "Haarlem",
  "Haarlemmermeer",
  "'s-Hertogenbosch",
  "Enschede",
  "Zaanstad",
] as const;

const furnitureTypes = [
  { value: "abri", label: "Abri" },
  { value: "mupi", label: "Mupi" },
  { value: "driehoeksbord", label: "Driehoeksbord" },
  { value: "reclamezuil", label: "Reclamezuil" },
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
      executionContactName: "",
      executionContactPhone: "",
      executionContactEmail: "",
      furnitureType: undefined,
      actionType: undefined,
      desiredDate: "",
      additionalNotes: "",
    },
  });

  const showAbriFormat = form.watch("municipality")?.toLowerCase() === "amsterdam" && 
                        form.watch("furnitureType") === "abri" &&
                        form.watch("actionType") === "plaatsen";

  const showLocationSketch = ["plaatsen", "verplaatsen"].includes(form.watch("actionType") || "");

  const showObjectNumber = ["verwijderen", "ophogen", "verplaatsen"].includes(form.watch("actionType") || "");

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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Nieuwe Aanvraag</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Contactgegevens</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel>Gemeente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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

              <div className="grid grid-cols-2 divide-x">
                <div className="pr-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Aanvrager</h3>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="requestorName"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Naam</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="requestorPhone"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Telefoon</FormLabel>
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
                          <FormItem className="space-y-1">
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className="pl-4 bg-muted/5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Voor Uitvoering</h3>
                  <div className="space-y-2">
                    <FormField
                      control={form.control}
                      name="executionContactName"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel>Naam</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <FormField
                        control={form.control}
                        name="executionContactPhone"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>Telefoon</FormLabel>
                            <FormControl>
                              <Input type="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="executionContactEmail"
                        render={({ field }) => (
                          <FormItem className="space-y-1">
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Werkzaamheden</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="furnitureType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type straatmeubilair</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer het object" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {furnitureTypes.map(({ value, label }) => (
                            <SelectItem key={value} value={value}>
                              {label}
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
                  name="actionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type actie</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer type actie" />
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

              {/* Conditional fields grid */}
              <div className="grid grid-cols-2 gap-4">
                {showAbriFormat && (
                  <FormField
                    control={form.control}
                    name="abriFormat"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Abri formaat</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {showObjectNumber && (
                  <FormField
                    control={form.control}
                    name="objectNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Objectnummer</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {showLocationSketch && (
                  <FormField
                    control={form.control}
                    name="locationSketch"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Locatieschets</FormLabel>
                        <FormControl>
                          <Input type="file" accept=".pdf,.dwg" {...field} />
                        </FormControl>
                        <p className="text-sm text-muted-foreground mt-1">
                          PDF en autocad (NLCS-DWG)
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>

              <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overige opmerkingen voor de aanvraag</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Voeg hier eventuele opmerkingen toe..."
                        className="min-h-[100px]"
                        {...field}
                      />
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