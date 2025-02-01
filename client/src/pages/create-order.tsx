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

export default function CreateOrder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: initialFormData,
  });

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
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Nieuwe Mutatie</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <SelectValue placeholder="Selecteer object type" />
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

          <FormField
            control={form.control}
            name="requestorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naam Aanvrager</FormLabel>
                <FormControl>
                  <Input placeholder="Vul naam in" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="requestorEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Vul e-mail in" {...field} />
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
                  <FormLabel>Telefoon</FormLabel>
                  <FormControl>
                    <Input placeholder="Vul telefoonnummer in" {...field} />
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
                <FormControl>
                  <Input placeholder="Vul gemeente in" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="desiredDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Gewenste Uitvoeringsdatum</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: nl })
                        ) : (
                          <span>Kies een datum</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      locale={nl}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location.address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Locatie Adres</FormLabel>
                <FormControl>
                  <Input placeholder="Vul adres in" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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