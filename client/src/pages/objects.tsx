import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { SelectWorkOrder } from "@db/schema";
import { municipalities } from "@/lib/forms";

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const objectTypes = ["abri", "mupi", "driehoeksbord", "reclamezuil"] as const;

function getFurnitureTypeLabel(type: string) {
  switch (type) {
    case "abri":
      return "Abri";
    case "mupi":
      return "Mupi";
    case "driehoeksbord":
      return "Driehoeksbord";
    case "reclamezuil":
      return "Reclamezuil";
    default:
      return type;
  }
}

export default function Objects() {
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const { data: objects, isLoading } = useQuery<SelectWorkOrder[]>({
    queryKey: ["/api/requests"],
  });

  const filteredObjects = objects?.filter(obj => 
    (selectedCity === "all" || !selectedCity || obj.municipality.toLowerCase() === selectedCity.toLowerCase()) &&
    (selectedType === "all" || !selectedType || obj.furnitureType.toLowerCase() === selectedType.toLowerCase())
  );

  // Netherlands center coordinates
  const center: [number, number] = [52.1326, 5.2913];

  // Dummy coordinates for demo purposes - later these will come from the database
  const dummyCoordinates = {
    amsterdam: [52.3676, 4.9041],
    rotterdam: [51.9225, 4.4792],
    utrecht: [52.0907, 5.1214],
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Straatmeubilair</h1>
          <p className="text-sm text-muted-foreground">
            Overzicht van alle objecten op de kaart
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="w-[200px]">
          <Select
            value={selectedCity}
            onValueChange={setSelectedCity}
          >
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Filter op gemeente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle gemeenten</SelectItem>
              {municipalities.map((municipality) => (
                <SelectItem
                  key={municipality.toLowerCase()}
                  value={municipality.toLowerCase()}
                >
                  {municipality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Filter op type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle types</SelectItem>
              {objectTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                >
                  {getFurnitureTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="rounded-xl overflow-hidden">
            <div style={{ height: "600px" }}>
              <MapContainer
                center={center}
                zoom={7}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredObjects?.map((obj) => {
                  // Get coordinates based on city (dummy data)
                  const coords = dummyCoordinates[obj.municipality.toLowerCase() as keyof typeof dummyCoordinates];
                  if (!coords) return null;

                  return (
                    <Marker
                      key={obj.id}
                      position={coords}
                    >
                      <Popup>
                        <div className="p-2">
                          <h3 className="font-bold">{getFurnitureTypeLabel(obj.furnitureType)}</h3>
                          <p className="text-sm">{obj.installationAddress || obj.removalStreet}</p>
                          <p className="text-sm">{obj.municipality}</p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Objecten Lijst</h2>
          {isLoading ? (
            <p>Laden...</p>
          ) : (
            filteredObjects?.map((obj) => (
              <Card key={obj.id} className="p-4 hover:shadow-md transition-shadow rounded-xl">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="rounded-xl">
                      {getFurnitureTypeLabel(obj.furnitureType)}
                    </Badge>
                  </div>
                  <p className="font-medium">{obj.installationAddress || obj.removalStreet}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {obj.municipality}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}