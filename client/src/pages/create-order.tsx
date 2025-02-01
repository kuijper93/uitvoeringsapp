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
    defaultValues: {
      actionType: "",
      electrical: {
        jcdecauxRequest: false,
        disconnect: false,
        connect: false
      }
    }
  });

  const actionType = form.watch("actionType");

  const createMutation = useMutation({
    mutationFn: async (data: WorkOrderFormData) => {
      return apiRequest("/api/work-orders", {
        method: "POST",
        body: JSON.stringify(data)
      });
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

  const handleSubmit = form.handleSubmit((data) => {
    createMutation.mutate(data);
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Nieuwe aanvraag</h1>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basis informatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="actionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type Actie</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecteer actie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Selecteer actie</SelectItem>
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
            </CardContent>
          </Card>

          {/* Only show location forms if an action is selected */}
          {actionType && actionType !== "" && (
            <>
              {/* Current Location - Only for Verwijderen and Verplaatsen */}
              {(actionType === "Verwijderen" || actionType === "Verplaatsen") && (
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

              {/* New Location - Only for Plaatsen and Verplaatsen */}
              {(actionType === "Plaatsen" || actionType === "Verplaatsen") && (
                <Card>
                  <CardHeader>
                    <CardTitle>Nieuwe Locatie</CardTitle>
                    <CardDescription>Vul de details van de nieuwe locatie in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="newLocation.street"
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
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

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