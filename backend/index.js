const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;
const axios = require('axios');
const path = require('path');

app.use(cors());
app.use(express.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Proxy endpoint for Google Books API
app.get('/api/books', async (req, res) => {
  const { q, orderBy = 'relevance' } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing search query' });
  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q,
        orderBy,
        maxResults: 20,
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch from Google Books API' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 