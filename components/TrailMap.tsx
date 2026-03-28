'use client';

import { useEffect, useRef } from 'react';

interface TrailMapProps {
  lat: number;
  lng: number;
  trailName: string;
  apiKey: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GoogleMaps = any;

declare global {
  interface Window {
    google?: { maps: GoogleMaps };
  }
}

export default function TrailMap({ lat, lng, trailName, apiKey }: TrailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const callbackName = `initTrailMap_${Date.now()}`;

    function initMap() {
      if (!mapRef.current || !window.google) return;
      const position = { lat, lng };
      const map = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
        styles: [
          { elementType: 'geometry',              stylers: [{ color: '#e8f5e9' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#b3e0f2' }] },
          { featureType: 'road',  elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#c8e6c9' }] },
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      new window.google.maps.Marker({
        position,
        map,
        title: trailName,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#3D550C',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });
    }

    (window as unknown as Record<string, unknown>)[callbackName] = initMap;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      delete (window as unknown as Record<string, unknown>)[callbackName];
    };
  }, [lat, lng, trailName, apiKey]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[300px] lg:h-[360px] rounded-xl overflow-hidden"
    />
  );
}
