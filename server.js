const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Contact = require('./models/Contact');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI || '';

if (MONGO_URI) {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
} else {
  console.warn('MONGODB_URI not set. Contact API will not persist data.');
}

// Serve static frontend
const publicDir = path.join(__dirname);
app.use(express.static(publicDir));

// GET resume JSON
app.get('/api/resume', (req, res) => {
  const resumePath = path.join(__dirname, 'resume.json');
  fs.readFile(resumePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to load resume' });
    try {
      const json = JSON.parse(data);
      res.json(json);
    } catch (e) {
      res.status(500).json({ error: 'Invalid resume format' });
    }
  });
});

// POST contact message
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    if (!MONGO_URI) return res.status(500).json({ error: 'Database not configured' });
    const contact = new Contact({ name, email, phone, message });
    await contact.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
