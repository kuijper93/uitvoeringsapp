import { Card } from "@/components/ui/card";
import AanvraagIntern from "@/components/tabs/AanvraagIntern";
import { useQuery } from "@tanstack/react-query";
import { SelectWorkOrder } from "@db/schema";

export default function InternalRequest() {
  const { data: workOrder } = useQuery<SelectWorkOrder>({
    queryKey: ["/api/requests/current"],
  });

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Interne Aanvraag</h1>
          <p className="text-sm text-muted-foreground">
            Bekijk en bewerk de interne aanvraaggegevens
          </p>
        </div>
      </div>

      <Card className="rounded-xl">
        <AanvraagIntern workOrder={workOrder} mapHeight={210} />
      </Card>
    </div>
  );
}