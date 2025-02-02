import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import type { SelectWorkOrder } from "@db/schema";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

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

function getActionTypeLabel(type: string) {
  switch (type) {
    case "plaatsen":
      return "Plaatsen";
    case "verwijderen":
      return "Verwijderen";
    case "verplaatsen":
      return "Verplaatsen";
    case "ophogen":
      return "Ophogen";
    default:
      return type;
  }
}

export default function RequestDetails() {
  const { id } = useParams();
  const { data: request, isLoading } = useQuery<SelectWorkOrder>({
    queryKey: [`/api/requests/${id}`],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <p>Aanvraag laden...</p>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <p>Aanvraag niet gevonden</p>
        <Link href="/requests">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Terug naar overzicht
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/requests">
            <Button variant="ghost" className="mb-4 -ml-4 rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Terug naar overzicht
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Aanvraag {request.orderNumber}</h1>
          <div className="flex items-center space-x-3 mt-2">
            <Badge className={`${getStatusColor(request.status)} rounded-xl`}>
              {getStatusLabel(request.status)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Aangemaakt op {format(new Date(request.createdAt), 'd MMMM yyyy', { locale: nl })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Contact Information */}
        <Card className="transition-all hover:shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Contactgegevens</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium">Aanvrager</h3>
              <div className="space-y-2">
                <p><span className="text-muted-foreground">Naam:</span> {request.requestorName}</p>
                <p><span className="text-muted-foreground">Telefoon:</span> {request.requestorPhone}</p>
                <p><span className="text-muted-foreground">E-mail:</span> {request.requestorEmail}</p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Voor Uitvoering</h3>
              <div className="space-y-2">
                <p><span className="text-muted-foreground">Naam:</span> {request.executionContactName}</p>
                <p><span className="text-muted-foreground">Telefoon:</span> {request.executionContactPhone}</p>
                <p><span className="text-muted-foreground">E-mail:</span> {request.executionContactEmail}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Work Details */}
        <Card className="transition-all hover:shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Werkzaamheden</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-muted-foreground mb-1">Type straatmeubilair</p>
                <p className="font-medium">{getFurnitureTypeLabel(request.furnitureType)}</p>
                {request.abriFormat && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Abri formaat: {request.abriFormat}
                  </p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Type actie</p>
                <p className="font-medium">{getActionTypeLabel(request.actionType)}</p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground mb-1">Gewenste uitvoeringsdatum</p>
              <p className="font-medium">
                {format(new Date(request.desiredDate), 'd MMMM yyyy', { locale: nl })}
              </p>
            </div>

            {request.objectNumber && (
              <div>
                <p className="text-muted-foreground mb-1">Objectnummer</p>
                <p className="font-medium">{request.objectNumber}</p>
              </div>
            )}

            {request.locationSketch && (
              <div>
                <p className="text-muted-foreground mb-1">Locatieschets</p>
                <a 
                  href={request.locationSketch}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Bekijk locatieschets
                </a>
              </div>
            )}

            {request.additionalNotes && (
              <div>
                <p className="text-muted-foreground mb-1">Overige opmerkingen</p>
                <p>{request.additionalNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Information */}
        {(request.actionType === "verwijderen" || request.actionType === "verplaatsen" || request.actionType === "ophogen") && (
          <Card className="transition-all hover:shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Verwijderlocatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-muted-foreground mb-1">Stad</p>
                  <p className="font-medium">{request.removalCity}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Straat</p>
                  <p className="font-medium">{request.removalStreet || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Postcode</p>
                  <p className="font-medium">{request.removalPostcode || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {(request.actionType === "plaatsen" || request.actionType === "verplaatsen") && (
          <Card className="transition-all hover:shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Installatielocatie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground mb-1">Stad</p>
                  <p className="font-medium">{request.installationCity}</p>
                </div>
                {request.installationStopName && (
                  <div>
                    <p className="text-muted-foreground mb-1">Haltenaam</p>
                    <p className="font-medium">{request.installationStopName}</p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground mb-1">X coördinaat</p>
                  <p className="font-medium">{request.installationXCoord || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Y coördinaat</p>
                  <p className="font-medium">{request.installationYCoord || '-'}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-muted-foreground mb-1">Straatnaam + huisnummer</p>
                  <p className="font-medium">{request.installationAddress || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Postcode</p>
                  <p className="font-medium">{request.installationPostcode || '-'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ground Work */}
        {(request.groundRemovalPaving || request.groundRemovalExcavation || request.groundRemovalFilling || 
          request.groundRemovalRepaving || request.groundRemovalMaterials || request.groundInstallationExcavation || 
          request.groundInstallationFilling || request.groundInstallationRepaving || request.groundInstallationMaterials) && (
          <Card className="transition-all hover:shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Grond en straatwerk</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-8">
              {(request.actionType === "verwijderen" || request.actionType === "verplaatsen" || request.actionType === "ophogen") && (
                <div className="space-y-4">
                  <h3 className="font-medium">Verwijderlocatie</h3>
                  <div className="space-y-2">
                    {request.groundRemovalPaving && <p>✓ Straatwerk opnemen</p>}
                    {request.groundRemovalExcavation && <p>✓ Vrijgraven</p>}
                    {request.groundRemovalFilling && <p>✓ Aanvullen</p>}
                    {request.groundRemovalRepaving && <p>✓ Herstraten</p>}
                    {request.groundRemovalMaterials && <p>✓ Materialen verwerken</p>}
                  </div>
                </div>
              )}

              {(request.actionType === "plaatsen" || request.actionType === "verplaatsen") && (
                <div className="space-y-4">
                  <h3 className="font-medium">Installatielocatie</h3>
                  <div className="space-y-2">
                    {request.groundInstallationExcavation && <p>✓ Vrijgraven</p>}
                    {request.groundInstallationFilling && <p>✓ Aanvullen</p>}
                    {request.groundInstallationRepaving && <p>✓ Herstraten</p>}
                    {request.groundInstallationMaterials && <p>✓ Materialen verwerken</p>}
                  </div>
                  {request.groundInstallationExcessSoilAddress && (
                    <div className="mt-4">
                      <p className="text-muted-foreground mb-1">Adres overtollige grond</p>
                      <p>{request.groundInstallationExcessSoilAddress}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Electrical Work */}
        {(request.electricalConnect || request.electricalDisconnect) && (
          <Card className="transition-all hover:shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">Elektrische werkzaamheden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {request.electricalDisconnect && <p>✓ Loskoppelen</p>}
              {request.electricalConnect && <p>✓ Aansluiten</p>}
            </CardContent>
          </Card>
        )}

        {/* Billing Information */}
        <Card className="transition-all hover:shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Facturering</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="text-muted-foreground mb-1">Stad</p>
                <p className="font-medium">{request.billingCity}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Adres</p>
                <p className="font-medium">{request.billingAddress}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Postcode</p>
                <p className="font-medium">{request.billingPostcode}</p>
              </div>
            </div>

            {(request.billingDepartment || request.billingAttention || request.billingReference) && (
              <div className="grid md:grid-cols-3 gap-6">
                {request.billingDepartment && (
                  <div>
                    <p className="text-muted-foreground mb-1">Afdeling</p>
                    <p className="font-medium">{request.billingDepartment}</p>
                  </div>
                )}
                {request.billingAttention && (
                  <div>
                    <p className="text-muted-foreground mb-1">T.a.v.</p>
                    <p className="font-medium">{request.billingAttention}</p>
                  </div>
                )}
                {request.billingReference && (
                  <div>
                    <p className="text-muted-foreground mb-1">Referentie</p>
                    <p className="font-medium">{request.billingReference}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
