"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet icon issue
const icon = L.icon({
  iconUrl: "/marker-icon.png",
  shadowUrl: "/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Map click handler component
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

interface LeafletMapProps {
  latitude?: number;
  longitude?: number;
  onMapClick: (lat: number, lng: number) => void;
}

export default function LeafletMapComponents({
  latitude = 0,
  longitude = 0,
  onMapClick,
}: LeafletMapProps) {
  // Set default center if no coordinates are provided
  const center: [number, number] = [latitude || -6.2, longitude || 106.8]; // Default to Jakarta coordinates

  return (
    <>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {latitude && longitude && (
          <Marker position={[latitude, longitude]} icon={icon}>
            <Popup>
              <span>Store Location</span>
            </Popup>
          </Marker>
        )}
        <MapClickHandler onMapClick={onMapClick} />
      </MapContainer>
    </>
  );
}
