const express = require("express");
const axios = require("axios");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const ML_SERVICE = "http://localhost:8001";

app.post("/api/predict", async (req, res) => {
  try {
    console.log("Received prediction request:", req.body.homeTeam, "vs", req.body.awayTeam);
    const response = await axios.post(`${ML_SERVICE}/predict`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error("Predict error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message
    });
  }
});

app.get("/api/live-matches", async (req, res) => {
  try {
    const sport = req.query.sport || "football";
    const response = await axios.get(`${ML_SERVICE}/live-matches?sport=${sport}`);
    res.json(response.data);
  } catch (error) {
    console.error("Live matches error:", error.message);
    res.status(500).json({ error: error.message, matches: [], count: 0 });
  }
});

app.get("/api/past-matches", async (req, res) => {
  try {
    const sport = req.query.sport || "football";
    const response = await axios.get(`${ML_SERVICE}/past-matches?sport=${sport}`);
    res.json(response.data);
  } catch (error) {
    console.error("Past matches error:", error.message);
    res.status(500).json({ error: error.message, matches: [], count: 0 });
  }
});

app.get("/api/future-matches", async (req, res) => {
  try {
    const sport = req.query.sport || "football";
    const response = await axios.get(`${ML_SERVICE}/future-matches?sport=${sport}`);
    res.json(response.data);
  } catch (error) {
    console.error("Future matches error:", error.message);
    res.status(500).json({ error: error.message, matches: [], count: 0 });
  }
});

app.get("/api/live-match", async (req, res) => {
  try {
    const sport = req.query.sport || "cricket";
    const response = await axios.get(`${ML_SERVICE}/live-match?sport=${sport}`);
    res.json(response.data);
  } catch (error) {
    console.error("Live match error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// NEW: Model info endpoint
app.get("/api/model-info", async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE}/model-info`);
    res.json(response.data);
  } catch (error) {
    console.error("Model info error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// NEW: Global explainability endpoint
app.get("/api/explain", async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE}/explain`);
    res.json(response.data);
  } catch (error) {
    console.error("Explain error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// NEW: Stats endpoint
app.get("/api/stats", async (req, res) => {
  try {
    const response = await axios.get(`${ML_SERVICE}/stats`);
    res.json(response.data);
  } catch (error) {
    console.error("Stats error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// NEW: Retrain endpoint
app.post("/api/retrain", async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE}/retrain`);
    res.json(response.data);
  } catch (error) {
    console.error("Retrain error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
