import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";

export default function AanvraagIntern() {
  const form = useForm();

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Left section - Objectgegevens */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Objectgegevens</h2>
        <div className="space-y-2">
          <div>
            <Label>Local Model:</Label>
            <Select>
              <SelectTrigger className="w-full bg-rose-50">
                <SelectValue placeholder="Andreas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="andreas">Andreas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Object kleur:</Label>
            <Select>
              <SelectTrigger className="w-full bg-rose-50">
                <SelectValue placeholder="RAL7016" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ral7016">RAL7016</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Reclame locatie:</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Enkelzijdig roterend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enkelzijdig">Enkelzijdig roterend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Materiaal:</Label>
            <Input defaultValue="NL-123456" readOnly className="bg-green-50 h-8" />
          </div>

          <div>
            <Label>Object:</Label>
            <Input defaultValue="NL-AB-199009" readOnly className="bg-green-50 h-8" />
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1 bg-blue-600">Kies configuratie</Button>
            <Button size="sm" className="flex-1 bg-blue-600">Bekijk TEMP</Button>
          </div>

          <Button variant="outline" size="sm" className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nieuw object aanmaken
          </Button>
        </div>
      </div>

      {/* Middle section - Locatiegegevens */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Locatiegegevens</h2>
        <div className="space-y-2">
          <div>
            <Label>Commercieel:</Label>
            <Select>
              <SelectTrigger className="w-full bg-rose-50">
                <SelectValue placeholder="A en B zijde commercieel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ab">A en B zijde commercieel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Aanverwante objecten:</Label>
            <Input placeholder="" className="h-8" />
          </div>

          <div>
            <Label>Reclameverlichting:</Label>
            <Select>
              <SelectTrigger className="w-full bg-rose-50">
                <SelectValue placeholder="Met reclame" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="met-reclame">Met reclame</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Right section - Elektrabox */}
      <div>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Elektrabox</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>X:</Label>
                <Input defaultValue="54.123123" readOnly className="bg-green-50 h-8" />
              </div>
              <div>
                <Label>Y:</Label>
                <Input defaultValue="54.123123" readOnly className="bg-green-50 h-8" />
              </div>
            </div>

            <div>
              <Label>Type:</Label>
              <Input defaultValue="Ondergronds" readOnly className="bg-green-50 h-8" />
            </div>

            <Button size="sm" className="w-full bg-blue-600">
              Kies configuratie
            </Button>

            <div>
              <Label>Materiaal:</Label>
              <Input defaultValue="NL-654321" readOnly className="bg-green-50 h-8" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}