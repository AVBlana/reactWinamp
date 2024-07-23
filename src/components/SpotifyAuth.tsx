import React from "react";

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
