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

export default function Requests() {
  const { data: requests, isLoading } = useQuery<any[]>({
    queryKey: ["/api/requests"],
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Losse aanvragen</h1>
        <Link href="/requests/new">
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
              <TableHead>Type Object</TableHead>
              <TableHead>Actie</TableHead>
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
                <TableCell>{request.objectType}</TableCell>
                <TableCell>{request.requestType}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {request.status}
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
