import type { Metadata } from 'next';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { trailMetadata } from '@/lib/trailMetadata';
import { buildCardData } from '@/lib/buildTrailData';
import FilterPanel from '@/components/FilterPanel';

export const metadata: Metadata = { title: "Let's Hike! — Hikelah!" };

export default async function ExplorePage() {
  const dbTrails = await prisma.trail.findMany({ orderBy: { id: 'asc' } });
  const trails = dbTrails.map(t => buildCardData(t as Parameters<typeof buildCardData>[0], trailMetadata[t.name]));

  return (
    <div>
      {/* Banner image */}
      <div className="container mx-auto px-4 flex justify-center mb-6">
        <Image
          src="/assets/img/explore-banner.png"
          alt="Singapore hiking trail"
          width={1200}
          height={400}
          className="w-full h-auto rounded-xl"
          priority
        />
      </div>

      <div className="container mx-auto px-4">
        <h1 className="text-center text-5xl font-extrabold text-brand-dark mb-8">
          Let&apos;s Hike!
        </h1>
        <FilterPanel trails={trails} />
      </div>
    </div>
  );
}
