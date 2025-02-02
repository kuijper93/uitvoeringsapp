import React, { useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { z } from "zod";
import type { SelectWorkOrder } from "@db/schema";

const aanvraagInternSchema = z.object({
  localModel: z.string(),
  abriFormat: z.string(),
  objectNumber: z.string(),
  actionType: z.string(),
  newObject: z.boolean().default(false),
  services: z.object({
    elektra: z.boolean().default(false),
    vergunning: z.boolean().default(false),
    aarding: z.boolean().default(false),
    klic: z.boolean().default(false),
  }),
  verkeersplan: z.string(),
  aannemer: z.string(),
  prio: z.string(),
  combi: z.string(),
});

type AanvraagInternFormData = z.infer<typeof aanvraagInternSchema>;

interface AanvraagInternProps {
  workOrder?: SelectWorkOrder;
  onUpdate?: (data: Partial<SelectWorkOrder>) => void;
}

export default function AanvraagIntern({ workOrder, onUpdate }: AanvraagInternProps) {
  const form = useForm<AanvraagInternFormData>({
    resolver: zodResolver(aanvraagInternSchema),
    defaultValues: {
      localModel: workOrder?.furnitureType || "abri",
      abriFormat: workOrder?.abriFormat || "4x2",
      objectNumber: workOrder?.objectNumber || "",
      actionType: workOrder?.actionType || "plaatsen",
      newObject: false,
      services: {
        elektra: workOrder?.electricalConnect || false,
        vergunning: false,
        aarding: false,
        klic: false,
      },
      verkeersplan: "geen",
      aannemer: "geen",
      prio: "geen",
      combi: "",
    },
  });

  const onFormChange = (fieldName: keyof AanvraagInternFormData, value: any) => {
    form.setValue(fieldName, value);
    if (onUpdate) {
      const updateData: Partial<SelectWorkOrder> = {
        furnitureType: form.getValues("localModel"),
        abriFormat: form.getValues("abriFormat"),
        objectNumber: form.getValues("objectNumber"),
        actionType: form.getValues("actionType"),
        electricalConnect: form.getValues("services").elektra,
      };
      onUpdate(updateData);
    }
  };

  return (
    <div className="grid grid-cols-[1fr,2fr,1fr] gap-2">
      {/* Left section - Objectgegevens */}
      <Card className="bg-amber-50/50 p-2 rounded-sm h-[360px] overflow-y-auto">
        <div className="space-y-2">
          <div>
            <Label className="text-xs">Local Model</Label>
            <Input 
              value={form.watch("localModel")}
              onChange={(e) => onFormChange("localModel", e.target.value)}
              className="h-6 text-xs bg-amber-50" 
            />
          </div>
          <div>
            <Label className="text-xs">Abri formaat</Label>
            <Input 
              value={form.watch("abriFormat")}
              onChange={(e) => onFormChange("abriFormat", e.target.value)}
              className="h-6 text-xs bg-amber-50" 
            />
          </div>
          <div>
            <Label className="text-xs">Objectnummer</Label>
            <Input 
              value={form.watch("objectNumber")}
              onChange={(e) => onFormChange("objectNumber", e.target.value)}
              className="h-6 text-xs bg-amber-50" 
            />
          </div>
          <div>
            <Label className="text-xs">Type actie</Label>
            <Input 
              value={form.watch("actionType")}
              onChange={(e) => onFormChange("actionType", e.target.value)}
              className="h-6 text-xs bg-amber-50" 
            />
          </div>
          <div className="mt-2">
            <div className="flex items-center">
              <Checkbox 
                id="new-object" 
                checked={form.watch("newObject")}
                onCheckedChange={(checked) => onFormChange("newObject", checked)}
                className="h-3 w-3" 
              />
              <label htmlFor="new-object" className="text-xs ml-2">
                Nieuw object aanmaken
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Middle section - Map */}
      <div className="h-[360px] relative">
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
          onClick={() => {
            window.open(
              `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=52.3676,4.9041`,
              '_blank'
            );
          }}
        >
          Street View
        </Button>
      </div>

      {/* Right section - Services */}
      <div className="space-y-1 h-[360px] overflow-y-auto">
        <div className="mb-2">
          <h3 className="text-xs font-medium">Aangevraagde services</h3>
          <div className="space-y-1 mt-1">
            <div className="flex items-center">
              <Checkbox 
                id="elektra" 
                checked={form.watch("services.elektra")}
                onCheckedChange={(checked) => 
                  onFormChange("services", { ...form.watch("services"), elektra: checked })
                }
                className="h-3 w-3" 
              />
              <label htmlFor="elektra" className="text-xs ml-2">
                Elektra door JCD
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="vergunning" 
                checked={form.watch("services.vergunning")}
                onCheckedChange={(checked) => 
                  onFormChange("services", { ...form.watch("services"), vergunning: checked })
                }
                className="h-3 w-3" 
              />
              <label htmlFor="vergunning" className="text-xs ml-2">
                Vergunning
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="aarding" 
                checked={form.watch("services.aarding")}
                onCheckedChange={(checked) => 
                  onFormChange("services", { ...form.watch("services"), aarding: checked })
                }
                className="h-3 w-3" 
              />
              <label htmlFor="aarding" className="text-xs ml-2">
                Aarding
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox 
                id="klic" 
                checked={form.watch("services.klic")}
                onCheckedChange={(checked) => 
                  onFormChange("services", { ...form.watch("services"), klic: checked })
                }
                className="h-3 w-3" 
              />
              <label htmlFor="klic" className="text-xs ml-2">
                Klic
              </label>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <Label className="text-xs">Verkeersplan</Label>
          <Select
            value={form.watch("verkeersplan")}
            onValueChange={(value) => onFormChange("verkeersplan", value)}
          >
            <SelectTrigger className="w-full h-6 text-xs">
              <SelectValue placeholder="Geen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geen">Geen</SelectItem>
              <SelectItem value="zelf">Zelf uitvoeren</SelectItem>
              <SelectItem value="werk">In het werk</SelectItem>
              <SelectItem value="buko">BUKO</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-2">
          <Label className="text-xs">Aannemer</Label>
          <Select
            value={form.watch("aannemer")}
            onValueChange={(value) => onFormChange("aannemer", value)}
          >
            <SelectTrigger className="w-full h-6 text-xs">
              <SelectValue placeholder="Geen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geen">Geen aannemer</SelectItem>
              <SelectItem value="henk">Aannemer Henk</SelectItem>
              <SelectItem value="piet">Aannemer Piet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-2">
          <Label className="text-xs">Prio</Label>
          <Select
            value={form.watch("prio")}
            onValueChange={(value) => onFormChange("prio", value)}
          >
            <SelectTrigger className="w-full h-6 text-xs">
              <SelectValue placeholder="Geen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="geen">Geen prio</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-xs">Combi</Label>
          <Select
            value={form.watch("combi")}
            onValueChange={(value) => onFormChange("combi", value)}
          >
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