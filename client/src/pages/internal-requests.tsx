import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Status list data with work order information
const mockWorkOrders = [
  { 
    id: "WO-001", 
    status: "ingepland", 
    address: "Verwijderen Apeldoornseweg",
    type: "plaatsing",
    orderDetails: {
      plannedDate: "23-12-2024",
      coordinates: "852.258582",
      street: "Apeldoornseweg 58",
      postalCode: "1000AA",
      city: "Apeldoorn",
      objectModel: "Abdriss",
      objectColor: "RAL7016",
      material: "NL-123456",
      objectNumber: "NL-AB-199009"
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
  { id: "WO-002", status: "open", address: "Verplaatsen Arnhemseweg" },
  { id: "WO-003", status: "ingepland", address: "Verplaatsen Rotterdamseweg" },
  { id: "WO-004", status: "uitgevoerd", address: "Plaatsen Amsterdamestraat" },
  { id: "WO-005", status: "aanvraagfase", address: "Verwijderen Utrechtseweg" },
];

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

  // Filter work orders based on search query
  const filteredWorkOrders = mockWorkOrders.filter(order => 
    order.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6rem)]">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg border"
      >
        {/* Left Panel - Work Orders List */}
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="flex h-full flex-col">
            <div className="px-3 py-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Zoeken" 
                  className="pl-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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

        {/* Middle Panel - Work Order Details */}
        <ResizablePanel defaultSize={45}>
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold">{selectedWorkOrder.address}</h2>
              <p className="text-sm text-muted-foreground">
                Ingepland voor {selectedWorkOrder.orderDetails?.plannedDate || 'Niet gepland'}
              </p>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-base">Opdrachtgegevens</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Gemeente uitvoeringsdatum</label>
                      <p className="text-sm">{selectedWorkOrder.orderDetails?.plannedDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">X, Y coördinaten</label>
                      <p className="text-sm">{selectedWorkOrder.orderDetails?.coordinates}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Straat</label>
                    <p className="text-sm">{selectedWorkOrder.orderDetails?.street}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Postcode</label>
                    <p className="text-sm">{selectedWorkOrder.orderDetails?.postalCode}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Stad</label>
                    <p className="text-sm">{selectedWorkOrder.orderDetails?.city}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Objectgegevens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Object model</label>
                    <p className="text-sm">{selectedWorkOrder.orderDetails?.objectModel}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Object kleur</label>
                    <p className="text-sm">{selectedWorkOrder.orderDetails?.objectColor}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Materiaal</label>
                    <p className="text-sm">{selectedWorkOrder.orderDetails?.material}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Object</label>
                    <p className="text-sm">{selectedWorkOrder.orderDetails?.objectNumber}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="nieuw" />
                    <label htmlFor="nieuw" className="text-sm">Nieuw object aanmaken</label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Contact Information */}
        <ResizablePanel defaultSize={35}>
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <h3 className="font-semibold">Contact gemeente</h3>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Aanvrager</label>
                      <p className="text-sm">{selectedWorkOrder.contacts?.requester.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact</label>
                      <p className="text-sm text-blue-600">{selectedWorkOrder.contacts?.requester.email}</p>
                      <p className="text-sm">{selectedWorkOrder.contacts?.requester.phone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-base">Uitvoering</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Contact</label>
                    <p className="text-sm text-blue-600">{selectedWorkOrder.contacts?.execution.email}</p>
                    <p className="text-sm">{selectedWorkOrder.contacts?.execution.phone}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Overige opmerkingen</label>
                      <p className="text-sm">{selectedWorkOrder.contacts?.notes}</p>
                    </div>
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