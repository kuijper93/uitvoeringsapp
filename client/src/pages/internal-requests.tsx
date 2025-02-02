import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

const mockWorkOrders = [
  { 
    id: "WO-001", 
    status: "ingepland", 
    address: "Verwijderen Apeldoornseweg",
    type: "plaatsing",
    orderDetails: {
      plannedDate: "23-12-2024",
      coordinates: "852.258582",
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
              {filteredWorkOrders.map((order, index) => (
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
              <h2 className="text-sm font-medium">Plaatsen {selectedWorkOrder.orderDetails?.objectNumber} {selectedWorkOrder.orderDetails?.street}</h2>
              <p className="text-xs text-muted-foreground">
                {selectedWorkOrder.id} door Justin
              </p>
              <p className="text-xs text-muted-foreground">
                Ingepland voor {selectedWorkOrder.orderDetails?.plannedDate}
              </p>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm">Opdrachtgegevens</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2 pt-0">
                    <div className="rounded-lg bg-background border p-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-xs space-y-0.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-medium">Aanvrager:</span>
                            <span>Ronald de Wit</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <a href="mailto:dewit@test.nl" className="text-blue-600">dewit@test.nl</a>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tel:</span>
                            <span>06-85285859</span>
                          </div>
                        </div>

                        <div className="text-xs space-y-0.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-medium">Uitvoering:</span>
                            <span>Pietje Put</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <a href="mailto:pietput@test.nl" className="text-blue-600">pietput@test.nl</a>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tel:</span>
                            <span>06-12234578</span>
                          </div>
                        </div>
                      </div>

                      <Separator className="my-1" />

                      <div className="text-xs">
                        <p className="font-medium mb-1">Gemeente notities</p>
                        <Input className="h-6 text-xs" placeholder="Plaats hier notities" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-100 p-2 rounded text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-medium">Gemeente uitvoeringsdatum</label>
                            <p className="text-xs">{selectedWorkOrder.orderDetails?.plannedDate}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium">X, Y coördinaten</label>
                            <p className="text-xs">{selectedWorkOrder.orderDetails?.coordinates}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-2 rounded">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium">Commercieel type</label>
                          <p className="text-xs">{selectedWorkOrder.orderDetails?.commercialType}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium">Reclamelocatie</label>
                          <p className="text-xs">{selectedWorkOrder.orderDetails?.locationType}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium">Aangevraagde services:</label>
                      <div className="grid grid-cols-4 gap-1 mt-1">
                        <div className="flex items-center space-x-1">
                          <Checkbox id="zelf-uitvoeren" className="h-3 w-3" />
                          <label htmlFor="zelf-uitvoeren" className="text-xs">Zelf uitvoeren</label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Checkbox id="elektra" className="h-3 w-3" defaultChecked />
                          <label htmlFor="elektra" className="text-xs">Elektra door JCD</label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Checkbox id="grond-graven" className="h-3 w-3" defaultChecked />
                          <label htmlFor="grond-graven" className="text-xs">Grond graven</label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Checkbox id="herstrate" className="h-3 w-3" defaultChecked />
                          <label htmlFor="herstrate" className="text-xs">Herstraten</label>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Checkbox id="aanvullen" className="h-3 w-3" defaultChecked />
                          <label htmlFor="aanvullen" className="text-xs">Aanvullen</label>
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