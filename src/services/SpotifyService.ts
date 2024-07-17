import axios from "axios";

const API_BASE_URL = "https://api.spotify.com/v1";
const API_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID || "";
const API_CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_API_KEY || "";

let accessToken: string | null = null;

const fetchSpotifyAccessToken = async () => {
  try {
    const credentials = `${API_CLIENT_ID}:${API_CLIENT_SECRET}`;
    const basicAuth = btoa(credentials);

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${basicAuth}`,
        },
      }
    );

    const { access_token } = response.data;
    accessToken = access_token;
    return access_token;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    throw error;
  }
};

export const setSpotifyToken = (token: string) => {
  accessToken = token;
};

export interface SpotifySong {
  name: string;
  artists: { name: string }[];
  album: {
    images: { url: string }[];
  };
}

export const searchSpotifyTrack = async (searchFor: string) => {
  try {
    if (!accessToken) {
      await fetchSpotifyAccessToken();
      if (!accessToken) {
        throw new Error("Failed to obtain Spotify access token");
      }
    }

    const response = await axios.get<{ tracks: { items: SpotifySong[] } }>(
      `${API_BASE_URL}/search`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          q: searchFor,
          type: "track",
          limit: 1,
        },
      }
    );

    return response.data.tracks.items[0]; // Return the first track item
  } catch (error) {
    console.error("Error searching Spotify tracks:", error);
    throw error;
  }
};
