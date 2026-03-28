'use client';

import { useEffect, useRef } from 'react';
import { GMAPS_CALLBACK, gmaps, buildScriptSrc, MAP_ID } from '@/lib/gmaps';

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
      const G = window.google.maps;
      // AdvancedMarkerElement requires mapId — styles array is ignored when mapId is set;
      // configure map appearance via Google Cloud Console Map Styles for production.
      const { AdvancedMarkerElement, PinElement } = G.marker;
      const position = { lat, lng };
      const map = new G.Map(mapRef.current, {
        center: position,
        zoom: 15,
        mapId: MAP_ID,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });
      const pin = new PinElement({
        background: '#3D550C',
        borderColor: '#ffffff',
        glyphColor: '#ffffff',
      });
      new AdvancedMarkerElement({
        position,
        map,
        title: trailName,
        content: pin.element,
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
    script.src = buildScriptSrc(apiKey);
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
