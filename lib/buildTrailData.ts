import type { Trail, TrailMeta, TrailCardData, TrailSighting } from '@/types/trail';

export function buildCardClasses(trail: Trail): string {
  const classes: string[] = [];
  if (trail.north)   classes.push('region-north');
  if (trail.south)   classes.push('region-south');
  if (trail.east)    classes.push('region-east');
  if (trail.west)    classes.push('region-west');
  if (trail.central) classes.push('region-central');

  const typeMap: Record<string, string> = {
    'Challenge Trails': 'type-challenge',
    'Nature Parks':     'type-park',
    'Park Connector':   'type-connector',
  };
  if (typeMap[trail.trailType]) classes.push(typeMap[trail.trailType]);

  if (trail.forestedTrail) classes.push('trail-forest');
  if (trail.casualWalk)    classes.push('trail-walk');
  if (trail.floraFaunaSpotting) classes.push('sight-ff');
  if (trail.wildlifeSpotting)   classes.push('sight-animal');

  return classes.join(' ');
}

export function buildPills(trail: Trail, meta: TrailMeta | undefined): string[] {
  const pills: string[] = [];

  const regions = (['north', 'south', 'east', 'west', 'central'] as const)
    .filter(r => trail[r])
    .map(r => r.charAt(0).toUpperCase() + r.slice(1));
  if (regions.length) pills.push(regions.join('-'));

  const typeLabel: Record<string, string> = {
    'Challenge Trails': 'Challenge Trail',
    'Nature Parks':     'Nature Park',
    'Park Connector':   'Park Connector',
  };
  if (typeLabel[trail.trailType]) pills.push(typeLabel[trail.trailType]);

  if (trail.forestedTrail && trail.casualWalk) pills.push('Mixed Trail');
  else if (trail.forestedTrail) pills.push('Offroad Trails');
  else if (trail.casualWalk)    pills.push('Paved Trails');

  if (trail.casualWalk) pills.push('Casual Walk');
  if (meta?.extraPills) pills.push(...meta.extraPills);

  return pills;
}

export function buildSightings(trail: Trail): TrailSighting[] {
  const sightings: TrailSighting[] = [];
  if (trail.floraFaunaSpotting) sightings.push({ icon: 'fa-leaf', tooltiptext: 'Flora & Fauna' });
  if (trail.wildlifeSpotting)   sightings.push({ icon: 'fa-paw',  tooltiptext: 'Wildlife' });
  return sightings;
}

export function buildCardData(trail: Trail, meta: TrailMeta | undefined): TrailCardData {
  return {
    trailId:          trail.id,
    cardClasses:      buildCardClasses(trail),
    cardLink:         `/trails/${trail.id}`,
    cardImage:        meta?.imageUrl || '/assets/img/explore-banner.png',
    cardAltText:      trail.name,
    cardHeaderSubtext: meta?.headerSubtext || '',
    cardTitle:        trail.name,
    cardPills:        buildPills(trail, meta),
    cardDistance:     meta?.distanceText || (trail.lengthKm ? `${trail.lengthKm}km` : ''),
    cardSightings:    buildSightings(trail),
    cardDescription:  trail.description || '',
  };
}
