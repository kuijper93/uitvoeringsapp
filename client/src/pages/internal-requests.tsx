import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import type { SelectWorkOrder } from "@db/schema";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const statuses = ["alle", "ingepland", "open", "uitgevoerd", "aanvraagfase"] as const;
const cities = ["alle", "Amsterdam", "Rotterdam", "Utrecht", "Arnhem", "Apeldoorn"] as const;

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "ingepland":
      return "text-yellow-600";
    case "open":
      return "text-blue-600";
    case "uitgevoerd":
      return "text-green-600";
    case "aanvraagfase":
      return "text-purple-600";
    default:
      return "text-gray-600";
  }
};

const getCoordinates = (x: string | undefined, y: string | undefined): LatLngTuple => {
  if (!x || !y) return [52.3676, 4.9041];
  const lat = 52.3676 + (Number(y) - 487462) / 100000;
  const lng = 4.9041 + (Number(x) - 121766) / 100000;
  return [lat, lng];
};

export default function InternalRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("alle");
  const [selectedStatus, setSelectedStatus] = useState<string>("alle");
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<SelectWorkOrder | null>(null);

  // Fetch work orders
  const { data: workOrders, isLoading } = useQuery({
    queryKey: ['/api/work-orders'],
    queryFn: async () => {
      const response = await apiRequest<SelectWorkOrder[]>('GET', '/api/work-orders');
      return response;
    }
  });

  // Update work order mutation
  const updateWorkOrder = useMutation({
    mutationFn: async (data: Partial<SelectWorkOrder>) => {
      if (!selectedWorkOrder?.id) return;
      return await apiRequest('PATCH', `/api/work-orders/${selectedWorkOrder.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/work-orders'] });
      toast({
        title: "Werkorder bijgewerkt",
        description: "De wijzigingen zijn succesvol opgeslagen.",
      });
    },
    onError: () => {
      toast({
        title: "Fout bij bijwerken",
        description: "Er is een fout opgetreden bij het opslaan van de wijzigingen.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (workOrders && workOrders.length > 0 && !selectedWorkOrder) {
      setSelectedWorkOrder(workOrders[0]);
    }
  }, [workOrders, selectedWorkOrder]);

  const filteredWorkOrders = workOrders?.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "alle" || order.municipality.toLowerCase() === selectedCity.toLowerCase();
    const matchesStatus = selectedStatus === "alle" || order.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesCity && matchesStatus;
  }) || [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleServiceChange = async (service: string, checked: boolean) => {
    if (!selectedWorkOrder) return;

    const updates: Partial<SelectWorkOrder> = {
      [`${service}`]: checked,
    };

    updateWorkOrder.mutate(updates);
  };

  return (
    <div className="h-[calc(100vh-6rem)]">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg border"
      >
        <ResizablePanel defaultSize={15}>
          <div className="flex h-full flex-col">
            <div className="space-y-2 px-3 py-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Zoeken" 
                  className="pl-8 text-xs" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Stad" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {cities.map((city) => (
                      <SelectItem key={city} value={city} className="text-xs">
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status} className="text-xs">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Separator />
            <div className="flex-1 overflow-auto px-3 py-2">
              {filteredWorkOrders.map((order) => (
                <div
                  key={order.id}
                  className={cn(
                    "mb-2 cursor-pointer rounded-lg border p-2 hover:bg-gray-50",
                    selectedWorkOrder?.id === order.id && "bg-gray-50 border-primary"
                  )}
                  onClick={() => setSelectedWorkOrder(order)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{order.orderNumber}</span>
                    <span className={cn("text-xs font-medium", getStatusColor(order.status))}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">{order.municipality}</div>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={85}>
          {selectedWorkOrder && (
            <div className="flex h-full flex-col">
              <div className="border-b p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-sm font-medium">
                      {selectedWorkOrder.orderNumber} - {selectedWorkOrder.municipality}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Ingepland voor {selectedWorkOrder.desiredDate}
                    </p>
                  </div>
                  <div className="flex gap-6">
                    <div className="bg-gray-50 p-2 rounded-lg min-w-[300px]">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-medium">Aanvrager:</h3>
                        <span className="text-xs">{selectedWorkOrder.requestorName}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {selectedWorkOrder.requestorPhone} / 
                        <a href={`mailto:${selectedWorkOrder.requestorEmail}`} className="text-blue-600 hover:underline ml-1">
                          {selectedWorkOrder.requestorEmail}
                        </a>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-2 rounded-lg min-w-[300px]">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-xs font-medium">Uitvoering:</h3>
                        <span className="text-xs">{selectedWorkOrder.executionContactName}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {selectedWorkOrder.executionContactPhone} / 
                        <a href={`mailto:${selectedWorkOrder.executionContactEmail}`} className="text-blue-600 hover:underline ml-1">
                          {selectedWorkOrder.executionContactEmail}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-4">
                  <Card>
                    <CardContent className="grid gap-2">
                      <div className="grid grid-cols-12 gap-4">
                        {/* Map section - 4 columns (1/3 width) */}
                        <div className="col-span-4 flex items-center">
                          <div className="relative w-full">
                            <div className="h-[300px] rounded-lg overflow-hidden border">
                              <MapContainer
                                center={getCoordinates(
                                  selectedWorkOrder.installationXCoord,
                                  selectedWorkOrder.installationYCoord
                                )}
                                zoom={13}
                                style={{ height: "100%", width: "100%" }}
                              >
                                <TileLayer
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <Marker position={getCoordinates(
                                  selectedWorkOrder.installationXCoord,
                                  selectedWorkOrder.installationYCoord
                                )}>
                                  <Popup>
                                    {selectedWorkOrder.installationAddress || 'Location'}
                                  </Popup>
                                </Marker>
                              </MapContainer>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="absolute top-2 right-2 z-[1000] bg-white"
                              onClick={() => {
                                const [lat, lng] = getCoordinates(
                                  selectedWorkOrder.installationXCoord,
                                  selectedWorkOrder.installationYCoord
                                );
                                window.open(
                                  `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat},${lng}`,
                                  '_blank'
                                );
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Street View
                            </Button>
                          </div>
                        </div>

                        {/* Details section - 8 columns (2/3 width) */}
                        <div className="col-span-8">
                          <div className="grid grid-cols-4 gap-4 pt-6">
                            {/* Row 1: Opmerkingen */}
                            <div className="bg-gray-50 p-2 rounded h-[200px]">
                              <label className="text-xs block mb-1">Opmerkingen</label>
                              <textarea 
                                className="w-full h-[calc(100%-1.5rem)] text-xs p-2 rounded border border-input bg-white resize-none focus:outline-none focus:ring-1 focus:ring-ring" 
                                placeholder="Plaats hier notities"
                              />
                            </div>

                            {/* Combined blue sections */}
                            <div className="col-span-3">
                              {/* Top blue section */}
                              <div className="bg-blue-100 p-2 rounded text-xs mb-4">
                                <div className="grid grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-xs font-medium block mb-1">Gewenste datum</label>
                                    <p>{selectedWorkOrder.desiredDate}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium block mb-1">X coördinaat</label>
                                    <p>{selectedWorkOrder.installationXCoord}</p>
                                  </div>
                                  <div>
                                    <label className="text-xs font-medium block mb-1">Y coördinaat</label>
                                    <p>{selectedWorkOrder.installationYCoord}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Bottom sections grid */}
                              <div className="grid grid-cols-3 gap-4">
                                {/* Services section (now blue-100) */}
                                <div className="bg-blue-100 p-2 rounded h-[160px] flex flex-col justify-between">
                                  <div>
                                    <p className="text-xs font-medium mb-2">Aangevraagde services</p>
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-1">
                                        <Checkbox 
                                          id="elektra" 
                                          className="h-3 w-3"
                                          checked={selectedWorkOrder.electricalConnect}
                                          onCheckedChange={(checked) => handleServiceChange('electricalConnect', !!checked)}
                                        />
                                        <label htmlFor="elektra" className="text-xs">Elektra door JCD</label>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Checkbox 
                                          id="cunet" 
                                          className="h-3 w-3"
                                          checked={selectedWorkOrder.groundInstallationExcavation}
                                           onCheckedChange={(checked) => handleServiceChange('groundInstallationExcavation', !!checked)}
                                        />
                                        <label htmlFor="cunet" className="text-xs">Cunet graven</label>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Checkbox 
                                          id="herstraten" 
                                          className="h-3 w-3"
                                          checked={selectedWorkOrder.groundInstallationRepaving}
                                          onCheckedChange={(checked) => handleServiceChange('groundInstallationRepaving', !!checked)}
                                        />
                                        <label htmlFor="herstraten" className="text-xs">Herstraten</label>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Checkbox 
                                          id="aanvullen" 
                                          className="h-3 w-3"
                                           checked={selectedWorkOrder.groundInstallationFilling}
                                           onCheckedChange={(checked) => handleServiceChange('groundInstallationFilling', !!checked)}
                                        />
                                        <label htmlFor="aanvullen" className="text-xs">Aanvullen</label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Checkbox 
                                          id="leveren-materiaal" 
                                          className="h-3 w-3"
                                          checked={selectedWorkOrder.groundInstallationMaterials}
                                           onCheckedChange={(checked) => handleServiceChange('groundInstallationMaterials', !!checked)}
                                        />
                                    <label htmlFor="leveren-materiaal" className="text-xs">Leveren materiaal</label>
                                  </div>
                                </div>

                                {/* Green sections */}
                                <div className="col-span-2 bg-green-50 p-2 rounded h-[160px]">
                                  <div className="grid grid-cols-2 gap-4 h-full">
                                    {/* Left side - Verkeersplan */}
                                    <div className="flex flex-col justify-between">
                                      <div>
                                        <p className="text-xs font-medium mb-2">Verkeersplan</p>
                                        <div className="space-y-2">
                                          <Select defaultValue="geen">
                                            <SelectTrigger className="h-6 text-xs py-0">
                                              <SelectValue placeholder="Selecteer optie" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                              <SelectItem value="zelf" className="text-xs">Zelf uitvoeren</SelectItem>
                                              <SelectItem value="werk" className="text-xs">In het werk</SelectItem>
                                              <SelectItem value="buko" className="text-xs">BUKO</SelectItem>
                                              <SelectItem value="geen" className="text-xs">Geen</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex items-center space-x-1">
                                          <Checkbox id="vergunning" className="h-3 w-3" />
                                          <label htmlFor="vergunning" className="text-xs">Vergunning</label>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Checkbox id="moor" className="h-3 w-3" />
                                          <label htmlFor="moor" className="text-xs">Moor</label>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Checkbox id="aarding" className="h-3 w-3" />
                                          <label htmlFor="aarding" className="text-xs">Aarding</label>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Checkbox id="klic" className="h-3 w-3" />
                                          <label htmlFor="klic" className="text-xs">Klic</label>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Right side - Aannemer */}
                                    <div className="flex flex-col justify-between">
                                      <div className="space-y-2">
                                        <div>
                                          <label className="text-xs block mb-1">Aannemer</label>
                                          <Select defaultValue="geen">
                                            <SelectTrigger className="h-6 text-xs py-0">
                                              <SelectValue placeholder="Selecteer aannemer" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                              <SelectItem value="geen" className="text-xs">Geen aannemer</SelectItem>
                                              <SelectItem value="henk" className="text-xs">Aannemer Henk</SelectItem>
                                              <SelectItem value="piet" className="text-xs">Aannemer Piet</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div>
                                          <label className="text-xs block mb-1">Prio</label>
                                          <Select defaultValue="geen">
                                            <SelectTrigger className="h-6 text-xs py-0">
                                              <SelectValue placeholder="Selecteer prio" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                              <SelectItem value="geen" className="text-xs">Geen prio</SelectItem>
                                              <SelectItem value="high" className="text-xs">High</SelectItem>
                                              <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                                              <SelectItem value="low" className="text-xs">Low</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-xs block mb-1">Combi</label>
                                        <Input className="h-6 text-xs" placeholder="Voer combi in" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Object Details Section */}
                  <Card className="w-1/2">
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Objectgegevens</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Top section - Request info */}
                      <div className="bg-white p-3 rounded border">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Aanvraagnummer</p>
                            <p className="text-sm font-medium">{selectedWorkOrder.orderNumber}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Gemeente</p>
                            <p className="text-sm font-medium">{selectedWorkOrder.municipality}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-xs text-gray-500">Type actie</p>
                            <p className="text-sm font-medium">{selectedWorkOrder.actionType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Local Model</p>
                            <p className="text-sm font-medium">{selectedWorkOrder.furnitureType}</p>
                          </div>
                        </div>
                      </div>

                      {/* Middle section - Material and Configuration */}
                      <div className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-500">Materiaal</p>
                            <p className="text-sm font-medium">Standaard</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Kies configuratie
                          </Button>
                        </div>
                      </div>

                      {/* Bottom section - Object number and stock */}
                      <div className="bg-white p-3 rounded border">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-500">Objectnummer</p>
                            <p className="text-sm font-medium">{selectedWorkOrder.objectNumber || '-'}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            TEMP voorraad bekijken
                          </Button>
                        </div>
                      </div>

                      {/* New object checkbox */}
                      <div className="flex items-center space-x-2 px-3">
                        <Checkbox id="nieuw" className="h-3 w-3" />
                        <label htmlFor="nieuw" className="text-xs">Nieuw object aanmaken</label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" className="w-full text-xs p-2 h-auto">
                      Exporteer object/locatie gegevens
                    </Button>
                    <Button variant="outline" className="w-full text-xs p-2 h-auto">
                      Gereed voor uitvoering
                    </Button>
                    <Button variant="outline" className="w-full text-xs p-2 h-auto">
                      Document uploaden
                    </Button>
                    <Button variant="outline" className="w-full text-xs p-2 h-auto">
                      Naar documenten
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}