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

export default function AanvraagIntern() {
  const form = useForm();

  return (
    <div className="flex gap-4 p-4">
      {/* Left section - Objectgegevens */}
      <Card className="flex-1 p-4">
        <h2 className="text-lg font-semibold mb-4">Objectgegevens</h2>
        <div className="space-y-4">
          <div>
            <Label>Object model:</Label>
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
            <Input value="NL-123456" readOnly className="bg-green-50" />
          </div>

          <div>
            <Label>Object:</Label>
            <Input value="NL-AB-199009" readOnly className="bg-green-50" />
          </div>

          <div className="flex gap-2">
            <Button variant="default" className="bg-blue-600">Kies configuratie</Button>
            <Button variant="default" className="bg-blue-600">Bekijk TEMP</Button>
          </div>

          <div className="mt-4">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <span className="text-xl">+</span>
              Nieuw object aanmaken
            </Button>
          </div>
        </div>
      </Card>

      {/* Right section - Locatiegegevens */}
      <Card className="flex-1 p-4">
        <h2 className="text-lg font-semibold mb-4">Locatiegegevens</h2>
        <div className="space-y-4">
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
            <Input placeholder="Aanverwante objecten" />
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

          {/* Elektrabox subsection */}
          <Card className="p-4 mt-4">
            <h3 className="font-semibold mb-4">Elektrabox</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>X:</Label>
                  <Input value="54.123123" readOnly className="bg-green-50" />
                </div>
                <div>
                  <Label>Y:</Label>
                  <Input value="54.123123" readOnly className="bg-green-50" />
                </div>
              </div>

              <div>
                <Label>Type:</Label>
                <Input value="Ondergronds" readOnly className="bg-green-50" />
              </div>

              <Button variant="default" className="w-full bg-blue-600">
                Kies configuratie
              </Button>

              <div>
                <Label>Materiaal:</Label>
                <Input value="NL-654321" readOnly className="bg-green-50" />
              </div>
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
}
