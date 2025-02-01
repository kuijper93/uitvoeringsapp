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
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

// Progress indicator sections
const formSections = [
  { id: 'contact', title: 'Contact' },
  { id: 'details', title: 'Details' },
  { id: 'location', title: 'Locatie' },
  { id: 'groundwork', title: 'Grondwerk' },
  { id: 'billing', title: 'Facturering' }
] as const;

const requestFormSchema = z.object({
  // Contact Information
  requestorName: z.string().min(1, "Naam is verplicht"),
  requestorPhone: z.string().min(1, "Telefoonnummer is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres"),
  municipality: z.string().min(1, "Gemeente is verplicht"),
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

  // Ground Work Removal
  groundRemovalPaving: z.boolean().optional(),
  groundRemovalExcavation: z.boolean().optional(),
  groundRemovalFilling: z.boolean().optional(),
  groundRemovalRepaving: z.boolean().optional(),
  groundRemovalMaterials: z.boolean().optional(),

  // Ground Work Installation
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

const furnitureTypes = [
  { value: "abri", label: "Abri" },
  { value: "mupi", label: "Mupi" },
  { value: "driehoeksbord", label: "Driehoeksbord" },
  { value: "reclamezuil", label: "Reclamezuil" },
] as const;

export default function CreateRequest() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [currentSection, setCurrentSection] = useState<(typeof formSections)[number]['id']>('contact');

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
      desiredDate: "",
      groundRemovalPaving: false,
      groundRemovalExcavation: false,
      groundRemovalFilling: false,
      groundRemovalRepaving: false,
      groundRemovalMaterials: false,
      groundInstallationExcavation: false,
      groundInstallationFilling: false,
      groundInstallationRepaving: false,
      groundInstallationMaterials: false,
      electricalDisconnect: false,
      electricalConnect: false,
    },
  });

  const actionType = form.watch("actionType");
  const municipality = form.watch("municipality");

  const showAbriFormat = municipality?.toLowerCase() === "amsterdam" && 
                        form.watch("furnitureType") === "abri" &&
                        actionType === "plaatsen";

  const showLocationSketch = ["plaatsen", "verplaatsen"].includes(actionType || "");
  const showObjectNumber = ["verwijderen", "ophogen", "verplaatsen"].includes(actionType || "");
  const showRemovalLocation = ["verwijderen", "ophogen", "verplaatsen"].includes(actionType || "");
  const showInstallationLocation = ["plaatsen", "verplaatsen"].includes(actionType || "");
  const showGroundRemoval = ["verwijderen", "verplaatsen", "ophogen"].includes(actionType || "");
  const showGroundInstallation = ["plaatsen", "verplaatsen"].includes(actionType || "");
  const showElectricalDisconnect = ["verplaatsen", "verwijderen"].includes(actionType || "");
  const showElectricalConnect = ["verplaatsen", "plaatsen"].includes(actionType || "");

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[data-section]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        if (section instanceof HTMLElement) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setCurrentSection(section.dataset.section as (typeof formSections)[number]['id']);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (municipality) {
      form.setValue("removalCity", municipality);
      form.setValue("billingCity", municipality);
    }
  }, [municipality, form]);

  const createMutation = useMutation({
    mutationFn: async (data: RequestFormData) => {
      const transformedData = {
        ...data,
        ...Object.fromEntries(
          Object.entries(data).filter(([_, v]) => v != null && v !== "")
        ),
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        desiredDate: data.desiredDate ? new Date(data.desiredDate).toISOString() : null,
      };

      const response = await apiRequest("POST", "/api/requests", transformedData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Succes!",
        description: "Uw aanvraag is succesvol ingediend.",
        variant: "default",
      });
      navigate("/requests");
    },
    onError: (error) => {
      console.error("Form submission error:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: "Controleer of alle verplichte velden zijn ingevuld.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RequestFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 border-b">
        <div className="max-w-3xl mx-auto py-4">
          <div className="flex justify-between items-center">
            {formSections.map((section, index) => (
              <div key={section.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    section.id === currentSection
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium hidden sm:inline">{section.title}</span>
                {index < formSections.length - 1 && (
                  <div
                    className={`h-px w-12 mx-2 ${
                      formSections.findIndex(s => s.id === currentSection) > index
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <h1 className="text-xl font-bold">Nieuwe Aanvraag</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Contact Information */}
          <section data-section="contact">
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
          </section>

          {/* Work Details */}
          <section data-section="details">
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
                    <FormItem className="max-w-[200px]">
                      <FormLabel>Gewenste uitvoeringsdatum</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overige opmerkingen</FormLabel>
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
          </section>

          {/* Billing Information */}
          <section data-section="billing">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-base">Facturering</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="billingCity"
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
                    name="billingPostcode"
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
                <FormField
                  control={form.control}
                  name="billingAddress"
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
              </CardContent>
            </Card>
          </section>

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