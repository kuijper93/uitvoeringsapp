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
import { getStatusColor, getStatusLabel } from "@/lib/status";
import type { SelectWorkOrder } from "@db/schema";
import { formatDistance } from "date-fns";
import { nl } from "date-fns/locale";

export default function WorkOrders() {
  const { data: workOrders, isLoading } = useQuery<SelectWorkOrder[]>({
    queryKey: ["/api/work-orders"],
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mutaties</h1>
        <Link href="/work-orders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe Mutatie doorgeven
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
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
                  {order.orderNumber}
                </TableCell>
                <TableCell>{order.requestType}</TableCell>
                <TableCell>
                  {(order.location as any).address}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(order.status as any)}
                  >
                    {getStatusLabel(order.status as any)}
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