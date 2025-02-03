import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getStatusLabel, WorkOrderStatusType } from "@/lib/status";
import type { SelectWorkOrder } from "@db/schema";
import { formatDistance } from "date-fns";
import { nl } from "date-fns/locale";

export default function WorkOrders() {
  const { data: workOrders, isLoading } = useQuery<SelectWorkOrder[]>({
    queryKey: ["/api/work-orders"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p>Laden...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mutaties</h1>
        <Link href="/work-orders/new">
          <Button className="rounded-xl">
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe Mutatie
          </Button>
        </Link>
      </div>

      <div className="rounded-xl overflow-hidden border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mutatienummer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Locatie</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aangemaakt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Link href={`/work-orders/${order.id}`} className="hover:underline">
                    {order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>{order.actionType}</TableCell>
                <TableCell>
                  {order.installationAddress || order.removalStreet}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(order.status as WorkOrderStatusType)} rounded-xl`}
                  >
                    {getStatusLabel(order.status as WorkOrderStatusType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistance(new Date(order.createdAt), new Date(), {
                    addSuffix: true,
                    locale: nl,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}