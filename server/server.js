import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = "https://538849fba56a.ngrok-free.app/callback";

// Login endpoint
app.get("/login", (req, res) => {
  const scope = "user-top-read user-read-recently-played user-read-private user-read-email";
  res.redirect(
    `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}&scope=${scope}`
  );
});

// Callback endpoint
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

    res.redirect(`http://localhost:5173/?access_token=${response.data.access_token}`);
  } catch (error) {
    console.error("Error exchanging code for token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get tokens from Spotify" });
  }
});

// Get user profile
app.get("/profile", async (req, res) => {
  try {
    const { access_token } = req.query;
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error getting profile:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get profile" });
  }
});

// Get top tracks
app.get("/top-tracks", async (req, res) => {
  try {
    const { access_token, time_range = "medium_term", limit = 20 } = req.query;
    const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${time_range}&limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error getting top tracks:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get top tracks" });
  }
});

// Get recently played tracks
app.get("/recently-played", async (req, res) => {
  try {
    const { access_token, limit = 20 } = req.query;
    const response = await axios.get(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error getting recently played:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get recently played tracks" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});