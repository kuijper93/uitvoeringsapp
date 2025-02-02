import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import * as z from "zod";

const formSchema = z.object({
  objectModel: z.string(),
  objectKleur: z.string(),
  materiaalNummer: z.string(),
  objectNummer: z.string(),
  commercieel: z.string(),
  aanverwanteObjecten: z.string(),
  coordinaatX: z.string(),
  coordinaatY: z.string(),
  type: z.string(),
  materiaalNummerElektra: z.string(),
});

export function AanvragenInternForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objectModel: "",
      objectKleur: "",
      materiaalNummer: "",
      objectNummer: "",
      commercieel: "",
      aanverwanteObjecten: "",
      coordinaatX: "",
      coordinaatY: "",
      type: "",
      materiaalNummerElektra: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4 border p-4 rounded-lg">
            <h2 className="text-lg font-semibold">Objectgegevens</h2>
            <FormField
              control={form.control}
              name="objectModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Object model</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Andreas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="andreas">Andreas</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objectKleur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Object kleur</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="RAL7016" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ral7016">RAL7016</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="materiaalNummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Materiaal</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="NL-123456" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objectNummer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Object</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="NL-AB-199009" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button type="button" variant="outline">Kies configuratie</Button>
              <Button type="button">Bekijk TEMP</Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Locatiegegevens</h2>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="commercieel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commercieel</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="A en B zijde commercieel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ab_commercieel">A en B zijde commercieel</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="aanverwanteObjecten"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aanverwante objecten</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Met reclame" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="met_reclame">Met reclame</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="border p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Elektrabox</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="coordinaatX"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>X</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="54.123123" className="bg-green-100" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coordinaatY"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Y</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="54.123123" className="bg-green-100" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ondergronds" className="bg-green-100" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="materiaalNummerElektra"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materiaal</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="NL-654321" className="bg-green-100" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button type="button" variant="outline" className="w-full">
                  Kies configuratie
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}