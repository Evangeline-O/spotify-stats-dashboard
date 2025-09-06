import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
// Use your CURRENT ngrok URL (from your screenshot)
const redirect_uri = "https://538849fba56a.ngrok-free.app/callback";

app.get("/login", (req, res) => {
  const scope = "user-top-read user-read-recently-played";
  res.redirect(
    `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${encodeURIComponent(
      redirect_uri
    )}&scope=${scope}`
  );
});

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

    res.json(response.data);
  } catch (error) {
    console.error("Error exchanging code for token:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get tokens from Spotify" });
  }
});

// CRUCIAL: Server must listen on port 4000 to match your ngrok tunnel
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Login URL: https://538849fba56a.ngrok-free.app/login`);
});