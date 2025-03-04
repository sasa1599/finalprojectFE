// "use client";

// import React, { useState, useCallback } from "react";
// import { MapPin, Loader } from "lucide-react";
// import L, { LatLngExpression } from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

// // Move icon configuration to a separate file
// const configureLeafletIcons = () => {
//   L.Icon.Default.mergeOptions({
//     iconRetinaUrl: "/leaflet/marker-icon-2x.png",
//     iconUrl: "/leaflet/marker-icon.png",
//     shadowUrl: "/leaflet/marker-shadow.png",
//   });
// };

// configureLeafletIcons();

// interface LocationPickerProps {
//   initialLat?: number;
//   initialLon?: number;
//   onLocationSelect: (lat: number, lon: number) => void;
//   disabled?: boolean;
// }

// interface LocationMarkerProps {
//   position: LatLngExpression;
//   setPosition: React.Dispatch<React.SetStateAction<LatLngExpression>>;
//   onLocationSelect: (lat: number, lon: number) => void;
//   disabled?: boolean;
// }

// const LocationMarker: React.FC<LocationMarkerProps> = ({
//   position,
//   setPosition,
//   onLocationSelect,
//   disabled,
// }) => {
//   const map = useMapEvents({
//     click: (event: L.LeafletMouseEvent) => {
//       if (disabled) return;
//       const { lat, lng } = event.latlng;
//       const newPosition: LatLngExpression = [lat, lng];
//       setPosition(newPosition);
//       onLocationSelect(lat, lng);
//       map.flyTo(event.latlng, map.getZoom());
//     },
//   });

//   return <Marker position={position} />;
// };

// const CoordinateDisplay: React.FC<{ position: LatLngExpression }> = ({
//   position,
// }) => (
//   <div className="absolute top-2 left-2 z-[1000] bg-white p-2 rounded shadow flex items-center">
//     <MapPin className="mr-2 text-blue-600" />
//     <div>
//       <p className="text-sm">
//         Latitude: {Array.isArray(position) ? position[0].toFixed(4) : ""}
//       </p>
//       <p className="text-sm">
//         Longitude: {Array.isArray(position) ? position[1].toFixed(4) : ""}
//       </p>
//     </div>
//   </div>
// );

// export const LocationPicker: React.FC<LocationPickerProps> = ({
//   initialLat = -6.2088,
//   initialLon = 106.8456,
//   onLocationSelect,
//   disabled,
// }) => {
//   const [position, setPosition] = useState<LatLngExpression>([
//     initialLat,
//     initialLon,
//   ]);
//   const [isLoading, setIsLoading] = useState(false);

//   return (
//     <div className="w-full h-96 relative">
//       <CoordinateDisplay position={position} />
//       {isLoading && (
//         <div className="absolute inset-0 bg-white/50 z-[2000] flex items-center justify-center">
//           <Loader className="animate-spin" />
//         </div>
//       )}
//       <MapContainer
//         center={position}
//         zoom={13}
//         scrollWheelZoom={false}
//         className={`h-full w-full z-0 ${
//           disabled ? "cursor-not-allowed opacity-60" : ""
//         }`}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <LocationMarker
//           position={position}
//           setPosition={setPosition}
//           onLocationSelect={onLocationSelect}
//           disabled={disabled}
//         />
//       </MapContainer>
//     </div>
//   );
// };

// interface MapLocationPickerProps {
//   value?: { latitude?: number; longitude?: number };
//   onChange: (latitude: number, longitude: number) => void;
//   disabled?: boolean;
//   error?: string;
// }

// export default function MapLocationPicker({
//   value,
//   onChange,
//   disabled,
//   error,
// }: MapLocationPickerProps) {
//   const handleLocationSelect = useCallback(
//     (lat: number, lon: number) => {
//       onChange(lat, lon);
//     },
//     [onChange]
//   );

//   return (
//     <div>
//       <label
//         className={`text-gray-700 font-medium mb-2 inline-flex items-center ${
//           disabled ? "opacity-50" : ""
//         }`}
//       >
//         <MapPin className="h-5 w-5 mr-2 text-gray-500" />
//         Select Store Location
//       </label>
//       <LocationPicker
//         initialLat={value?.latitude}
//         initialLon={value?.longitude}
//         onLocationSelect={handleLocationSelect}
//         disabled={disabled}
//       />
//       {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//     </div>
//   );
// }
