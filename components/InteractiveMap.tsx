'use client';

import { useEffect, useRef } from 'react';
import { GMAPS_CALLBACK, gmaps, buildScriptSrc, MAP_ID } from '@/lib/gmaps';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GMaps = any;

declare global {
  interface Window {
    google?: { maps: GMaps };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
}


const POINTS = [
  { lat: 1.409472, lng: 103.921667, info: 'Coney Island Nature Trail' },
  { lat: 1.350833, lng: 103.764722, info: 'Bukit Batok Nature Trail' },
];

export default function InteractiveMap({ apiKey }: { apiKey: string }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    function initMap() {
      if (cancelled || !mapRef.current || !window.google) return;
      if ((mapRef.current as HTMLElement & { _mapInitialized?: boolean })._mapInitialized) return;
      (mapRef.current as HTMLElement & { _mapInitialized?: boolean })._mapInitialized = true;
      const G = window.google.maps;
      // AdvancedMarkerElement lives in the marker library (pre-loaded via libraries=marker).
      // Note: mapId is required for AdvancedMarkerElement. When mapId is set,
      // the styles array below is ignored — configure map styling via Google Cloud Console.
      const { AdvancedMarkerElement } = G.marker;

      const map = new G.Map(mapRef.current, {
        center: { lat: 1.291806, lng: 103.8495 },
        zoom: 11,
        mapTypeId: G.MapTypeId.TERRAIN,
        mapId: MAP_ID,
        streetViewControl: true,
      });

      // GeoJSON trails
      map.data.loadGeoJson('/data/merged-NParks-tracks.geojson');
      map.data.setStyle((feature: GMaps) => {
        const type = feature.getProperty('type');
        const color = type === 'Footpath' ? '#3D550C' : type === 'Bikeway' ? '#4682B4' : '#4A7212';
        return { strokeWeight: 2, strokeColor: color };
      });

      const infoWindow = new G.InfoWindow();

      // Geolocation button
      const locationButton = document.createElement('button');
      locationButton.textContent = 'See Current Location';
      locationButton.style.cssText = [
        'background-color:#3D550C', 'border:0', 'border-radius:15px',
        'box-shadow:0 1px 4px -1px rgba(0,0,0,0.3)', 'margin:10px',
        'padding:0 0.5em', 'font:400 18px Inter,Arial,sans-serif',
        'color:white', 'height:40px', 'cursor:pointer',
      ].join(';');
      map.controls[G.ControlPosition.TOP_CENTER].push(locationButton);

      locationButton.addEventListener('click', () => {
        if (!navigator.geolocation) {
          infoWindow.setContent("Error: Your browser doesn't support geolocation.");
          infoWindow.setPosition(map.getCenter());
          infoWindow.open(map);
          return;
        }
        navigator.geolocation.getCurrentPosition(
          pos => {
            const position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            infoWindow.setPosition(position);
            infoWindow.setContent('You are here :)');
            infoWindow.open(map);
            map.setCenter(position);
          },
          () => {
            infoWindow.setContent('Error: The Geolocation service failed.');
            infoWindow.setPosition(map.getCenter());
            infoWindow.open(map);
          },
        );
      });

      // Hard-coded markers
      POINTS.forEach(pt => {
        const marker = new AdvancedMarkerElement({ position: pt, map, title: pt.info });
        const iw = new G.InfoWindow({ content: pt.info });
        marker.addListener('click', () => iw.open(map, marker));
      });

      // Transit layer
      new G.TransitLayer().setMap(map);

      // GeoJSON hover / click interactions
      map.data.addListener('mouseover', (event: GMaps) => {
        map.data.overrideStyle(event.feature, { strokeColor: 'orange', strokeWeight: 8 });
      });
      map.data.addListener('mouseout', () => {
        map.data.revertStyle();
      });
      map.data.addListener('click', (event: GMaps) => {
        const park = event.feature.getProperty('park');
        const type = event.feature.getProperty('type');

        const div = document.createElement('div');
        const h5 = document.createElement('h5');
        h5.textContent = park ?? '';
        const p = document.createElement('p');
        p.textContent = `Trail Type: ${type ?? 'Unknown'}`;
        div.appendChild(h5);
        div.appendChild(p);

        infoWindow.setContent(div);
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });
    }

    if (gmaps.state === 'loaded' || window.google?.maps) {
      initMap();
      return () => { cancelled = true; };
    }

    // Queue this init to run once the script loads
    gmaps.pendingInits.push(initMap);

    if (gmaps.state === 'loading') {
      // Script already in flight — just wait
      return () => {
        cancelled = true;
        const i = gmaps.pendingInits.indexOf(initMap);
        if (i > -1) gmaps.pendingInits.splice(i, 1);
      };
    }

    // First loader: create the script
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
  }, [apiKey]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[70vh] min-h-[400px]"
      style={{ height: '70vh' }}
    />
  );
}
