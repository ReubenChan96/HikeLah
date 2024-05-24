require('dotenv').config();
const express = require('express');
const app = express();
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const PORT = process.env.PORT || 3000; 

// Instantiate PrismaClient at the top with logging for prisma init
const prisma = new PrismaClient({
  log: ['query','info', 'warn', 'error'],
});
app.use(express.json());

// Set up EJS for templating
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes for each page
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/explore', (req, res) => {
  res.render('explore');
});

app.get('/about-me', (req, res) => {
    res.render('about-me');
});

app.get('/useful-links', (req, res) => {
    res.render('useful-links');
});

// Render Explore page with the generic google maps API key found in the .env file 
app.get('/map', (req, res) => {
    res.render('map', { apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

// Listens for which local host it is running on, because i used 3000, 4000 at different points in time
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});







