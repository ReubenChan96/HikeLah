// Shared singleton state for Google Maps loading.
// Both InteractiveMap and TrailMap import from here so they share
// a single script load, callback registration, and pending-init queue.
export const GMAPS_CALLBACK = '__hikelahMapsReady__';

export const gmaps = {
  state: 'idle' as 'idle' | 'loading' | 'loaded',
  pendingInits: [] as (() => void)[],
};
