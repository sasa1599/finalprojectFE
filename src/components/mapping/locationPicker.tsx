"use client";

import React, { useState, useCallback } from "react";
import { MapPin } from "lucide-react";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

// Static imports for React-Leaflet components
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

// Fix for Leaflet's default icon URLs
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface LocationPickerProps {
  initialLat?: number;
  initialLon?: number;
  onLocationSelect: (lat: number, lon: number) => void;
}

const LocationMarker: React.FC<{
  position: LatLngExpression;
  setPosition: React.Dispatch<React.SetStateAction<LatLngExpression>>;
  onLocationSelect: (lat: number, lon: number) => void;
}> = ({ position, setPosition, onLocationSelect }) => {
  const map = useMapEvents({
    click: (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      const newPosition: LatLngExpression = [lat, lng];
      setPosition(newPosition);
      onLocationSelect(lat, lng);
      map.flyTo(event.latlng, map.getZoom());
    },
  });

  return <Marker position={position} />;
};

export const LocationPicker: React.FC<LocationPickerProps> = ({
  initialLat = -6.2088,
  initialLon = 106.8456,
  onLocationSelect,
}) => {
  const [position, setPosition] = useState<LatLngExpression>([
    initialLat,
    initialLon,
  ]);

  return (
    <div className="w-full h-96 relative">
      <div className="absolute top-2 left-2 z-[1000] bg-white p-2 rounded shadow flex items-center">
        <MapPin className="mr-2 text-blue-600" />
        <div>
          <p className="text-sm">
            Latitude: {Array.isArray(position) ? position[0].toFixed(4) : ""}
          </p>
          <p className="text-sm">
            Longitude: {Array.isArray(position) ? position[1].toFixed(4) : ""}
          </p>
        </div>
      </div>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
};

interface MapLocationPickerProps {
  value?: { latitude?: number; longitude?: number };
  onChange: (latitude: number, longitude: number) => void;
}

export default function MapLocationPicker({
  value,
  onChange,
}: MapLocationPickerProps) {
  const handleLocationSelect = useCallback(
    (lat: number, lon: number) => {
      onChange(lat, lon);
    },
    [onChange]
  );

  return (
    <div>
      <label className="text-gray-700 font-medium mb-2 inline-flex items-center">
        <MapPin className="h-5 w-5 mr-2 text-gray-500" />
        Select Store Location
      </label>
      <LocationPicker
        initialLat={value?.latitude}
        initialLon={value?.longitude}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}
