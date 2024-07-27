import React, { useContext } from "react";
import SpotifyAuth from "./SpotifyAuth";
import { AppContext } from "../context/App";

export const SpotifyLogin: React.FC = () => {
  const { spotifyToken, handleSpotifyLogout } = useContext(AppContext);
  return (
    <div>
      <p className="font-bold text-lg">Spotify DB</p>
      <div>
        {spotifyToken ? (
          <>
            <button
              className="p-2 bg-green-700 text-white"
              onClick={handleSpotifyLogout}
            >
              <b>Logout</b>
            </button>
          </>
        ) : (
          <SpotifyAuth />
        )}
      </div>
    </div>
  );
};
