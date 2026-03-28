import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const trails = await prisma.trail.findMany({
      orderBy: { id: 'asc' },
      select: {
        id: true, name: true, trailType: true, description: true,
        lengthKm: true, difficulty: true, estimatedHours: true, terrainType: true,
        nearestMRT: true, parkingAvail: true, dogFriendly: true, wheelchairAccess: true,
        toilets: true, shelters: true, isActive: true, closureReason: true, closureUntil: true,
        lat: true, lng: true, elevationGainM: true,
        north: true, south: true, east: true, west: true, central: true,
        casualWalk: true, forestedTrail: true, floraFaunaSpotting: true, wildlifeSpotting: true,
      },
    });
    return NextResponse.json(trails);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch trails' }, { status: 500 });
  }
}
