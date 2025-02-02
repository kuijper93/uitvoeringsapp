import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistance, format } from "date-fns";
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
          <h1 className="text-xl font-bold">Aanvragen</h1>
          <p className="text-sm text-muted-foreground">
            Overzicht van alle ingediende aanvragen
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
              <TableHead>Aanvraagnummer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Opdrachtgever</TableHead>
              <TableHead>Gemeente</TableHead>
              <TableHead>Uitvoeringsdatum</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aangemaakt</TableHead>
              <TableHead className="w-[100px]">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading && requests?.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="font-medium">
                  {request.orderNumber}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {getFurnitureTypeLabel(request.furnitureType)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{request.requestorName}</p>
                    <p className="text-sm text-muted-foreground">{request.requestorEmail}</p>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{request.municipality}</TableCell>
                <TableCell>
                  {request.desiredDate ? (
                    format(new Date(request.desiredDate), 'd MMM yyyy', { locale: nl })
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>
                    {getStatusLabel(request.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <p>
                      {formatDistance(new Date(request.createdAt), new Date(), {
                        addSuffix: true,
                        locale: nl,
                      })}
                    </p>
                    <p className="text-muted-foreground">
                      {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm')}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Link href={`/requests/${request.id}`}>
                    <Button variant="ghost" size="icon">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Aanvragen laden...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && (!requests || requests.length === 0) && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Geen aanvragen gevonden
                </TableCell>
              </TableRow>
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
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "COMPLETED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "CANCELLED":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
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

function getFurnitureTypeLabel(type: string) {
  switch (type) {
    case "abri":
      return "Abri";
    case "mupi":
      return "Mupi";
    case "driehoeksbord":
      return "Driehoeksbord";
    case "reclamezuil":
      return "Reclamezuil";
    default:
      return type;
  }
}