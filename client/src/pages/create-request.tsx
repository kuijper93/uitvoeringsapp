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

const requestFormSchema = z.object({
  requestorName: z.string().min(1, "Naam is verplicht"),
  requestorPhone: z.string().min(1, "Telefoonnummer is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres"),
  municipality: z.string().min(1, "Gemeente is verplicht"),
  executionContact: z.string().min(1, "Contactpersoon is verplicht"),
  executionPhone: z.string().min(1, "Telefoonnummer is verplicht"),
  executionEmail: z.string().email("Ongeldig e-mailadres"),
  abriFormat: z.string().optional(),
  objectType: z.enum(["abri", "mupi", "vitrine", "digitaal object", "billboard", "zuil", "toilet", "hekwerk", "haltepaal", "prullenbak", "overig"]),
  actionType: z.enum(["verwijderen", "verplaatsen", "ophogen", "plaatsen"]),
  objectNumber: z.string().optional(),
  desiredDate: z.string().min(1, "Datum is verplicht"),
  comments: z.string().optional(),
});

type RequestFormData = z.infer<typeof requestFormSchema>;

// Form sections based on CSV structure
const sections = {
  contact: [
    { id: "requestorName", label: "Naam opdrachtgever", type: "text" },
    { id: "requestorPhone", label: "Tel. Nr. Opdrachtgever", type: "tel" },
    { id: "requestorEmail", label: "Email Opdrachtgever", type: "email" },
    { id: "municipality", label: "Gemeente", type: "select" },
    { id: "executionContact", label: "Contactpersoon Uitvoering (gemeente)", type: "text" },
    { id: "executionPhone", label: "Tel. Nr. Uitvoering (gemeente)", type: "tel" },
    { id: "executionEmail", label: "Email Uitvoering (gemeente)", type: "email" },
  ] as const,
  workDetails: [
    { id: "abriFormat", label: "Abri formaat", type: "text", showWhen: "municipality", equals: "amsterdam" },
    {
      id: "objectType",
      label: "Type straatmeubilair",
      type: "select",
      options: [
        "Abri",
        "Mupi",
        "Vitrine",
        "Digitaal object",
        "Billboard",
        "Zuil",
        "Toilet",
        "Hekwerk",
        "Haltepaal",
        "Prullenbak",
        "Overig",
      ],
    },
    {
      id: "actionType",
      label: "Uit te voeren actie",
      type: "select",
      options: ["Verwijderen", "Verplaatsen", "Ophogen", "Plaatsen"],
    },
    { id: "objectNumber", label: "Betreft objectnummer", type: "text", placeholder: "NL-AB-12345" },
    { id: "desiredDate", label: "Gewenste uitvoeringsdatum", type: "date" },
    { id: "comments", label: "Overige opmerking voor opdrachtgever", type: "textarea" },
  ] as const,
};

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
      abriFormat: "",
      objectType: "abri",
      actionType: "plaatsen",
      objectNumber: "",
      desiredDate: "",
      comments: "",
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

  const selectedMunicipality = form.watch("municipality");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Nieuwe Aanvraag</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Contact Informatie</h2>
            {sections.contact.map((field) => (
              <FormField
                key={field.id}
                control={form.control}
                name={field.id as keyof RequestFormData}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                      {field.type === "select" ? (
                        <Select
                          onValueChange={formField.onChange}
                          defaultValue={formField.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Selecteer ${field.label.toLowerCase()}`} />
                          </SelectTrigger>
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
                      ) : (
                        <Input type={field.type} {...formField} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Gegevens Werkzaamheden</h2>
            {sections.workDetails.map((field) => {
              if (field.showWhen && field.equals && selectedMunicipality !== field.equals) {
                return null;
              }

              return (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={field.id as keyof RequestFormData}
                  render={({ field: formField }) => (
                    <FormItem>
                      <FormLabel>{field.label}</FormLabel>
                      <FormControl>
                        {field.type === "select" ? (
                          <Select
                            onValueChange={formField.onChange}
                            defaultValue={formField.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Selecteer ${field.label.toLowerCase()}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {field.options?.map((option) => (
                                <SelectItem 
                                  key={option.toLowerCase()} 
                                  value={option.toLowerCase()}
                                >
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : field.type === "textarea" ? (
                          <Textarea {...formField} />
                        ) : (
                          <Input
                            type={field.type}
                            placeholder={field.placeholder}
                            {...formField}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>

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