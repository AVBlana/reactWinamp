// server.js
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3001; // Use environment variable or default to 3001

app.use(bodyParser.json());

// Exchange code for tokens
app.post("/api/spotify/token", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://localhost:3000/callback", // Update with your redirect URI
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    res.json({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to get tokens" });
  }
});

// Refresh token
app.post("/api/spotify/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    res.json({
      accessToken: response.data.access_token,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to refresh token" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
