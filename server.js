require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Score = require('./models/Score');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post('/api/submit-score', async (req, res) => {
  const { name, ecoScore } = req.body;
  if (!name || ecoScore == null) return res.status(400).send('Missing fields');
  await new Score({ name, ecoScore }).save();
  res.status(200).send('Score submitted!');
});

app.get('/api/leaderboard', async (req, res) => {
  const scores = await Score.find().sort({ ecoScore: -1 }).limit(20);
  res.json(scores);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
