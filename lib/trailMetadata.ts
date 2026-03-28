import type { TrailMeta } from '@/types/trail';
import rawMetadata from '@/public/data/trail-metadata.json';

export const trailMetadata = rawMetadata as Record<string, TrailMeta>;
