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
import { formatDistance } from "date-fns";
import { nl } from "date-fns/locale";
import type { SelectWorkOrder } from "@db/schema";

export default function Requests() {
  const { data: requests, isLoading } = useQuery<SelectWorkOrder[]>({
    queryKey: ["/api/requests"],
  });

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Losse aanvragen</h1>
        <Link href="/create-request">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe Aanvraag
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aanvraagnummer</TableHead>
              <TableHead>Opdrachtgever</TableHead>
              <TableHead>Gemeente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aangemaakt</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.orderNumber}
                </TableCell>
                <TableCell>{request.requestorName}</TableCell>
                <TableCell>{request.municipality}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusLabel(request.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistance(new Date(request.createdAt), new Date(), {
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

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "In behandeling";
    case "IN_PROGRESS":
      return "In uitvoering";
    case "COMPLETED":
      return "Afgerond";
    case "CANCELLED":
      return "Geannuleerd";
    default:
      return status;
  }
}