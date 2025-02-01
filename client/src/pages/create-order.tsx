import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { workOrderFormSchema, type WorkOrderFormData, initialFormData } from "@/lib/forms";
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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function CreateOrder() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const form = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderFormSchema),
    defaultValues: initialFormData,
  });

  const createMutation = useMutation({
    mutationFn: async (data: WorkOrderFormData) => {
      await apiRequest("POST", "/api/work-orders", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Work order created successfully",
      });
      navigate("/work-orders");
    },
    onError: (error) => {
      toast({
        title: "Error",
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
      <h1 className="text-2xl font-bold">Create Work Order</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="requestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="placement">Placement</SelectItem>
                      <SelectItem value="removal">Removal</SelectItem>
                      <SelectItem value="relocation">Relocation</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
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
                  <FormLabel>Object Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select object type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Abri">Abri</SelectItem>
                      <SelectItem value="Mupi">Mupi</SelectItem>
                      <SelectItem value="Vitrine">Vitrine</SelectItem>
                      <SelectItem value="Digitaal object">
                        Digitaal object
                      </SelectItem>
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
                <FormLabel>Requestor Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email" {...field} />
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
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
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
                <FormLabel>Municipality</FormLabel>
                <FormControl>
                  <Input placeholder="Enter municipality" {...field} />
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
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              Create Work Order
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}