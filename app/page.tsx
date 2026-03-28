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
    desc:  "Learn about Singapore's major trails and park connector networks. Easy-to-consume info on distance, time, and cool animals and plants to see.",
  },
  {
    img:   '/assets/img/map.png',
    alt:   'Interactive map',
    title: 'Interactive Map',
    href:  '/map',
    desc:  'Want to see where the trails lead? Check out our custom maps to plan your hike, find nearby public transport, landmarks, and more!',
  },
  {
    img:   '/assets/img/path.png',
    alt:   'Useful links',
    title: 'Useful Links',
    href:  '/useful-links',
    desc:  "Can't find what you're looking for? Check out useful links that Hikelah recommends for more detailed information.",
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
            Start exploring with Hikelah! Your one-stop local hiking companion for Singapore&apos;s
            Park Connector Network, outdoor trails, and much more!
          </p>
          <Link
            href="/explore"
            className="inline-block mt-6 px-5 py-2 rounded-[15px] bg-brand-dark text-white font-medium text-lg hover:bg-brand-mid transition-colors"
          >
            Get Started
          </Link>
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

      <br />
      <div>
        <p className="text-[#2D3748]">
          Tired of walking the same paths? Unfamiliar with Singapore&apos;s trails? Plan your journey
          with ease with our…
        </p>
      </div>
      <br />

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-8">
        {featureCards.map(card => (
          <Link key={card.href} href={card.href} className="group text-center no-underline">
            <Image
              src={card.img}
              alt={card.alt}
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
