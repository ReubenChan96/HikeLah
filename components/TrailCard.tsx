import Link from 'next/link';
import Image from 'next/image';
import type { TrailCardData } from '@/types/trail';

export default function TrailCard({ card }: { card: TrailCardData }) {
  return (
    <div className={`mb-4 ${card.cardClasses}`}>
      <Link href={card.cardLink} className="no-underline text-inherit">
        <div className="rounded-xl border-2 border-transparent hover:border-brand-dark transition-colors bg-white overflow-hidden cursor-pointer">
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
              <h2 className="text-2xl md:text-3xl font-bold text-[#2D3748] mb-2">{card.cardTitle}</h2>

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

              {/* Distance */}
              <div className="flex items-center gap-2 mb-1 text-sm">
                <span className="text-[#2D3748]">Distance:</span>
                <span className="font-bold text-brand-dark">{card.cardDistance}</span>
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
