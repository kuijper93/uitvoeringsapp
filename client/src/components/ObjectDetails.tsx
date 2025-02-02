import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function ObjectDetails() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Objectgegevens Section */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Objectgegevens</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Object model:</label>
            <Select defaultValue="andreas">
              <SelectTrigger className="bg-rose-50">
                <SelectValue placeholder="Andreas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="andreas">Andreas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Object kleur:</label>
            <Select defaultValue="ral7016">
              <SelectTrigger className="bg-rose-50">
                <SelectValue placeholder="RAL7016" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ral7016">RAL7016</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Reclame locatie:</label>
            <Select defaultValue="enkelzijdig">
              <SelectTrigger className="bg-rose-50">
                <SelectValue placeholder="Enkelzijdig roterend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enkelzijdig">Enkelzijdig roterend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-green-100 p-2 rounded">
            <Input value="Materiaal: NL-123456" readOnly className="bg-transparent border-none" />
          </div>

          <div className="bg-green-100 p-2 rounded">
            <Input value="Object: NL-AB-199009" readOnly className="bg-transparent border-none" />
          </div>

          <Button variant="outline" className="w-full flex items-center gap-1 justify-start">
            <span className="text-lg">+</span> Nieuw object aanmaken
          </Button>

          <div className="flex gap-2">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white flex-1">
              Kies configuratie
            </Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white flex-1">
              Bekijk TEMP
            </Button>
          </div>
        </div>
      </Card>

      {/* Locatiegegevens Section */}
      <div className="space-y-4">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Locatiegegevens</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Commercieel:</label>
              <Select defaultValue="ab-commercial">
                <SelectTrigger className="bg-rose-50">
                  <SelectValue placeholder="A en B zijde commercieel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ab-commercial">A en B zijde commercieel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Aanverwante objecten:</label>
              <Select>
                <SelectTrigger className="bg-rose-50">
                  <SelectValue placeholder="Met reclame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="met-reclame">Met reclame</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Reclametype:</label>
              <Select defaultValue="met-reclame">
                <SelectTrigger className="bg-rose-50">
                  <SelectValue placeholder="Met reclame" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="met-reclame">Met reclame</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Elektrabox Section */}
        <Card className="p-4">
          <h3 className="text-md font-semibold mb-3">Elektrabox</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-green-100 p-2 rounded">
                <Input value="X: 54.123123" readOnly className="bg-transparent border-none" />
              </div>
              <div className="bg-green-100 p-2 rounded">
                <Input value="Y: 54.123123" readOnly className="bg-transparent border-none" />
              </div>
            </div>

            <div className="bg-green-100 p-2 rounded">
              <Input value="Type: Ondergronds" readOnly className="bg-transparent border-none" />
            </div>

            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
              Kies configuratie
            </Button>

            <div className="bg-green-100 p-2 rounded">
              <Input value="Materiaal: NL-654321" readOnly className="bg-transparent border-none" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}