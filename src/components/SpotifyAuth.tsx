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

  const { spotifyToken, refreshSpotifyToken, handleSpotifyLogout } =
    useContext(AppContext);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.href.split("#")[1]);
    const accessToken = queryParams.get("access_token");

    if (accessToken) {
      localStorage.setItem("token", accessToken); // Save refresh token
      refreshSpotifyToken();
    }
  }, [refreshSpotifyToken]);

  if (spotifyToken) {
    return <button onClick={handleSpotifyLogout}>Logout Spotify</button>;
  }

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
