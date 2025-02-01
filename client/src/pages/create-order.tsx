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

const orderFormSchema = z.object({
  requestorName: z.string().min(1, "Naam is verplicht"),
  requestorEmail: z.string().email("Ongeldig e-mailadres"),
  municipality: z.string().min(1, "Gemeente is verplicht"),
  description: z.string().min(1, "Beschrijving is verplicht"),
  priority: z.enum(["low", "medium", "high"]),
});

type OrderFormData = z.infer<typeof orderFormSchema>;

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

export default function CreateOrder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      requestorName: "",
      requestorEmail: "",
      municipality: "",
      description: "",
      priority: "medium",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      await apiRequest("POST", "/api/orders", data);
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

  const onSubmit = (data: OrderFormData) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">Nieuwe Aanvraag</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-base">Basis Informatie</CardTitle>
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

              <FormField
                control={form.control}
                name="municipality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gemeente</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer gemeente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {municipalities.map((municipality) => (
                          <SelectItem key={municipality.toLowerCase()} value={municipality.toLowerCase()}>
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioriteit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer prioriteit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Laag</SelectItem>
                        <SelectItem value="medium">Normaal</SelectItem>
                        <SelectItem value="high">Hoog</SelectItem>
                      </SelectContent>
                    </Select>
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