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
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="flex h-full flex-col">
            <div className="space-y-2 px-3 py-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Zoeken" 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Stad" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
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
                    "mb-2 cursor-pointer rounded-lg border p-3 hover:bg-gray-50",
                    selectedWorkOrder.id === order.id && "bg-gray-50 border-primary"
                  )}
                  onClick={() => setSelectedWorkOrder(order)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{order.id}</span>
                    <span className={cn("text-sm font-medium", getStatusColor(order.status))}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{order.address}</div>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={45}>
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold">Plaatsen {selectedWorkOrder.orderDetails?.objectNumber} {selectedWorkOrder.orderDetails?.street}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedWorkOrder.id} door Justin
              </p>
              <p className="text-sm text-muted-foreground">
                Ingepland voor {selectedWorkOrder.orderDetails?.plannedDate}
              </p>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Opdrachtgegevens</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 pt-0">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-100 p-2 rounded text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium">Gemeente uitvoeringsdatum</label>
                          <p className="text-sm">{selectedWorkOrder.orderDetails?.plannedDate}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium">X, Y coördinaten</label>
                          <p className="text-sm">{selectedWorkOrder.orderDetails?.coordinates}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-orange-50 p-2 rounded">
                    <div className="space-y-2">
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
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="elektra" />
                        <label htmlFor="elektra" className="text-xs">Elektra door JCD</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="graaf" />
                        <label htmlFor="graaf" className="text-xs">Graaf graven</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="vergunning" />
                        <label htmlFor="vergunning" className="text-xs">Vergunning</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="materiaal" />
                        <label htmlFor="materiaal" className="text-xs">Materiaal</label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-base">Objectgegevens</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 pt-0">
                  <div className="grid grid-cols-2 gap-3">
                     <div className="bg-orange-100 p-2 rounded">
                      <label className="text-xs font-medium">Object model</label>
                      <p className="text-sm">{selectedWorkOrder.orderDetails?.objectModel}</p>
                    </div>
                    <div className="bg-orange-100 p-2 rounded">
                      <label className="text-xs font-medium">Object kleur</label>
                      <p className="text-sm">{selectedWorkOrder.orderDetails?.objectColor}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-orange-100 p-2 rounded">
                      <label className="text-xs font-medium">Materiaal</label>
                      <p className="text-sm">{selectedWorkOrder.orderDetails?.material}</p>
                    </div>
                     <div className="bg-orange-100 p-2 rounded">
                      <label className="text-xs font-medium">Object</label>
                      <p className="text-sm">{selectedWorkOrder.orderDetails?.objectNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox id="nieuw" />
                    <label htmlFor="nieuw" className="text-xs">Nieuw object aanmaken</label>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" className="w-full text-xs">
                  Exporteer object/locatie gegevens
                </Button>
                <Button variant="outline" className="w-full text-xs">
                  Gereed voor uitvoering
                </Button>
                <Button variant="outline" className="w-full text-xs">
                  Document uploaden
                </Button>
                <Button variant="outline" className="w-full text-xs">
                  Naar documenten
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={35}>
            <div className="flex h-full flex-col">
              <div className="border-b p-4">
                <h3 className="font-semibold">Contact gemeente</h3>
              </div>
              <div className="flex-1 overflow-auto p-4 space-y-4">
               <Card>
                  <CardContent className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Aanvrager</label>
                        <p className="text-sm">{selectedWorkOrder.contacts?.requester.name}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <label className="text-xs font-medium">Contact</label>
                          <p className="text-xs text-blue-600">{selectedWorkOrder.contacts?.requester.email}</p>
                         <p className="text-xs">{selectedWorkOrder.contacts?.requester.phone}</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <label className="text-xs font-medium">Uitvoering</label>
                          <p className="text-xs text-blue-600">{selectedWorkOrder.contacts?.execution.email}</p>
                          <p className="text-xs">{selectedWorkOrder.contacts?.execution.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-3">
                        <div className="space-y-1">
                            <label className="text-xs font-medium">Notities</label>
                            <p className="text-sm">{selectedWorkOrder.contacts?.notes}</p>
                         </div>
                   </CardContent>
                </Card>
              <Card>
                 <CardContent className="pt-3">
                    <div className="space-y-1">
                       <label className="text-xs font-medium">Gemeente notities</label>
                      <Input className="text-sm" placeholder="Plaats hier notities" />
                    </div>
                </CardContent>
             </Card>
           </div>
         </div>
       </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}