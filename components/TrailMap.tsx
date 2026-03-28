'use client';

import { useEffect, useRef } from 'react';
import { GMAPS_CALLBACK, gmaps } from '@/lib/gmaps';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
}

export default function TrailMap({ lat, lng, trailName, apiKey }: TrailMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    function initMap() {
      if (cancelled || !mapRef.current || !window.google) return;
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

    if (gmaps.state === 'loaded' || window.google?.maps) {
      initMap();
      return () => { cancelled = true; };
    }

    gmaps.pendingInits.push(initMap);

    if (gmaps.state === 'loading') {
      return () => {
        cancelled = true;
        const i = gmaps.pendingInits.indexOf(initMap);
        if (i > -1) gmaps.pendingInits.splice(i, 1);
      };
    }

    gmaps.state = 'loading';
    window[GMAPS_CALLBACK] = () => {
      gmaps.state = 'loaded';
      const cbs = gmaps.pendingInits.splice(0);
      cbs.forEach(cb => cb());
    };

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${GMAPS_CALLBACK}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      cancelled = true;
      const i = gmaps.pendingInits.indexOf(initMap);
      if (i > -1) gmaps.pendingInits.splice(i, 1);
    };
  }, [lat, lng, trailName, apiKey]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[300px] lg:h-[360px] rounded-xl overflow-hidden"
    />
  );
}
