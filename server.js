require('dotenv').config();
const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // required for inline GA4 + Google Maps callbacks
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://maps.googleapis.com",
        "https://www.googletagmanager.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://fonts.googleapis.com",
      ],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https://maps.gstatic.com", "https://maps.googleapis.com"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // required for Google Maps to load
}));

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Load display-only metadata (image paths, guide URLs, extra pills) keyed by trail name
const trailMetadata = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/data/trail-metadata.json'), 'utf8')
);

// Derive CSS filter classes from DB boolean fields
function buildCardClasses(trail) {
  const classes = [];
  if (trail.north) classes.push('region-north');
  if (trail.south) classes.push('region-south');
  if (trail.east) classes.push('region-east');
  if (trail.west) classes.push('region-west');
  if (trail.central) classes.push('region-central');

  const typeMap = { 'Challenge Trails': 'type-challenge', 'Nature Parks': 'type-park', 'Park Connector': 'type-connector' };
  if (typeMap[trail.trailType]) classes.push(typeMap[trail.trailType]);

  if (trail.forestedTrail) classes.push('trail-forest');
  if (trail.casualWalk) classes.push('trail-walk');
  if (trail.floraFaunaSpotting) classes.push('sight-ff');
  if (trail.wildlifeSpotting) classes.push('sight-animal');

  return classes.join(' ');
}

// Derive display pills from DB fields + metadata extra pills
function buildPills(trail, meta) {
  const pills = [];
  const regions = ['north', 'south', 'east', 'west', 'central']
    .filter(r => trail[r])
    .map(r => r.charAt(0).toUpperCase() + r.slice(1));
  if (regions.length) pills.push(regions.join('-'));

  const typeLabel = { 'Challenge Trails': 'Challenge Trail', 'Nature Parks': 'Nature Park', 'Park Connector': 'Park Connector' };
  if (typeLabel[trail.trailType]) pills.push(typeLabel[trail.trailType]);

  if (trail.forestedTrail && trail.casualWalk) pills.push('Mixed Trail');
  else if (trail.forestedTrail) pills.push('Offroad Trails');
  else if (trail.casualWalk) pills.push('Paved Trails');

  if (trail.casualWalk) pills.push('Casual Walk');

  if (meta?.extraPills) pills.push(...meta.extraPills);
  return pills;
}

// Build sightings icon array from DB booleans
function buildSightings(trail) {
  const sightings = [];
  if (trail.floraFaunaSpotting) sightings.push({ icon: 'fa-leaf', tooltiptext: 'Flora & Fauna' });
  if (trail.wildlifeSpotting) sightings.push({ icon: 'fa-paw', tooltiptext: 'Wildlife' });
  return sightings;
}

// Merge DB trail with display metadata
function buildCardData(trail) {
  const meta = trailMetadata[trail.name] || {};
  return {
    cardClasses: buildCardClasses(trail),
    cardLink: meta.trailGuideUrl || '#',
    cardImage: meta.imageUrl || '/assets/img/explore-banner.png',
    cardAltText: trail.name,
    cardHeaderSubtext: meta.headerSubtext || '',
    cardTitle: trail.name,
    cardPills: buildPills(trail, meta),
    cardDistance: meta.distanceText || `${trail.lengthKm}km`,
    cardSightings: buildSightings(trail),
    cardDescription: trail.description || '',
  };
}

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/explore', async (req, res) => {
  try {
    const dbTrails = await prisma.trail.findMany({ orderBy: { id: 'asc' } });
    const trails = dbTrails.map(buildCardData);
    res.render('explore', { trails });
  } catch (err) {
    console.error('Failed to load trails from DB:', err);
    res.render('explore', { trails: [] });
  }
});

app.get('/api/trails', async (req, res) => {
  try {
    const trails = await prisma.trail.findMany({ orderBy: { id: 'asc' } });
    res.json(trails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch trails' });
  }
});

// TODO: Implement Claude integration — scope TBD
// Suggested use: trail recommendations, natural-language search, or a chat assistant
app.post('/api/claude', async (req, res) => {
  res.status(501).json({ message: 'Claude integration not yet implemented' });
});

app.get('/about-me', (req, res) => {
  res.render('about-me');
});

app.get('/useful-links', (req, res) => {
  res.render('useful-links');
});

app.get('/map', (req, res) => {
  res.render('map', { apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
