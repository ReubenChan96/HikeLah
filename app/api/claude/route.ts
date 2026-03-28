import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// MOCK implementation — replace with real Anthropic SDK call in Phase 3.
// To activate: npm install @anthropic-ai/sdk, set ANTHROPIC_API_KEY, then
// replace the block marked "MOCK" below with a real client.messages.create call.

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const trails = await prisma.trail.findMany({
      where: { isActive: true },
      orderBy: { id: 'asc' },
    });

    if (trails.length === 0) {
      return NextResponse.json([]);
    }

    // MOCK: deterministically pick 3 trails based on a simple query hash.
    // The hash spreads picks across the trail list so different queries return
    // different results. Swap this entire block for the SDK call in Phase 3.
    const hash = query.trim().split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);

    const mockReasons = [
      `Top pick for "${query.trim()}" — well-maintained trail that fits your criteria.`,
      `Strong match for "${query.trim()}" — popular among hikers with similar interests.`,
      `Good fit for "${query.trim()}" — scenic route with convenient public transport access.`,
    ];

    const picked = new Set<number>();
    const results: { trailId: number; matchScore: number; reason: string }[] = [];

    for (let i = 0; results.length < Math.min(3, trails.length) && i < trails.length * 3; i++) {
      const idx = (hash + i * 7) % trails.length;
      if (!picked.has(idx)) {
        picked.add(idx);
        results.push({
          trailId: trails[idx].id,
          matchScore: 90 - results.length * 8,
          reason: mockReasons[results.length],
        });
      }
    }

    return NextResponse.json(results);
  } catch {
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}
