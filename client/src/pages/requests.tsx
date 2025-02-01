import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpDown } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Aanvragen</h1>
          <p className="text-muted-foreground">
            Bekijk en beheer alle ingediende aanvragen
          </p>
        </div>
        <Link href="/create-request">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nieuwe Aanvraag
          </Button>
        </Link>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Aanvraagnummer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Opdrachtgever</TableHead>
              <TableHead>Gemeente</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead>Uitvoering</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Laden...
                </TableCell>
              </TableRow>
            ) : requests?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-muted-foreground">
                    Geen aanvragen gevonden
                  </p>
                  <Link href="/create-request">
                    <Button variant="link" className="mt-2">
                      Nieuwe aanvraag indienen
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ) : (
              requests?.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">
                    {request.orderNumber}
                  </TableCell>
                  <TableCell className="capitalize">
                    {request.furnitureType}
                  </TableCell>
                  <TableCell>{request.requestorName}</TableCell>
                  <TableCell className="capitalize">
                    {request.municipality}
                  </TableCell>
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
                  <TableCell>{request.execution_contact}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
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