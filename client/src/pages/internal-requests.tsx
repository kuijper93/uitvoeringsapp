import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

// Status list data
const statusList = [
  { id: "456789", status: "ingepland", address: "Verwijderen Apeldoornseweg" },
  { id: "000000", status: "open", address: "Verplaatsen Arnhemseweg" },
  { id: "456789", status: "ingepland", address: "Verplaatsen Rotterdamseweg" },
  { id: "456789", status: "uitgevoerd", address: "Plaatsen Amsterdamestraat" },
  { id: "456789", status: "aanvraagfase", address: "Verwijderen Utrechtseweg" },
  { id: "456789", status: "aanvraagfase", address: "Verwijderen Almerenseweg" },
  { id: "456789", status: "aanvraagfase", address: "Plaatsen Amsterdamseweg" },
  { id: "456789", status: "uitgevoerd", address: "Plaatsen Utrechtseweg" },
  { id: "456789", status: "uitgevoerd", address: "Plaatsen Maarssen" },
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
  return (
    <div className="h-[calc(100vh-6rem)]">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg border"
      >
        {/* Left Panel - Status List */}
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="flex h-full flex-col">
            <div className="px-3 py-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Zoeken" className="pl-8" />
              </div>
            </div>
            <Separator />
            <div className="flex-1 overflow-auto px-3 py-2">
              {statusList.map((item, index) => (
                <div
                  key={index}
                  className="mb-2 cursor-pointer rounded-lg border p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.id}</span>
                    <span className={cn("text-sm font-medium", getStatusColor(item.status))}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-600">{item.address}</div>
                </div>
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Middle Panel - Details */}
        <ResizablePanel defaultSize={45}>
          <div className="flex h-full flex-col">
            <div className="border-b p-4">
              <h2 className="text-lg font-semibold">Plaatsen NL-AB-199009 Leidseplein</h2>
              <p className="text-sm text-muted-foreground">Ingepland voor 23-12-2024</p>
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
                      <p className="text-sm">23-12-2024</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">X, Y coördinaten</label>
                      <p className="text-sm">852.258582</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Straat</label>
                    <p className="text-sm">Leidseplein 58</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Postcode</label>
                    <p className="text-sm">1000AA</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Stad</label>
                    <p className="text-sm">Amsterdam</p>
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
                    <p className="text-sm">Abdriss</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Object kleur</label>
                    <p className="text-sm">RAL7016</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Materiaal</label>
                    <p className="text-sm">NL-123456</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Object</label>
                    <p className="text-sm">NL-AB-199009</p>
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

        {/* Right Panel - Contact */}
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
                      <p className="text-sm">Ronald de Wit</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Contact</label>
                      <p className="text-sm text-blue-600">dewit@test.nl</p>
                      <p className="text-sm">06-85285859</p>
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
                    <p className="text-sm text-blue-600">pietput@test.nl</p>
                    <p className="text-sm">06-12234578</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Overige opmerkingen</label>
                      <p className="text-sm">Steen huis Straatwerk / 06-85285859</p>
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
