import express, { json } from "express";
import cors from "cors";
import { post } from "axios";
import { stringify } from "querystring";

const app = express();
app.use(cors());
app.use(json());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/callback";

app.post("/login", async (req, res) => {
  const code = req.body.code;
  try {
    const response = await post(
      "https://accounts.spotify.com/api/token",
      stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri,
        client_id,
        client_secret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      expiresIn: response.data.expires_in,
    });
  } catch (error) {
    res.sendStatus(400);
  }
});

app.post("/refresh", async (req, res) => {
  const refreshToken = req.body.refreshToken;
  try {
    const response = await post(
      "https://accounts.spotify.com/api/token",
      stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id,
        client_secret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({
      accessToken: response.data.access_token,
      expiresIn: response.data.expires_in,
    });
  } catch (error) {
    res.sendStatus(400);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
