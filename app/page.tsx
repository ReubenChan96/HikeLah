import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Hikelah! — Singapore Trail Discovery',
};

const featureCards = [
  {
    img:   '/assets/img/recommend.png',
    alt:   'Discover trails',
    title: 'Discover Trails',
    href:  '/explore',
    desc:  "Browse 25+ curated Singapore trails with distance, difficulty, flora & fauna spotting, and everything you need to plan your next hike.",
  },
  {
    img:   '/assets/img/map.png',
    alt:   'Interactive map',
    title: 'Interactive Map',
    href:  '/map',
    desc:  'Explore the full NParks trail network on an interactive map. Find nearby MRT stations, plan your route, and see trails by type.',
  },
  {
    img:   '/assets/img/path.png',
    alt:   'Useful links',
    title: 'Useful Links',
    href:  '/useful-links',
    desc:  "Curated external resources from NParks, AllTrails, and more — for when you want to dig deeper into Singapore's outdoor scene.",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero */}
      <div className="flex flex-col md:flex-row items-center gap-8 py-8">
        <div className="md:w-5/12">
          <h1
            className="text-5xl font-extrabold leading-tight"
            style={{
              background: 'linear-gradient(147deg, #4A7212 45.2%, #6BA51A 61.74%, #7CBE1E 72.66%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Plan hikes<br />with ease!
          </h1>
          <p className="mt-4 text-base text-[#2D3748]">
            Your one-stop local hiking companion for Singapore&apos;s trails, park connector networks, and green spaces — all in one place.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              href="/explore"
              className="inline-block px-5 py-2 rounded-[15px] bg-brand-dark text-white font-medium text-lg hover:bg-brand-mid transition-colors"
            >
              Find Your Trail
            </Link>
            <Link
              href="/map"
              className="inline-block px-5 py-2 rounded-[15px] border-2 border-brand-dark text-brand-dark font-medium text-lg hover:bg-brand-pale transition-colors"
            >
              View Map
            </Link>
          </div>
        </div>
        <div className="md:w-7/12">
          <Image
            src="/assets/img/hikers.png"
            alt="Hikers on a Singapore trail"
            width={800}
            height={500}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Social proof strip */}
      <div className="flex flex-wrap justify-center gap-6 py-4 border-y border-gray-200 my-2 text-center">
        {[
          { stat: '25+', label: 'Curated trails' },
          { stat: '5',   label: 'Regions of Singapore' },
          { stat: '3',   label: 'Trail types' },
        ].map(({ stat, label }) => (
          <div key={label} className="px-6">
            <p className="text-3xl font-extrabold text-brand-dark">{stat}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-8">
        {featureCards.map(card => (
          <Link key={card.href} href={card.href} aria-label={`${card.title} — explore this section`} className="group text-center no-underline">
            <Image
              src={card.img}
              alt=""
              width={200}
              height={200}
              className="mx-auto"
            />
            <h4 className="text-[26px] font-extrabold text-brand-dark mt-2 group-hover:underline">
              {card.title}
            </h4>
            <p className="text-center text-[#2D3748] mt-1">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
