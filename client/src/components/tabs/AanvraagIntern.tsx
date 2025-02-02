import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function AanvraagIntern() {
  const form = useForm();

  return (
    <div className="grid grid-cols-[1fr,2fr,1fr] gap-4 p-2">
      {/* Left section - Objectgegevens */}
      <div>
        <div className="bg-amber-50/50 p-2 rounded-sm">
          <div className="space-y-2">
            <div>
              <Label className="text-xs">Type straatmeubilair</Label>
              <Input defaultValue="abri" readOnly className="bg-amber-50 h-6 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Abri formaat</Label>
              <Input defaultValue="4x2" readOnly className="bg-amber-50 h-6 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Objectnummer</Label>
              <Input defaultValue="NL-AB-199009" readOnly className="bg-amber-50 h-6 text-xs" />
            </div>
            <div>
              <Label className="text-xs">Type actie</Label>
              <Input defaultValue="plaatsen" readOnly className="bg-amber-50 h-6 text-xs" />
            </div>
          </div>

          <div className="mt-2">
            <Checkbox id="new-object" className="h-4 w-4" />
            <label htmlFor="new-object" className="text-xs ml-2">
              Nieuw object aanmaken
            </label>
          </div>
        </div>
      </div>

      {/* Middle section - Map */}
      <div className="h-[400px] relative">
        <MapContainer
          center={[52.3676, 4.9041]}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[52.3676, 4.9041]} />
        </MapContainer>
        <Button 
          variant="secondary" 
          size="sm" 
          className="absolute top-2 right-2 z-[1000] text-xs"
        >
          Street View
        </Button>
      </div>

      {/* Right section - Services */}
      <div className="space-y-2">
        <div>
          <h3 className="text-xs font-medium mb-1">Aangevraagde services</h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <Checkbox id="elektra" className="h-4 w-4" />
              <label htmlFor="elektra" className="text-xs ml-2">
                Elektra door JCD
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox id="vergunning" className="h-4 w-4" />
              <label htmlFor="vergunning" className="text-xs ml-2">
                Vergunning
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox id="aarding" className="h-4 w-4" />
              <label htmlFor="aarding" className="text-xs ml-2">
                Aarding
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox id="klic" className="h-4 w-4" />
              <label htmlFor="klic" className="text-xs ml-2">
                Klic
              </label>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-xs">Verkeersplan</Label>
          <Select>
            <SelectTrigger className="w-full h-6 text-xs">
              <SelectValue placeholder="Geen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geen">Geen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Aannemer</Label>
          <Select>
            <SelectTrigger className="w-full h-6 text-xs">
              <SelectValue placeholder="Geen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geen">Geen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Prio</Label>
          <Select>
            <SelectTrigger className="w-full h-6 text-xs">
              <SelectValue placeholder="Geen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geen">Geen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Combi</Label>
          <Select>
            <SelectTrigger className="w-full h-6 text-xs">
              <SelectValue placeholder="Voer combi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="combi">Voer combi</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}