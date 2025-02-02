import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
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

const objectTypes = [
  "abri",
  "mupi",
  "vitrine",
  "digitaal_object",
  "billboard",
  "zuil",
  "toilet",
  "hekwerk",
  "haltepaal",
  "prullenbak"
] as const;

// City coordinates with zoom levels
const cityCoordinates = {
  amsterdam: { coords: [52.3676, 4.9041] as [number, number], zoom: 12 },
  rotterdam: { coords: [51.9225, 4.4792] as [number, number], zoom: 12 },
  utrecht: { coords: [52.0907, 5.1214] as [number, number], zoom: 12 },
};

function getFurnitureTypeLabel(type: string) {
  switch (type) {
    case "abri":
      return "Abri";
    case "mupi":
      return "Mupi";
    case "vitrine":
      return "Vitrine";
    case "digitaal_object":
      return "Digitaal object";
    case "billboard":
      return "Billboard";
    case "zuil":
      return "Zuil";
    case "toilet":
      return "Toilet";
    case "hekwerk":
      return "Hekwerk";
    case "haltepaal":
      return "Haltepaal";
    case "prullenbak":
      return "Prullenbak";
    default:
      return type;
  }
}

// Component to handle map position updates
function MapController({ city }: { city: string | null }) {
  const map = useMap();

  React.useEffect(() => {
    if (city && cityCoordinates[city.toLowerCase() as keyof typeof cityCoordinates]) {
      const cityData = cityCoordinates[city.toLowerCase() as keyof typeof cityCoordinates];
      map.setView(cityData.coords, cityData.zoom);
    }
  }, [city, map]);

  return null;
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
        <div className="w-[200px] relative z-[1000]">
          <Select
            value={selectedCity}
            onValueChange={setSelectedCity}
          >
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Filter op gemeente" />
            </SelectTrigger>
            <SelectContent className="bg-white z-[1000]">
              <SelectItem value="all" className="py-3 px-4 cursor-pointer data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                Alle gemeenten
              </SelectItem>
              {municipalities.map((municipality) => (
                <SelectItem
                  key={municipality.toLowerCase()}
                  value={municipality.toLowerCase()}
                  className="py-3 px-4 cursor-pointer data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900"
                >
                  {municipality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px] relative z-[1000]">
          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Filter op type" />
            </SelectTrigger>
            <SelectContent className="bg-white z-[1000]">
              <SelectItem value="all" className="py-3 px-4 cursor-pointer data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900">
                Alle types
              </SelectItem>
              {objectTypes.map((type) => (
                <SelectItem
                  key={type}
                  value={type}
                  className="py-3 px-4 cursor-pointer data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900"
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
            <div style={{ height: "500px" }} className="relative z-0">
              <MapContainer
                center={center}
                zoom={7}
                style={{ height: "100%", width: "100%" }}
              >
                <MapController city={selectedCity === "all" ? null : selectedCity} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {filteredObjects?.map((obj) => {
                  const cityData = cityCoordinates[obj.municipality.toLowerCase() as keyof typeof cityCoordinates];
                  if (!cityData) return null;

                  return (
                    <Marker
                      key={obj.id}
                      position={cityData.coords}
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