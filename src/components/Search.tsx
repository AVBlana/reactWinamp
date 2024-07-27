import React, { useContext, useEffect, useState } from "react";
import {
  createPlaylist,
  fetchCurrentUser,
  savePlaylistToSpotify,
} from "../services/SpotifyService";
import SpotifyAuth from "./SpotifyAuth";
import Playlist from "./SpotifyPlaylist";
import SpotSearch from "./SpotifySearch";
import Tracklist from "./Tracklist";
import { PlayingContext } from "../context/Playing";
import { Song } from "../types/playerTypes";

interface User {
  id: string;
  display_name: string;
  images: { url: string }[];
}

export const Search: React.FC = () => {
  const { spotifyPlaylist, setSpotifyPlaylist } = useContext(PlayingContext);
  const [tracklist, setTracklist] = useState<Song[]>([]);
  const [playlistName, setPlaylistName] = useState("");
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
  const [spotifyUser, setSpotifyUser] = useState<User | null>(null);
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);

  useEffect(() => {
    const initializeSpotifyToken = () => {
      const hash = window.location.hash;
      let accessToken: string | null = localStorage.getItem("token");

      if (!accessToken && hash) {
        accessToken =
          hash
            .substring(1)
            .split("&")
            .find((elem) => elem.startsWith("access_token"))
            ?.split("=")[1] || null;

        window.location.hash = "";
        if (accessToken) {
          localStorage.setItem("token", accessToken);
        }
      }
      setSpotifyToken(accessToken);
      setIsSpotifyLoggedIn(!!accessToken);
    };

    initializeSpotifyToken();
  }, []);

  useEffect(() => {
    const fetchSpotifyUserData = async () => {
      if (spotifyToken) {
        try {
          const userData = await fetchCurrentUser(spotifyToken);
          setSpotifyUser(userData);
        } catch (error) {
          console.error("Error fetching Spotify user data:", error);
        }
      }
    };

    fetchSpotifyUserData();
  }, [spotifyToken]);

  const updateTracklist = (array: Song[]) => {
    setTracklist(array);
  };

  const addToPlaylist = (newTrack: Song) => {
    if (!spotifyPlaylist.some((t) => t.id === newTrack.id)) {
      setSpotifyPlaylist((prev) => [...prev, newTrack]);
    }
  };

  const removeFromSpotifyPlaylist = (trackId: string) => {
    setSpotifyPlaylist((prev) => prev.filter((n) => n.id !== trackId));
  };

  const handleSaveTrack = async (trackId: string) => {
    try {
      await savePlaylistToSpotify(trackId, spotifyToken || "");
    } catch (error) {
      console.error("Error saving track:", error);
    }
  };

  const handleCreateSpotifyPlaylist = async () => {
    if (spotifyUser) {
      const userId = spotifyUser.id;
      try {
        await createPlaylist(
          userId,
          playlistName,
          spotifyPlaylist.map(
            (track) => `https://open.spotify.com/track/${track.id}`
          ),
          spotifyToken || ""
        );
        setSpotifyPlaylist([]);
        setPlaylistName("");
        alert(`Your playlist ${playlistName} was successfully created!`);
      } catch (error) {
        console.error("Error creating playlist:", error);
      }
    }
  };

  return (
    <div>
      <p className="font-bold text-lg">Spotify DB</p>
      <div>
        {spotifyUser ? (
          <>
            {spotifyUser.images && spotifyUser.images.length > 0 && (
              <button
                className="p-2 bg-red-700"
                onClick={() => {
                  localStorage.removeItem("token");
                  setSpotifyToken(null);
                  setSpotifyUser(null);
                  setIsSpotifyLoggedIn(false);
                }}
              >
                <img
                  alt={spotifyUser.display_name}
                  src={spotifyUser.images[0].url}
                />
              </button>
            )}
            <button
              className="p-2 bg-green-700 text-white"
              onClick={() => {
                localStorage.removeItem("token");
                setSpotifyToken(null);
                setSpotifyUser(null);
                setIsSpotifyLoggedIn(false);
              }}
            >
              <b>Logout {spotifyUser.display_name}</b>
            </button>
          </>
        ) : (
          <SpotifyAuth />
        )}
      </div>
      {spotifyToken && (
        <>
          <SpotSearch
            token={spotifyToken || ""}
            updateTracklist={updateTracklist}
          />
          <div className="flex">
            <Tracklist
              data={tracklist}
              addToPlaylist={addToPlaylist}
              saveTrack={handleSaveTrack}
            />
            <Playlist
              playlist={spotifyPlaylist}
              removeFromPlaylist={removeFromSpotifyPlaylist}
              setPlaylistName={setPlaylistName}
              playlistName={playlistName}
              createPlaylist={handleCreateSpotifyPlaylist}
              token={spotifyToken || ""}
              currentUser={fetchCurrentUser}
            />
          </div>
        </>
      )}
    </div>
  );
};
