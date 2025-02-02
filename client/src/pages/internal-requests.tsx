import { useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import type { SelectWorkOrder } from "@db/schema";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ExternalLink } from "lucide-react";

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
  switch (status) {
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

const mockRequests = [
  {
    id: 1,
    orderNumber: "WO-001",
    status: "PENDING",
    municipality: "Amsterdam",
    description: "Plaatsen nieuwe abri",
    requestorName: "Ronald de Wit",
    requestorEmail: "dewit@test.nl",
    requestorPhone: "06-85285859",
    executionContactName: "Pietje Put",
    executionContactEmail: "pietput@test.nl",
    executionContactPhone: "06-12234578",
    furnitureType: "abri",
    abriFormat: "4x2",
    objectNumber: "NL-AB-199009",
    actionType: "plaatsen",
    desiredDate: "2024-12-23",
    installationXCoord: "121766",
    installationYCoord: "487462",
    installationAddress: "Leidseplein 58",
    installationPostcode: "1000AA",
    groundInstallationExcavation: true,
    groundInstallationFilling: true,
    groundInstallationRepaving: true,
    groundInstallationMaterials: true,
    electricalConnect: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    orderNumber: "WO-002",
    status: "IN_PROGRESS",
    municipality: "Rotterdam",
    description: "Verplaatsen mupi",
    requestorName: "Jan Jansen",
    requestorEmail: "jjansen@test.nl",
    requestorPhone: "06-12345678",
    executionContactName: "Klaas Vaak",
    executionContactEmail: "kvaak@test.nl",
    executionContactPhone: "06-87654321",
    furnitureType: "mupi",
    objectNumber: "NL-MP-123456",
    actionType: "verplaatsen",
    desiredDate: "2024-12-24",
    installationXCoord: "92363",
    installationYCoord: "437102",
    installationAddress: "Coolsingel 42",
    installationPostcode: "3011AD",
    groundInstallationExcavation: true,
    groundInstallationFilling: false,
    groundInstallationRepaving: true,
    groundInstallationMaterials: false,
    electricalConnect: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    orderNumber: "WO-003",
    status: "COMPLETED",
    municipality: "Utrecht",
    description: "Nieuwe driehoeksbord",
    requestorName: "Peter Post",
    requestorEmail: "ppost@test.nl",
    requestorPhone: "06-11223344",
    executionContactName: "Hans Helper",
    executionContactEmail: "hhelper@test.nl",
    executionContactPhone: "06-44332211",
    furnitureType: "driehoeksbord",
    objectNumber: "NL-DB-789012",
    actionType: "plaatsen",
    desiredDate: "2024-12-25",
    installationXCoord: "136592",
    installationYCoord: "456215",
    installationAddress: "Vredenburg 40",
    installationPostcode: "3511BD",
    groundInstallationExcavation: true,
    groundInstallationFilling: true,
    groundInstallationRepaving: false,
    groundInstallationMaterials: true,
    electricalConnect: false,
    createdAt: new Date().toISOString()
  }
];

const getCoordinates = (x: string | undefined, y: string | undefined): LatLngTuple => {
  if (!x || !y) return [52.3676, 4.9041];
  const lat = 52.3676 + (Number(y) - 487462) / 100000;
  const lng = 4.9041 + (Number(x) - 121766) / 100000;
  return [lat, lng];
};

export default function InternalRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("alle");
  const [selectedStatus, setSelectedStatus] = useState("alle");

  const [workOrders] = useState(mockRequests);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<(typeof mockRequests)[0] | null>(null);

  useEffect(() => {
    if (workOrders && workOrders.length > 0 && !selectedWorkOrder) {
      setSelectedWorkOrder(workOrders[0]);
    }
  }, [workOrders, selectedWorkOrder]);

  const filteredWorkOrders = workOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "alle" || order.municipality.toLowerCase() === selectedCity.toLowerCase();
    const matchesStatus = selectedStatus === "alle" || order.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesCity && matchesStatus;
  });

  if (!workOrders) {
      return <div>Loading...</div>
  }


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
              {filteredWorkOrders?.map((order) => (
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
                        <div className="col-span-4 relative">
                          <div className="h-[200px] rounded-lg overflow-hidden border">
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

                        {/* Details section - 8 columns (2/3 width) */}
                        <div className="col-span-8">
                          <div className="grid grid-cols-4 gap-4">
                            {/* Column 1 - Date */}
                            <div>
                              <div className="bg-blue-100 p-2 rounded text-xs mb-2">
                                <label className="text-xs font-medium block mb-1">Gewenste datum</label>
                                <p>{selectedWorkOrder.desiredDate}</p>
                              </div>
                              {/* Aangevraagde services Column */}
                              <div className="space-y-2 bg-blue-50 p-2 rounded">
                                <p className="text-xs font-medium mb-1">Aangevraagde services</p>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-1">
                                    <Checkbox id="elektra" className="h-3 w-3" />
                                    <label htmlFor="elektra" className="text-xs">Elektra door JCD</label>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Checkbox id="cunet" className="h-3 w-3" />
                                    <label htmlFor="cunet" className="text-xs">Cunet graven</label>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Checkbox id="herstraten" className="h-3 w-3" />
                                    <label htmlFor="herstraten" className="text-xs">Herstraten</label>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Checkbox id="aanvullen" className="h-3 w-3" />
                                    <label htmlFor="aanvullen" className="text-xs">Aanvullen</label>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Checkbox id="leveren-materiaal" className="h-3 w-3" />
                                    <label htmlFor="leveren-materiaal" className="text-xs">Leveren materiaal</label>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Column 2 - X coordinate */}
                            <div>
                              <div className="bg-blue-100 p-2 rounded text-xs mb-2">
                                <label className="text-xs font-medium block mb-1">X coördinaat</label>
                                <p>{selectedWorkOrder.installationXCoord}</p>
                              </div>
                              {/* Verkeersplan section */}
                              <div className="bg-green-50 p-2 rounded">
                                <p className="text-xs mb-1">Verkeersplan</p>
                                <div className="space-y-1">
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
                                <div className="mt-2 space-y-0.5">
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
                            </div>

                            {/* Column 3 - Y coordinate */}
                            <div>
                              <div className="bg-blue-100 p-2 rounded text-xs mb-2">
                                <label className="text-xs font-medium block mb-1">Y coördinaat</label>
                                <p>{selectedWorkOrder.installationYCoord}</p>
                              </div>
                              {/* Aannemer section */}
                              <div className="bg-green-50 p-2 rounded">
                                <div className="grid gap-1">
                                  <div>
                                    <label className="text-xs block mb-0.5">Aannemer</label>
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
                                    <label className="text-xs block mb-0.5">Prio</label>
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
                                  <div>
                                    <label className="text-xs block mb-0.5">Combi</label>
                                    <Input className="h-6 text-xs" placeholder="Voer combi in" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Column 4 - Gemeente notities */}
                            <div>
                              <div className="bg-gray-50 p-2 rounded h-full">
                                <label className="text-xs block mb-1">Gemeente notities</label>
                                <textarea 
                                  className="w-full h-[calc(100%-1.5rem)] text-xs p-2 rounded border border-input bg-white resize-none focus:outline-none focus:ring-1 focus:ring-ring" 
                                  placeholder="Plaats hier notities"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Object Details Section */}
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Objectgegevens</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 pt-0">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-orange-50 p-2 rounded">
                          <label className="text-xs font-medium">Type straatmeubilair</label>
                          <p className="text-xs">{selectedWorkOrder.furnitureType}</p>
                        </div>
                        <div className="bg-orange-50 p-2 rounded">
                          <label className="text-xs font-medium">Abri formaat</label>
                          <p className="text-xs">{selectedWorkOrder.abriFormat || '-'}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-orange-50 p-2 rounded">
                          <label className="text-xs font-medium">Objectnummer</label>
                          <p className="text-xs">{selectedWorkOrder.objectNumber || '-'}</p>
                        </div>
                        <div className="bg-orange-50 p-2 rounded">
                          <label className="text-xs font-medium">Type actie</label>
                          <p className="text-xs">{selectedWorkOrder.actionType}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
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