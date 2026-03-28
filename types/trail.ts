export interface Trail {
  id: number;
  name: string;
  trailType: string;
  description: string | null;
  lengthKm: number | null;
  casualWalk: boolean;
  forestedTrail: boolean;
  floraFaunaSpotting: boolean;
  wildlifeSpotting: boolean;
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
  central: boolean;
  difficulty: string | null;
  estimatedHours: number | null;
  elevationGainM: number | null;
  terrainType: string | null;
  nearestMRT: string | null;
  parkingAvail: string | null;
  dogFriendly: boolean;
  wheelchairAccess: boolean;
  toilets: boolean;
  shelters: boolean;
  isActive: boolean;
  closureReason: string | null;
  closureUntil: Date | null;
  lat: number | null;
  lng: number | null;
}

export interface TrailMeta {
  imageUrl: string;
  trailGuideUrl: string;
  headerSubtext: string;
  distanceText: string;
  extraPills: string[];
}

export interface TrailSighting {
  icon: string;
  tooltiptext: string;
}

export interface TrailCardData {
  trailId: number;
  cardClasses: string;
  cardLink: string;
  cardImage: string;
  cardAltText: string;
  cardHeaderSubtext: string;
  cardTitle: string;
  cardPills: string[];
  cardDistance: string;
  cardSightings: TrailSighting[];
  cardDescription: string;
  difficulty: string | null;
  nearestMRT: string | null;
}

export interface AiRecommendation {
  trailId: number;
  matchScore: number;
  reason: string;
}
