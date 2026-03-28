'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import type { TrailCardData, AiRecommendation } from '@/types/trail';
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
  // --- Filter state ---
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

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

  // --- AI state ---
  const [aiQuery, setAiQuery] = useState('');
  const [aiResults, setAiResults] = useState<AiRecommendation[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [showAllTrails, setShowAllTrails] = useState(false);

  async function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = aiQuery.trim();
    if (!q) return;
    setAiLoading(true);
    setAiError(null);
    setShowAllTrails(false);
    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      if (!res.ok) throw new Error('Request failed');
      const data: unknown = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid response');
      setAiResults(data as AiRecommendation[]);
    } catch {
      setAiError('Try rephrasing your search');
      setAiResults(null);
    } finally {
      setAiLoading(false);
    }
  }

  function clearAiResults() {
    setAiResults(null);
    setAiQuery('');
    setAiError(null);
    setShowAllTrails(false);
  }

  // Map trailId → reason for quick lookup when rendering cards
  const aiReasonMap = useMemo(() => {
    if (!aiResults) return new Map<number, string>();
    return new Map(aiResults.map(r => [r.trailId, r.reason]));
  }, [aiResults]);

  // AI picks in matchScore order, resolved to TrailCardData
  const aiPickedTrails = useMemo(() => {
    if (!aiResults) return [];
    return [...aiResults]
      .sort((a, b) => b.matchScore - a.matchScore)
      .map(r => trails.find(t => t.trailId === r.trailId))
      .filter((t): t is TrailCardData => t !== undefined);
  }, [aiResults, trails]);

  // Final list shown to the user
  const displayedTrails = useMemo(() => {
    if (!aiResults) return filteredTrails;
    if (showAllTrails) {
      const aiIds = new Set(aiResults.map(r => r.trailId));
      const rest = trails.filter(t => !aiIds.has(t.trailId));
      return [...aiPickedTrails, ...rest];
    }
    return aiPickedTrails;
  }, [aiResults, showAllTrails, filteredTrails, aiPickedTrails, trails]);

  const isAiMode = aiResults !== null;

  return (
    <>
      {/* AI search bar */}
      <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
        <p className="text-xs font-semibold text-green-800 mb-2 uppercase tracking-wide">
          ★ AI Trail Recommender
        </p>
        <form onSubmit={handleAiSubmit} className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={e => setAiQuery(e.target.value)}
            placeholder='e.g. "easy walk with wildlife near MRT"'
            disabled={aiLoading}
            className="flex-1 rounded-lg border border-green-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-green-500 focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={aiLoading || !aiQuery.trim()}
            className="flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {aiLoading ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Asking…
              </>
            ) : (
              'Ask AI'
            )}
          </button>
          {isAiMode && (
            <button
              type="button"
              onClick={clearAiResults}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Clear
            </button>
          )}
        </form>
        {aiError && (
          <p className="mt-2 text-xs text-red-600">{aiError}</p>
        )}
      </div>

      {/* AI mode banner */}
      {isAiMode && !showAllTrails && (
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 rounded-lg bg-green-100 px-4 py-2 text-sm">
          <span className="text-green-800 font-medium">
            Showing {aiPickedTrails.length} AI-recommended trail{aiPickedTrails.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setShowAllTrails(true)}
            className="text-green-700 underline hover:text-green-900 text-sm"
          >
            Show all {trails.length} trails
          </button>
        </div>
      )}

      {/* Standard filter dropdowns — hidden in AI mode */}
      {!isAiMode && (
        <>
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
        </>
      )}

      <hr className="border-[#ACACAC] mb-4" />

      {/* Trail count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing {displayedTrails.length} of {trails.length} trails
      </p>

      {/* Trail cards */}
      <div>
        {displayedTrails.map(trail => (
          <TrailCard
            key={trail.trailId}
            card={trail}
            aiReason={aiReasonMap.get(trail.trailId)}
          />
        ))}
        {displayedTrails.length === 0 && (
          <p className="text-center text-gray-500 py-12">No trails match the selected filters.</p>
        )}
      </div>
    </>
  );
}
