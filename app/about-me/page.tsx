import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = { title: 'About Me — Hikelah!' };

export default function AboutMePage() {
  return (
    <div className="container mx-auto px-4">
      {/* Problem statement card */}
      <div className="mt-4">
        <Link
          href="https://www.figma.com/design/Hg7585Wl3wCGZPrZ6a9oTt/1.-HikeLah_Wireframe?node-id=454%3A949&t=eVVKcbRrSnGPu7Um-1"
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
        >
          <div className="rounded-xl border border-gray-200 bg-white p-6 cursor-pointer hover:border-brand-dark transition-colors">
            <h5 className="text-[26px] font-extrabold text-brand-dark mb-2">
              Problem Statement [Click to learn more]:
            </h5>
            <p className="text-[#2D3748]">
              <strong>Outdoor trail seekers planning their next adventure</strong> feel it is{' '}
              <strong>time-consuming and frustrating to find accurate and updated information about trails in Singapore.</strong>{' '}
              As a result, <strong>they are discouraged from trying unexplored trails altogether</strong>. They are also{' '}
              <strong>less likely to explore Singapore because it is more tedious and unpleasant.</strong>
            </p>
          </div>
        </Link>
      </div>

      <br />

      <div>
        <h1 className="text-5xl font-extrabold text-brand-dark">About Me</h1>
        <h2 className="text-2xl font-light mt-2">Reuben Chan — Smart Nation Group (Data Strategy and Architecture)</h2>
        <br />
        <div className="flex gap-3">
          <a
            href="https://github.com/ReubenChan96"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#333] text-white hover:bg-[#555] transition-colors"
          >
            <i className="fab fa-github" /> My GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/reubenc96/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#0a66c2] text-white hover:bg-[#0850a0] transition-colors"
          >
            <i className="fab fa-linkedin" /> My LinkedIn
          </a>
        </div>
      </div>

      <br />

      <div className="text-center mb-6">
        <Image
          src="/assets/img/Reuben_tech4pg.jpg"
          alt="Image of Reuben"
          width={600}
          height={400}
          className="max-h-[500px] w-auto mx-auto object-contain"
        />
      </div>

      <br />

      <div className="space-y-4 text-[#2D3748] pb-8">
        <p>
          Hey there 🌟 Navigating the complexities of our world is what drives me, and I&apos;m on a
          mission to unravel its intricacies. I thrive on problems that deal with challenging
          socio-economic conditions, striving to create a positive impact on society.
        </p>
        <p>
          Presently, I&apos;m delving into the ever-evolving digital landscape, exploring the latest
          innovations that shape our world and developing Singapore to become a world class Smart
          Nation. I&apos;m deeply interested in how to build valuable, cost-efficient products right,
          and figuring out how the public service can transform itself to be a modern, digital-first
          workforce. Today, I hold a concurrent position with the Data Strategy and Data Architecture
          teams to develop the next bound of Government Data Architecture.
        </p>
        <p>
          Beyond work, you&apos;ll often find me immersed in the latest tech trends, crafting scale
          models, or exploring the great outdoors on foot, my bike or kayak. 🚀
        </p>
      </div>
    </div>
  );
}
