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
    <div className="grid grid-cols-3 gap-1 p-1">
      {/* Left section - Objectgegevens */}
      <div>
        <h2 className="text-xs font-semibold mb-0.5">Objectgegevens</h2>
        <div className="space-y-0.5">
          <div>
            <Label className="text-xs">Model:</Label>
            <Select>
              <SelectTrigger className="w-full bg-rose-50 h-6 text-xs">
                <SelectValue placeholder="Andreas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="andreas">Andreas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Object kleur:</Label>
            <Select>
              <SelectTrigger className="w-full bg-rose-50 h-6 text-xs">
                <SelectValue placeholder="RAL7016" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ral7016">RAL7016</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Reclame locatie:</Label>
            <Select>
              <SelectTrigger className="w-full h-6 text-xs">
                <SelectValue placeholder="Enkelzijdig roterend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enkelzijdig">Enkelzijdig roterend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Materiaal:</Label>
            <Input defaultValue="NL-123456" readOnly className="bg-green-50 h-6 text-xs" />
          </div>

          <div>
            <Label className="text-xs">Object:</Label>
            <Input defaultValue="NL-AB-199009" readOnly className="bg-green-50 h-6 text-xs" />
          </div>

          <div className="flex gap-0.5 mt-0.5">
            <Button size="sm" variant="secondary" className="flex-1 text-xs py-0.5">Kies configuratie</Button>
            <Button size="sm" variant="secondary" className="flex-1 text-xs py-0.5">Bekijk TEMP</Button>
          </div>

          <Button variant="outline" size="sm" className="w-full flex items-center gap-0.5 text-xs py-0.5">
            <Plus className="h-3 w-3" />
            Nieuw object aanmaken
          </Button>
        </div>
      </div>

      {/* Middle section - Locatiegegevens */}
      <div>
        <h2 className="text-xs font-semibold mb-0.5">Locatiegegevens</h2>
        <div className="space-y-0.5">
          <div>
            <Label className="text-xs">Commercieel:</Label>
            <Select>
              <SelectTrigger className="w-full bg-rose-50 h-6 text-xs">
                <SelectValue placeholder="A en B zijde commercieel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ab">A en B zijde commercieel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs">Aanverwante objecten:</Label>
            <Input placeholder="" className="h-6 text-xs" />
          </div>

          <div>
            <Label className="text-xs">Reclameverlichting:</Label>
            <Select>
              <SelectTrigger className="w-full bg-rose-50 h-6 text-xs">
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
        <Card className="p-1">
          <h3 className="text-xs font-semibold mb-0.5">Elektrabox</h3>
          <div className="space-y-0.5">
            <div className="grid grid-cols-2 gap-0.5">
              <div>
                <Label className="text-xs">X:</Label>
                <Input defaultValue="54.123123" readOnly className="bg-green-50 h-6 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Y:</Label>
                <Input defaultValue="54.123123" readOnly className="bg-green-50 h-6 text-xs" />
              </div>
            </div>

            <div>
              <Label className="text-xs">Type:</Label>
              <Input defaultValue="Ondergronds" readOnly className="bg-green-50 h-6 text-xs" />
            </div>

            <Button size="sm" variant="secondary" className="w-full text-xs py-0.5">
              Kies configuratie
            </Button>

            <div>
              <Label className="text-xs">Materiaal:</Label>
              <Input defaultValue="NL-654321" readOnly className="bg-green-50 h-6 text-xs" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}