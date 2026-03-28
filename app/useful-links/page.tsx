import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Useful Links — Hikelah!' };

const links = [
  {
    href:    'https://pcn.nparks.gov.sg/',
    label:   'Route Info',
    title:   'NParks Official PCN',
    img:     '/assets/img/Nparks-PCN-logo.png',
    imgAlt:  'NParks PCN Logo',
    desc:    'More info on NParks Park Connector Network (PCN), linking major parks with over 380 km of scenic trails for cycling, jogging, and walking.',
    imgStyle: 'w-full h-auto mt-2',
  },
  {
    href:    'https://www.nparks.gov.sg/florafaunaweb',
    label:   'Plant Guides',
    title:   'NParks Botanical Guide',
    img:     '/assets/img/Flora-fauna-nparks.png',
    imgAlt:  'NParks Flora and Fauna Web',
    desc:    'An official database of plants and animals found in Singapore.',
    imgStyle: 'max-h-[150px] w-auto mx-auto object-contain mt-2',
  },
  {
    href:    'https://www.facebook.com/groups/179531089457/',
    label:   'Animal Guides',
    title:   'Animal Sightings FB',
    img:     '/assets/img/animal-sightings.png',
    imgAlt:  'Singapore Animal Sighting FB',
    desc:    "A Facebook community page on public encounters with Singapore's wildlife, check it out!",
    imgStyle: 'w-full h-auto mt-2',
  },
];

export default function UsefulLinksPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-5xl font-extrabold text-brand-dark">Useful Links</h1>
      <h4 className="text-2xl font-light mt-2">Check out some helpful resources below to get you started</h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 pb-8">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <div className="rounded-xl border border-gray-200 bg-white p-4 h-full cursor-pointer hover:border-brand-dark transition-colors">
              <p className="text-sm italic font-light text-gray-500">{link.label}</p>
              <h3 className="text-xl font-bold text-[#2D3748] mt-1">{link.title}</h3>
              <div className="flex items-center justify-center overflow-hidden h-[150px] my-3">
                <Image
                  src={link.img}
                  alt={link.imgAlt}
                  width={300}
                  height={150}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <p className="text-[#2D3748] text-sm">{link.desc}</p>
            </div>
          </Link>
        ))}

        {/* "Can't find what you're looking for?" card */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 h-full">
          <h3 className="text-xl font-bold text-[#2D3748]">Cannot find what you are looking for?</h3>
          <p className="text-[#2D3748] text-sm mt-3">
            <a href="mailto:reubenc24@hotmail.com" className="text-brand-dark hover:underline">
              Email us
            </a>{' '}
            and tell us which links you frequently use!
          </p>
        </div>
      </div>
    </div>
  );
}
