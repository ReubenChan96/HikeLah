import type { Metadata } from 'next';
import InteractiveMap from '@/components/InteractiveMap';

export const metadata: Metadata = { title: 'Interactive Map — Hikelah!' };

export default function MapPage() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? '';
  return (
    <div className="container mx-auto px-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-blue-800 text-sm">
        <strong>Map Tips:</strong> Click on any trail to see its name and type. Use &quot;See Current Location&quot; to find where you are. Hover over trails to highlight them.
      </div>
      <h1 className="text-4xl font-extrabold text-brand-dark mb-4">Our Parks, Our Trails</h1>
      <InteractiveMap apiKey={apiKey} />
    </div>
  );
}
