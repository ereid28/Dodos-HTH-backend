require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Score = require('./models/Score');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Submit or Update Score
app.post('/api/submit-score', async (req, res) => {
  const { name, ecoScore } = req.body;
  if (!name || ecoScore == null) return res.status(400).send('Missing fields');

  await Score.findOneAndUpdate(
    { name }, // Match by name
    { ecoScore, timestamp: Date.now() }, // Update fields
    { upsert: true, new: true } // Create if not exists
  );

  res.status(200).send('Score submitted or updated!');
});

// Delete Score by Name
app.post('/api/delete-score', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send('Missing name');

  await Score.deleteMany({ name });
  res.status(200).send('Score deleted!');
});

// Get Leaderboard
app.get('/api/leaderboard', async (req, res) => {
  const scores = await Score.find().sort({ ecoScore: -1 });
  res.json(scores);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
