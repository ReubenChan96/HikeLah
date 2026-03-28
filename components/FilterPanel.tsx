'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import type { TrailCardData } from '@/types/trail';
import TrailCard from './TrailCard';

const FILTER_GROUPS = [
  {
    label: 'Region',
    options: [
      { value: 'region-north',   label: 'North' },
      { value: 'region-south',   label: 'South' },
      { value: 'region-east',    label: 'East' },
      { value: 'region-west',    label: 'West' },
      { value: 'region-central', label: 'Central' },
    ],
  },
  {
    label: 'Type',
    options: [
      { value: 'type-challenge', label: 'Challenge Trail' },
      { value: 'type-park',      label: 'Nature Park' },
      { value: 'type-connector', label: 'Park Connector' },
    ],
  },
  {
    label: 'Terrain',
    options: [
      { value: 'trail-walk',   label: 'Paved Trails' },
      { value: 'trail-forest', label: 'Gravel/Off-road Trails' },
    ],
  },
];

export default function FilterPanel({ trails }: { trails: TrailCardData[] }) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside the filter bar
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterBarRef.current && !filterBarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleFilter(value: string) {
    setActiveFilters(prev =>
      prev.includes(value) ? prev.filter(f => f !== value) : [...prev, value]
    );
  }

  function getLabelFor(value: string): string {
    for (const group of FILTER_GROUPS) {
      const opt = group.options.find(o => o.value === value);
      if (opt) return opt.label;
    }
    return value;
  }

  const filteredTrails = useMemo(() => {
    if (activeFilters.length === 0) return trails;
    return trails.filter(trail => {
      const classes = trail.cardClasses.split(' ');
      return activeFilters.some(f => classes.includes(f));
    });
  }, [trails, activeFilters]);

  return (
    <>
      {/* Filter dropdowns */}
      <div ref={filterBarRef} className="flex flex-wrap justify-center gap-3 mb-4">
        {FILTER_GROUPS.map(group => (
          <div key={group.label} className="relative">
            <button
              className={`px-4 py-2 rounded border-2 border-brand-dark text-sm font-medium transition-colors ${
                openDropdown === group.label
                  ? 'bg-brand-dark text-white'
                  : 'bg-transparent text-brand-dark hover:bg-brand-dark hover:text-white'
              }`}
              onClick={() => setOpenDropdown(o => o === group.label ? null : group.label)}
            >
              {group.label} <span className="ml-1">▾</span>
            </button>
            {openDropdown === group.label && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                {group.options.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-brand-pale text-sm">
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(opt.value)}
                      onChange={() => toggleFilter(opt.value)}
                      className="accent-brand-light"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active filter pills + Clear All */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="font-semibold text-sm text-[#2D3748]">Selected filters:</span>
          {activeFilters.map(f => (
            <button
              key={f}
              onClick={() => toggleFilter(f)}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-brand-light text-white text-sm hover:opacity-80"
            >
              {getLabelFor(f)} <span className="text-xs">×</span>
            </button>
          ))}
          <button
            onClick={() => setActiveFilters([])}
            className="ml-2 text-sm text-gray-500 underline hover:text-gray-700"
          >
            Clear all
          </button>
        </div>
      )}

      <hr className="border-[#ACACAC] mb-4" />

      {/* Trail count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {filteredTrails.length} of {trails.length} trails
      </p>

      {/* Trail cards */}
      <div>
        {filteredTrails.map(trail => (
          <TrailCard key={trail.trailId} card={trail} />
        ))}
        {filteredTrails.length === 0 && (
          <p className="text-center text-gray-500 py-12">No trails match the selected filters.</p>
        )}
      </div>
    </>
  );
}
