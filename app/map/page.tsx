import type { Metadata } from 'next';
import InteractiveMap from '@/components/InteractiveMap';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = { title: 'Trail Map — Hikelah!' };

const TRAIL_LINE_LEGEND = [
  { colour: '#3D550C', label: 'Footpath' },
  { colour: '#4A7212', label: 'Other Trail' },
  { colour: '#4682B4', label: 'Bikeway' },
];

const REGIONS = ['north', 'south', 'east', 'west', 'central'] as const;

export default async function MapPage() {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? '';
  const trails = await prisma.trail.findMany({
    select: { id: true, name: true, north: true, south: true, east: true, west: true, central: true },
    orderBy: { name: 'asc' },
  });

  const byRegion = REGIONS.map(region => ({
    region: region.charAt(0).toUpperCase() + region.slice(1),
    trails: trails.filter(t => t[region]),
  })).filter(g => g.trails.length > 0);

  return (
    <div className="container mx-auto px-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-blue-800 text-sm">
        <strong>Map Tips:</strong> Click on any trail to see its name and type. Use &quot;See Current Location&quot; to find where you are. Hover over trails to highlight them.
      </div>

      {/* Trail line legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-[#2D3748]" aria-label="Trail line colour legend">
        {TRAIL_LINE_LEGEND.map(item => (
          <span key={item.label} className="flex items-center gap-2">
            <span
              className="inline-block w-6 h-1 rounded"
              style={{ background: item.colour }}
              aria-hidden="true"
            />
            {item.label}
          </span>
        ))}
      </div>

      <h1 className="text-4xl font-extrabold text-brand-dark mb-4">Our Parks, Our Trails</h1>
      <InteractiveMap apiKey={apiKey} />

      {/* Text alternative for keyboard and screen reader users */}
      <section className="mt-8" aria-label="Text alternative: trail list by region">
        <h2 className="text-xl font-bold text-brand-dark mb-4">All Trails by Region</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {byRegion.map(group => (
            <div key={group.region} className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-semibold text-brand-dark mb-2">{group.region}</h3>
              <ul className="space-y-1">
                {group.trails.map(trail => (
                  <li key={trail.id}>
                    <a
                      href={`/trails/${trail.id}`}
                      className="text-sm text-[#2D3748] hover:text-brand-dark hover:underline"
                    >
                      {trail.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
