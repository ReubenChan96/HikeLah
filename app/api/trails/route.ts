import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const trails = await prisma.trail.findMany({ orderBy: { id: 'asc' } });
    return NextResponse.json(trails);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch trails' }, { status: 500 });
  }
}
