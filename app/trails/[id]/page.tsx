import { cache } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { trailMetadata } from '@/lib/trailMetadata';

const getTrail = cache((id: number) =>
  prisma.trail.findUnique({ where: { id } })
);
import TrailMap from '@/components/TrailMap';
import WeatherWidget from '@/components/WeatherWidget';
import type { Trail } from '@/types/trail';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const trail = await getTrail(parseInt(id));
  return { title: trail ? `${trail.name} — Hikelah!` : 'Trail Not Found' };
}

const DIFFICULTY_CLASSES: Record<string, string> = {
  easy:     'text-[#2E7D32] bg-[#2E7D32]',
  moderate: 'text-[#E65100] bg-[#E65100]',
  hard:     'text-[#C62828] bg-[#C62828]',
};

const DIFFICULTY_ICONS: Record<string, string> = {
  easy:     'fas fa-walking',
  moderate: 'fas fa-chart-line',
  hard:     'fas fa-mountain',
};

function difficultyColour(d: string | null): string {
  if (!d) return 'text-gray-500 bg-gray-500';
  return DIFFICULTY_CLASSES[d.toLowerCase()] ?? 'text-gray-500 bg-gray-500';
}

export default async function TrailPage({ params }: Props) {
  const { id } = await params;
  const numId = parseInt(id);
  if (isNaN(numId)) notFound();

  const trail = await getTrail(numId);
  if (!trail) notFound();

  const meta = trailMetadata[(trail as Trail).name] ?? {};
  const regionKey = (['north', 'south', 'east', 'west', 'central'] as const)
    .find(r => (trail as Trail)[r]) ?? 'central';

  const apiKey = process.env.GOOGLE_MAPS_API_KEY ?? '';

  // Parse distanceText: "2.5km | Est. 1h 00min"
  const [distPart, durPart] = (meta.distanceText ?? '').split('|').map(s => s.trim());

  const difficultyKey = trail.difficulty?.toLowerCase() ?? '';

  return (
    <div>
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mb-2">
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-gray-500">
            <li><Link href="/" className="text-brand-dark hover:underline">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/explore" className="text-brand-dark hover:underline">Explore</Link></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-600 truncate max-w-[200px]">{trail.name}</li>
          </ol>
        </nav>
      </div>

      {/* Hero */}
      <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden mb-6">
        <div
          role="img"
          aria-hidden="true"
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url('${meta.imageUrl ?? '/assets/img/placeholder.jpeg'}')`,
            filter: 'brightness(0.65)',
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-6 flex flex-col gap-2">
          {!trail.isActive ? (
            <span className="inline-block self-start px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-red-600 bg-opacity-90 text-white">
              Trail Closed
            </span>
          ) : meta.headerSubtext ? (
            <span className="inline-block self-start px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-brand-light bg-opacity-90 text-white">
              {meta.headerSubtext}
            </span>
          ) : null}
          <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg">{trail.name}</h1>
          {trail.difficulty && (
            <span
              className={`inline-block self-start px-3 py-1 rounded-full text-xs font-bold text-white ${difficultyColour(trail.difficulty).split(' ')[1]}`}
            >
              {DIFFICULTY_ICONS[difficultyKey] && (
                <i className={`${DIFFICULTY_ICONS[difficultyKey]} mr-1`} aria-hidden="true" />
              )}
              {trail.difficulty}
            </span>
          )}
        </div>
      </div>

      {/* Closure alert */}
      {!trail.isActive && (
        <div className="container mx-auto px-4 mb-4">
          <div className="flex items-start gap-3 bg-red-50 border border-red-300 rounded-xl p-4 text-red-800">
            <i className="fas fa-exclamation-triangle mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <strong>This trail is currently closed.</strong>
              {trail.closureReason && ` ${trail.closureReason}.`}
              {trail.closureUntil && (
                <> Expected to reopen: <strong>{new Date(trail.closureUntil).toLocaleDateString('en-SG', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.</>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="container mx-auto px-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: 'fas fa-route',       label: 'Distance',     value: distPart || (trail.lengthKm ? `${trail.lengthKm} km` : '—') },
            { icon: 'fas fa-clock',       label: 'Est. Duration', value: durPart || (trail.estimatedHours ? `${trail.estimatedHours}h` : '—') },
            { icon: 'fas fa-mountain',    label: 'Difficulty',    value: trail.difficulty ?? '—', extraClass: difficultyColour(trail.difficulty).split(' ')[0] },
            { icon: 'fas fa-shoe-prints', label: 'Terrain',       value: trail.terrainType ?? '—' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <i className={`${s.icon} text-brand-light text-2xl block mb-2`} aria-hidden="true" />
              <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">{s.label}</div>
              <div className={`font-bold text-[#2D3748] ${s.extraClass ?? ''}`}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left column */}
          <div className="lg:w-7/12 space-y-5">

            {/* About */}
            {trail.description && (
              <section className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-brand-dark border-b-2 border-brand-pale pb-2 mb-4">About this trail</h2>
                <p className="text-[#2D3748]">{trail.description}</p>
              </section>
            )}

            {/* What to expect */}
            <section className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-brand-dark border-b-2 border-brand-pale pb-2 mb-4">What you&apos;ll see</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {trail.forestedTrail && (
                  <span className="px-3 py-1.5 rounded-full text-sm bg-brand-pale text-brand-dark border border-[#c3e08c]">
                    <i className="fas fa-tree mr-1" aria-hidden="true" />Forested Trail
                  </span>
                )}
                {trail.casualWalk && (
                  <span className="px-3 py-1.5 rounded-full text-sm bg-brand-pale text-brand-dark border border-[#c3e08c]">
                    <i className="fas fa-walking mr-1" aria-hidden="true" />Casual Walk
                  </span>
                )}
                {trail.floraFaunaSpotting && (
                  <span className="px-3 py-1.5 rounded-full text-sm bg-brand-pale text-brand-dark border border-[#c3e08c]">
                    <i className="fas fa-leaf mr-1" aria-hidden="true" />Flora &amp; Fauna
                  </span>
                )}
                {trail.wildlifeSpotting && (
                  <span className="px-3 py-1.5 rounded-full text-sm bg-brand-pale text-brand-dark border border-[#c3e08c]">
                    <i className="fas fa-paw mr-1" aria-hidden="true" />Wildlife
                  </span>
                )}
                {!trail.forestedTrail && !trail.casualWalk && !trail.floraFaunaSpotting && !trail.wildlifeSpotting && (
                  <span className="text-gray-400 text-sm">No sightings data yet.</span>
                )}
              </div>
              {trail.elevationGainM && (
                <p className="text-gray-500 text-sm">
                  <i className="fas fa-level-up-alt mr-1" aria-hidden="true" />Elevation gain: <strong>{trail.elevationGainM}m</strong>
                </p>
              )}
            </section>

            {/* Getting there */}
            <section className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-brand-dark border-b-2 border-brand-pale pb-2 mb-4">Getting There</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <i className="fas fa-train text-2xl text-brand-light flex-shrink-0" aria-hidden="true" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">Nearest MRT</div>
                    <div className="font-semibold text-[#2D3748]">{trail.nearestMRT ?? 'Not available'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                  <i className="fas fa-parking text-2xl text-brand-light flex-shrink-0" aria-hidden="true" />
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-500">Carpark</div>
                    <div className="font-semibold text-[#2D3748]">{trail.parkingAvail ?? 'Not available'}</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Facilities */}
            <section className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-brand-dark border-b-2 border-brand-pale pb-2 mb-4">Facilities &amp; Accessibility</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { ok: trail.toilets,          icon: 'fas fa-restroom',   label: 'Toilets' },
                  { ok: trail.shelters,          icon: 'fas fa-umbrella',   label: 'Shelters' },
                  { ok: trail.dogFriendly,       icon: 'fas fa-dog',        label: 'Dog-friendly' },
                  { ok: trail.wheelchairAccess,  icon: 'fas fa-wheelchair', label: 'Wheelchair' },
                ].map(f => (
                  <span
                    key={f.label}
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      f.ok
                        ? 'bg-brand-pale text-[#2E7D32] border-[#c3e08c]'
                        : 'bg-gray-50 text-gray-400 border-gray-200 line-through opacity-70'
                    }`}
                  >
                    <i className={`${f.icon} mr-1`} aria-hidden="true" />
                    {f.label}{' '}
                    <span aria-hidden="true">{f.ok ? '✓' : '✗'}</span>
                    <span className="sr-only">{f.ok ? '(available)' : '(not available)'}</span>
                  </span>
                ))}
              </div>
            </section>

            {/* Guide link */}
            {meta.trailGuideUrl && (
              <section className="bg-white border border-gray-200 rounded-xl p-6">
                <a
                  href={meta.trailGuideUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-[15px] bg-brand-dark text-white font-medium hover:bg-brand-mid transition-colors"
                >
                  <i className="fas fa-external-link-alt" aria-hidden="true" />Official Trail Guide
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </section>
            )}
          </div>

          {/* Right column */}
          <div className="lg:w-5/12 space-y-5">
            {/* Map */}
            {trail.lat && trail.lng && apiKey && (
              <section className="bg-white border border-gray-200 rounded-xl p-6">
                <h2 className="text-xl font-bold text-brand-dark border-b-2 border-brand-pale pb-2 mb-4">Trail Location</h2>
                <TrailMap lat={trail.lat} lng={trail.lng} trailName={trail.name} apiKey={apiKey} />
                <p className="text-gray-400 text-xs mt-2">
                  <i className="fas fa-map-marker-alt mr-1" aria-hidden="true" />
                  {trail.lat.toFixed(5)}, {trail.lng.toFixed(5)}
                </p>
              </section>
            )}

            {/* Weather */}
            <section className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-brand-dark border-b-2 border-brand-pale pb-2 mb-4">
                <i className="fas fa-cloud-sun mr-2" aria-hidden="true" />Live Weather
              </h2>
              <WeatherWidget lat={trail.lat} lng={trail.lng} regionKey={regionKey} />
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
