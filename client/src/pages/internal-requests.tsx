import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const mockWorkOrders = [
  { 
    id: "WO-001", 
    status: "ingepland", 
    address: "Verwijderen Apeldoornseweg",
    type: "plaatsing",
    orderDetails: {
      plannedDate: "23-12-2024",
      xCoord: "852.258",
      yCoord: "58582",
      street: "Leidseplein 58",
      postalCode: "1000AA",
      city: "Amsterdam",
      objectModel: "Abdriss",
      objectColor: "RAL7016",
      material: "NL-123456",
      objectNumber: "NL-AB-199009",
      commercialType: "A en B pijl commercieel",
      locationType: "Met reclame"
    },
    contacts: {
      requester: {
        name: "Ronald de Wit",
        email: "dewit@test.nl",
        phone: "06-85285859"
      },
      execution: {
        name: "Pietje Put",
        email: "pietput@test.nl",
        phone: "06-12234578"
      },
      notes: "Steen huis Straatwerk / 06-85285859"
    }
  },
  { id: "WO-002", status: "open", address: "Verplaatsen Arnhemseweg", orderDetails: { city: "Arnhem" } },
  { id: "WO-003", status: "ingepland", address: "Verplaatsen Rotterdamseweg", orderDetails: { city: "Rotterdam" } },
  { id: "WO-004", status: "uitgevoerd", address: "Plaatsen Amsterdamestraat", orderDetails: { city: "Amsterdam" } },
  { id: "WO-005", status: "aanvraagfase", address: "Verwijderen Utrechtseweg", orderDetails: { city: "Utrecht" } },
];

const statuses = ["alle", "ingepland", "open", "uitgevoerd", "aanvraagfase"];
const cities = ["alle", "Amsterdam", "Rotterdam", "Utrecht", "Arnhem", "Apeldoorn"];

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

const getCoordinates = (x: string | undefined, y: string | undefined): LatLngTuple => {
  if (!x || !y) return [52.3676, 4.9041]; // Default to Amsterdam
  return [Number(x) / 1000 || 52.3676, Number(y) / 1000 || 4.9041];
};

export default function InternalRequests() {
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(mockWorkOrders[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("alle");
  const [selectedStatus, setSelectedStatus] = useState("alle");

  const filteredWorkOrders = mockWorkOrders.filter(order => {
    const matchesSearch = order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === "alle" || order.orderDetails?.city === selectedCity;
    const matchesStatus = selectedStatus === "alle" || order.status === selectedStatus;
    return matchesSearch && matchesCity && matchesStatus;
  });

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
                  <SelectContent>
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
                  <SelectContent>
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
                    selectedWorkOrder.id === order.id && "bg-gray-50 border-primary"
                  )}
                  onClick={() => setSelectedWorkOrder(order)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{order.id}</span>
                    <span className={cn("text-xs font-medium", getStatusColor(order.status))}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">{order.address}</div>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={85}>
          <div className="flex h-full flex-col">
            <div className="border-b p-3">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-sm font-medium">Plaatsen {selectedWorkOrder.orderDetails?.objectNumber} {selectedWorkOrder.orderDetails?.street}</h2>
                  <p className="text-xs text-muted-foreground">
                    {selectedWorkOrder.id} door Justin
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ingepland voor {selectedWorkOrder.orderDetails?.plannedDate}
                  </p>
                </div>

                {/* Contact Information in header */}
                <div className="flex gap-6">
                  {/* Aanvrager Contact */}
                  <div className="bg-gray-50 p-2 rounded-lg min-w-[300px]">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xs font-medium">Aanvrager:</h3>
                      <span className="text-xs">{selectedWorkOrder.contacts?.requester.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedWorkOrder.contacts?.requester.phone} / 
                      <a href={`mailto:${selectedWorkOrder.contacts?.requester.email}`} className="text-blue-600 hover:underline ml-1">
                        {selectedWorkOrder.contacts?.requester.email}
                      </a>
                    </div>
                  </div>

                  {/* Execution Contact */}
                  <div className="bg-gray-50 p-2 rounded-lg min-w-[300px]">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xs font-medium">Uitvoering:</h3>
                      <span className="text-xs">{selectedWorkOrder.contacts?.execution.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {selectedWorkOrder.contacts?.execution.phone} / 
                      <a href={`mailto:${selectedWorkOrder.contacts?.execution.email}`} className="text-blue-600 hover:underline ml-1">
                        {selectedWorkOrder.contacts?.execution.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Opdrachtgegevens</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2 pt-0">
                    <div className="grid grid-cols-12 gap-4">
                      {/* Map section - 4 columns (1/3 width) */}
                      <div className="col-span-4 h-[200px] rounded-lg overflow-hidden border">
                        <MapContainer
                          center={getCoordinates(
                            selectedWorkOrder.orderDetails?.xCoord,
                            selectedWorkOrder.orderDetails?.yCoord
                          )}
                          zoom={13}
                          style={{ height: "100%", width: "100%" }}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          />
                          <Marker position={getCoordinates(
                            selectedWorkOrder.orderDetails?.xCoord,
                            selectedWorkOrder.orderDetails?.yCoord
                          )}>
                            <Popup>
                              {selectedWorkOrder.orderDetails?.street || 'Location'}
                            </Popup>
                          </Marker>
                        </MapContainer>
                      </div>

                      {/* Details section - 8 columns (2/3 width) */}
                      <div className="col-span-8 space-y-2">
                        <div className="bg-blue-100 p-2 rounded text-xs">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-xs font-medium">Gemeente uitvoeringsdatum</label>
                              <p className="text-xs">{selectedWorkOrder.orderDetails?.plannedDate}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium">X coördinaat</label>
                              <p className="text-xs">{selectedWorkOrder.orderDetails?.xCoord}</p>
                            </div>
                            <div>
                              <label className="text-xs font-medium">Y coördinaat</label>
                              <p className="text-xs">{selectedWorkOrder.orderDetails?.yCoord}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 p-2 rounded">
                          <label className="text-xs font-medium block mb-1">Aangevraagde services:</label>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="flex items-center space-x-1">
                              <Checkbox id="elektra" className="h-3 w-3" defaultChecked />
                              <label htmlFor="elektra" className="text-xs">Elektra door JCD</label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Checkbox id="zelf-uitvoeren" className="h-3 w-3" />
                              <label htmlFor="zelf-uitvoeren" className="text-xs">Zelf uitvoeren</label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Checkbox id="grond-graven" className="h-3 w-3" defaultChecked />
                              <label htmlFor="grond-graven" className="text-xs">Grond graven</label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Checkbox id="aanvullen" className="h-3 w-3" defaultChecked />
                              <label htmlFor="aanvullen" className="text-xs">Aanvullen</label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Checkbox id="herstrate" className="h-3 w-3" defaultChecked />
                              <label htmlFor="herstrate" className="text-xs">Herstraten</label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Checkbox id="vergunning" className="h-3 w-3" />
                              <label htmlFor="vergunning" className="text-xs">Vergunning</label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Checkbox id="leveren-materiaal" className="h-3 w-3" defaultChecked />
                              <label htmlFor="leveren-materiaal" className="text-xs">Leveren materiaal</label>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Checkbox id="klic" className="h-3 w-3" defaultChecked />
                              <label htmlFor="klic" className="text-xs">Klic</label>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 p-2 rounded">
                          <label className="text-xs font-medium block mb-1">Gemeente notities</label>
                          <Input className="h-6 text-xs" placeholder="Plaats hier notities" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Objectgegevens</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2 pt-0">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-orange-100 p-2 rounded">
                        <label className="text-xs font-medium">Object model</label>
                        <p className="text-xs">{selectedWorkOrder.orderDetails?.objectModel}</p>
                      </div>
                      <div className="bg-orange-100 p-2 rounded">
                        <label className="text-xs font-medium">Object kleur</label>
                        <p className="text-xs">{selectedWorkOrder.orderDetails?.objectColor}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-orange-100 p-2 rounded">
                        <label className="text-xs font-medium">Materiaal</label>
                        <p className="text-xs">{selectedWorkOrder.orderDetails?.material}</p>
                      </div>
                      <div className="bg-orange-100 p-2 rounded">
                        <label className="text-xs font-medium">Object</label>
                        <p className="text-xs">{selectedWorkOrder.orderDetails?.objectNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="nieuw" className="h-3 w-3" />
                      <label htmlFor="nieuw" className="text-xs">Nieuw object aanmaken</label>
                    </div>
                  </CardContent>
                </Card>

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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}