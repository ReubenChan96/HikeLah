// Shared singleton state for Google Maps loading.
// Both InteractiveMap and TrailMap import from here so they share
// a single script load, callback registration, and pending-init queue.
export const GMAPS_CALLBACK = '__hikelahMapsReady__';

export const gmaps = {
  state: 'idle' as 'idle' | 'loading' | 'loaded',
  pendingInits: [] as (() => void)[],
};

// Builds the Maps API script URL with the recommended loading=async flag
// and pre-loads the marker library so AdvancedMarkerElement is available
// as soon as the callback fires.
export function buildScriptSrc(apiKey: string) {
  return `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&loading=async&callback=${GMAPS_CALLBACK}`;
}

// Map ID for AdvancedMarkerElement (mandatory).
// Set NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID in your environment to a real Cloud
// Console Map ID for production. DEMO_MAP_ID works for local development
// but does not support Cloud Console map styling.
export const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID';
