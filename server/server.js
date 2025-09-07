import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'https://d4aa76462a32.ngrok-free.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "https://d4aa76462a32.ngrok-free.app/callback";

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Login endpoint
app.get("/login", (req, res) => {
  const scope = "user-top-read user-read-recently-played user-read-private user-read-email";
  res.redirect(
    `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}&scope=${scope}`
  );
});

// Callback endpoint - UPDATED to include refresh token
app.get("/callback", async (req, res) => {
  try {
    const code = req.query.code || null;

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Extract both access and refresh tokens
    const { access_token, refresh_token } = response.data;
    
    // Redirect with both tokens
    res.redirect(`http://localhost:5173/?access_token=${access_token}&refresh_token=${refresh_token}`);
  } catch (error) {
    console.error("Error exchanging code for token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get tokens from Spotify" });
  }
});

// NEW ENDPOINT: Token refresh
app.post("/refresh-token", async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return res.status(400).json({ error: "Refresh token is required" });
    }

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
        client_id: client_id,
        client_secret: client_secret,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error refreshing token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to refresh token" });
  }
});

// Get user profile
app.get("/profile", async (req, res) => {
  try {
    const { access_token } = req.query;
    
    if (!access_token) {
      return res.status(400).json({ error: "Access token is required" });
    }

    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("Error getting profile:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to get profile",
      details: error.response?.data || error.message
    });
  }
});

// Get top tracks
app.get("/top-tracks", async (req, res) => {
  try {
    const { access_token, time_range = "medium_term", limit = 20 } = req.query;
    
    if (!access_token) {
      return res.status(400).json({ error: "Access token is required" });
    }

    const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("Error getting top tracks:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to get top tracks",
      details: error.response?.data || error.message
    });
  }
});

// Get recently played tracks
app.get("/recently-played", async (req, res) => {
  try {
    const { access_token, limit = 20 } = req.query;
    
    if (!access_token) {
      return res.status(400).json({ error: "Access token is required" });
    }

    const response = await axios.get(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("Error getting recently played:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to get recently played tracks",
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});