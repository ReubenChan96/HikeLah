require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS for templating
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Define routes for each page
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about_me', (req, res) => {
    res.render('about_me');
});

app.get('/map', (req, res) => {
    res.render('map', { apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
