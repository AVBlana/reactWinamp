import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/App";

const SpotifyAuth = () => {
  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:3000/callback";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "playlist-read-private",
    "playlist-modify-public",
    "playlist-modify-private",
  ].join(" ");

  const { setSpotifyToken } = useContext(AppContext);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");

    if (code) {
      // Exchange code for tokens
      fetch("/api/spotify/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          const { accessToken, refreshToken } = data;
          setSpotifyToken(accessToken); // Update context with token
          localStorage.setItem("access_token", accessToken); // Save access token
          localStorage.setItem("refresh_token", refreshToken); // Save refresh token
          window.location.href = "/"; // Redirect to home or desired route
        })
        .catch((error) => console.error("Error exchanging code:", error));
    }
  }, [setSpotifyToken]);

  return (
    <button className="spotBtn flex p-4 bg-green-600 text-white font-semibold rounded-md">
      <a
        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
      >
        Login to Spotify
      </a>
    </button>
  );
};

export default SpotifyAuth;
