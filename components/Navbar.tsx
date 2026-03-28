'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { href: '/',             label: 'Home' },
  { href: '/explore',      label: 'Explore' },
  { href: '/map',          label: 'Interactive Map' },
  { href: '/useful-links', label: 'Useful Links' },
  { href: '/about-me',     label: 'About Me' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="container mx-auto px-4">
      <nav className="flex items-center justify-between py-3">
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/assets/img/hikelah-logo-alpha-2.svg"
            alt="Hikelah logo"
            width={233}
            height={84}
            priority
            className="h-16 w-auto"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-1">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="px-4 py-2 text-[18px] text-[#2D3748] hover:underline hover:font-bold transition-all"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded text-[#2D3748]"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <ul className="md:hidden flex flex-col items-end pb-4 gap-1">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-4 py-2 text-[18px] text-[#2D3748] hover:underline"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <hr className="border-[#ACACAC]" />
      <br />
    </div>
  );
}
