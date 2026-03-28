import Link from 'next/link';
import Image from 'next/image';
import type { TrailCardData } from '@/types/trail';

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy:     'bg-green-100 text-green-800',
  Moderate: 'bg-orange-100 text-orange-800',
  Hard:     'bg-red-100 text-red-800',
};

export default function TrailCard({ card, aiReason }: { card: TrailCardData; aiReason?: string }) {
  return (
    <div className={`mb-4 ${card.cardClasses}`}>
      <Link href={card.cardLink} className="no-underline text-inherit">
        <div className="rounded-xl border-2 border-transparent hover:border-brand-dark transition-colors bg-white overflow-hidden cursor-pointer">
          {aiReason && (
            <div className="relative group bg-green-600 text-white text-xs font-semibold px-4 py-1.5 flex items-center gap-2 select-none">
              <span>★ AI Pick</span>
              <span className="opacity-75 font-normal truncate">{aiReason}</span>
              <div className="pointer-events-none absolute top-full left-4 mt-1 hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg px-3 py-2 z-20 w-72 shadow-xl leading-relaxed">
                {aiReason}
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="md:w-1/3 flex-shrink-0">
              <div className="relative h-48 md:h-full min-h-[160px]">
                <Image
                  src={card.cardImage}
                  alt={card.cardAltText}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>

            {/* Content */}
            <div className="md:w-2/3 p-4 flex flex-col justify-center">
              {card.cardHeaderSubtext && (
                <p className="text-sm italic font-light text-gray-500 mb-1">{card.cardHeaderSubtext}</p>
              )}

              {/* Title + difficulty badge */}
              <div className="flex items-start gap-2 mb-2 flex-wrap">
                <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748]">{card.cardTitle}</h2>
                {card.difficulty && (
                  <span className={`mt-1.5 px-2 py-0.5 rounded text-xs font-semibold ${DIFFICULTY_STYLES[card.difficulty] ?? 'bg-gray-100 text-gray-700'}`}>
                    {card.difficulty}
                  </span>
                )}
              </div>

              {/* Pills */}
              <div className="flex flex-wrap gap-1 mb-2">
                {card.cardPills.map(pill => (
                  <span
                    key={pill}
                    className="px-3 py-1 rounded-full text-sm bg-brand-light text-white"
                  >
                    {pill}
                  </span>
                ))}
              </div>

              {/* Distance + MRT */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2 text-sm">
                <span>
                  <span className="text-[#2D3748]">Distance: </span>
                  <span className="font-bold text-brand-dark">{card.cardDistance}</span>
                </span>
                {card.nearestMRT && (
                  <span className="text-[#2D3748]">
                    <i className="fas fa-train mr-1 text-brand-dark" />
                    {card.nearestMRT} MRT
                  </span>
                )}
              </div>

              {/* Sightings */}
              <div className="flex items-center gap-2 mb-2 text-sm">
                <span className="text-[#2D3748]">Sightings:</span>
                {card.cardSightings.map(s => (
                  <span key={s.icon} className="relative group">
                    <i className={`fas ${s.icon} text-brand-dark text-lg`} />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      {s.tooltiptext}
                    </span>
                  </span>
                ))}
                {card.cardSightings.length === 0 && <span className="text-gray-400">—</span>}
              </div>

              {card.cardDescription && (
                <p className="text-sm text-[#2D3748] line-clamp-2">{card.cardDescription}</p>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
