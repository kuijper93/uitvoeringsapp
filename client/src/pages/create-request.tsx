import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

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
  ],
  workDetails: [
    { id: "abriFormat", label: "Abri formaat", type: "text", showWhen: "municipality", equals: "Amsterdam" },
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
  ],
};

export default function CreateRequest() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      requestorName: "",
      requestorPhone: "",
      requestorEmail: "",
      municipality: "",
      executionContact: "",
      executionPhone: "",
      executionEmail: "",
      abriFormat: "",
      objectType: "",
      actionType: "",
      objectNumber: "",
      desiredDate: "",
      comments: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
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

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Nieuwe Aanvraag</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Contact Informatie</h2>
            {sections.contact.map((field) => (
              <FormField
                key={field.id}
                control={form.control}
                name={field.id}
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
                            {/* TODO: Add municipality options */}
                            <SelectItem value="amsterdam">Amsterdam</SelectItem>
                            <SelectItem value="rotterdam">Rotterdam</SelectItem>
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
            {sections.workDetails.map((field) => (
              <FormField
                key={field.id}
                control={form.control}
                name={field.id}
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
                              <SelectItem key={option} value={option.toLowerCase()}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
            ))}
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
