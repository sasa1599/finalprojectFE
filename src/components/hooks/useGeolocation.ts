"use client";

import { useState, useEffect } from "react";

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface GeolocationState {
  location: Location | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation(): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Don't run on server
    if (typeof window === 'undefined') return;
    
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setState({
        location: null,
        loading: false,
        error: "Geolocation is not supported by your browser",
      });
      return;
    }

    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Try to get address from coordinates (reverse geocoding)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          setState({
            location: {
              latitude,
              longitude,
              address: data.display_name,
            },
            loading: false,
            error: null,
          });
        } catch (error) {
          // Still set location if address lookup fails
          setState({
            location: { latitude, longitude },
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        let errorMessage = "Unknown error getting your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        
        setState({
          location: null,
          loading: false,
          error: errorMessage,
        });
      }
    );
  }, []);

  return state;
}