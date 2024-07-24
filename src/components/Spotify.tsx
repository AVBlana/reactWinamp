import React, { useState, useEffect, useContext } from "react";
import { TrackType } from "./SpotifyTrack";
import { Song } from "../context/Playing";
import Tracklist from "./Tracklist";
import Playlist from "./SpotifyPlaylist";
import SpotSearch from "./SpotifySearch";
import SpotifyAuth from "./SpotifyAuth";
import {
  fetchCurrentUser,
  saveTrack,
  createPlaylist,
} from "../services/SpotifyService";
import { AppContext } from "../context/App";

type User = {
  id: string;
  display_name: string;
  images: { url: string }[];
};

const Spotify: React.FC = () => {
  const { handleLogin } = useContext(AppContext);

  const [tracklist, setTracklist] = useState<TrackType[]>([]);
  const [playlist, setPlaylist] = useState<TrackType[]>([]);
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

  const updateTracklist = (array: TrackType[]) => {
    setTracklist(array);
  };

  const addToPlaylist = (newTrack: TrackType) => {
    if (!playlist.some((t) => t.id === newTrack.id)) {
      setPlaylist((prev) => [...prev, newTrack]);
    }
  };

  const removeFromSpotifyPlaylist = (trackId: string) => {
    setPlaylist((prev) => prev.filter((n) => n.id !== trackId));
  };

  const handleSaveTrack = async (trackId: string) => {
    try {
      await saveTrack(trackId, spotifyToken || "");
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
          playlist.map((track) => track.uri),
          spotifyToken || ""
        );
        setPlaylist([]);
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
              playlist={playlist}
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

export default Spotify;
