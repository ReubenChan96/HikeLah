'use client';

import { useEffect, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GMaps = any;

declare global {
  interface Window {
    google?: { maps: GMaps };
  }
}

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#ebe3cd' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#523735' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f1e6' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#c9b2a6' }] },
  { featureType: 'administrative.land_parcel', elementType: 'geometry.stroke', stylers: [{ color: '#dcd2be' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.land_parcel', elementType: 'labels.text.fill', stylers: [{ color: '#ae9e90' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#93817c' }] },
  { featureType: 'poi.business', elementType: 'geometry.fill', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.government', elementType: 'geometry.fill', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.medical', elementType: 'geometry.fill', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.medical', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.medical', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.park', elementType: 'geometry.fill', stylers: [{ color: '#a5b076' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#447530' }] },
  { featureType: 'poi.place_of_worship', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.place_of_worship', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.school', elementType: 'geometry.fill', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.school', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.school', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi.school', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#f5f1e6' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#fdfcf8' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f8c967' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e9bc62' }] },
  { featureType: 'road.highway.controlled_access', elementType: 'geometry', stylers: [{ color: '#e98d58' }] },
  { featureType: 'road.highway.controlled_access', elementType: 'geometry.stroke', stylers: [{ color: '#db8555' }] },
  { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#806b63' }] },
  { featureType: 'transit.line', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
  { featureType: 'transit.line', elementType: 'labels.text.fill', stylers: [{ color: '#8f7d77' }] },
  { featureType: 'transit.line', elementType: 'labels.text.stroke', stylers: [{ color: '#ebe3cd' }] },
  { featureType: 'transit.station', elementType: 'geometry', stylers: [{ color: '#dfd2ae' }] },
  { featureType: 'transit.station.airport', elementType: 'geometry.fill', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit.station.airport', elementType: 'geometry.stroke', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry.fill', stylers: [{ color: '#b9d3c2' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#92998d' }] },
];

const POINTS = [
  { lat: 1.409472, lng: 103.921667, info: 'Coney Island Nature Trail' },
  { lat: 1.350833, lng: 103.764722, info: 'Bukit Batok Nature Trail' },
];

export default function InteractiveMap({ apiKey }: { apiKey: string }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const callbackName = `initInteractiveMap_${Date.now()}`;

    function initMap() {
      if (!mapRef.current || !window.google) return;
      // Guard: don't re-init if map already rendered in this container
      if ((mapRef.current as HTMLElement & { _mapInitialized?: boolean })._mapInitialized) return;
      (mapRef.current as HTMLElement & { _mapInitialized?: boolean })._mapInitialized = true;
      const G = window.google.maps;

      const map = new G.Map(mapRef.current, {
        center: { lat: 1.291806, lng: 103.8495 },
        zoom: 17,
        mapTypeId: G.MapTypeId.TERRAIN,
        styles: MAP_STYLES,
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
        const marker = new G.Marker({ position: pt, map, title: pt.info });
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

    // If Google Maps is already loaded (e.g. Strict Mode double-invoke), init directly
    if (window.google?.maps) {
      initMap();
      return;
    }

    (window as unknown as Record<string, unknown>)[callbackName] = initMap;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
      delete (window as unknown as Record<string, unknown>)[callbackName];
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
