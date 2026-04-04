'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/',             label: 'Home' },
  { href: '/explore',      label: 'Explore' },
  { href: '/map',          label: 'Trail Map' },
  { href: '/useful-links', label: 'Useful Links' },
  { href: '/about-me',     label: 'About Me' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  // Move focus to first menu link when menu opens
  useEffect(() => {
    if (open) {
      const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>('a');
      firstLink?.focus();
    }
  }, [open]);

  // Escape closes menu and restores focus to hamburger button
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open]);

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
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`px-4 py-2 text-[18px] transition-all ${
                  isActive(link.href)
                    ? 'text-brand-dark font-bold underline'
                    : 'text-[#2D3748] hover:underline hover:font-bold'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          ref={buttonRef}
          className="md:hidden p-2 rounded text-[#2D3748]"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          aria-controls="mobile-menu"
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
        <ul id="mobile-menu" ref={menuRef} className="md:hidden flex flex-col items-end pb-4 gap-1">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`block px-4 py-2 text-[18px] hover:underline ${
                  isActive(link.href) ? 'text-brand-dark font-bold underline' : 'text-[#2D3748]'
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <hr className="border-[#ACACAC]" />
    </div>
  );
}
