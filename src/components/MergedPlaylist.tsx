import React, { useState, useContext, useEffect, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
import { PlayingContext } from "../context/Playing";
import SpotifyPlayer from "./players/SpotifyPlayer";
import { FaCirclePlay } from "react-icons/fa6";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import YtPlayer from "./players/YtPlayer";
import { ServiceType, Song } from "../types/playerTypes";

interface MergedPlaylistProps {
  spotifyPlaylist: Song[];
  youtubePlaylist: Song[];
  removeFromPlaylist: (track: Song) => void;
  setPlaylistName: (name: string) => void;
  playlistName: string;
  currentUser: (token: string) => Promise<{ id: string }>;
  createPlaylist: (
    userId: string,
    name: string,
    tracksUris: string[],
    token: string
  ) => Promise<void>;
  token: string | null;
}

const MergedPlaylist: React.FC<MergedPlaylistProps> = ({
  spotifyPlaylist,
  youtubePlaylist,
  removeFromPlaylist,
  setPlaylistName,
  playlistName,
  currentUser,
  createPlaylist,
  token,
}) => {
  const { handleSelectSong, currentSong } = useContext(PlayingContext);
  const [mergedPlaylist, setMergedPlaylist] = useLocalStorage<{
    name: string;
    tracks: Song[];
  } | null>("mergedPlaylist", null);

  const handleSave = async () => {
    try {
      const merged = {
        name: playlistName,
        tracks: [...youtubePlaylist, ...spotifyPlaylist],
      };

      setMergedPlaylist(merged);
      alert(`Your merged playlist "${playlistName}" was successfully saved!`);
    } catch (error) {
      console.error("Error saving playlist to localStorage:", error);
      alert("Failed to save playlist.");
    }
  };

  const handlePlay = useCallback(
    (track: Song) => {
      handleSelectSong(track);
    },
    [handleSelectSong]
  );

  const handleRemoveFromMergedPlaylist = (track: Song) => {
    if (mergedPlaylist) {
      const updatedTracks = mergedPlaylist.tracks.filter(
        (song) => !(song.id === track.id)
      );
      setMergedPlaylist({ ...mergedPlaylist, tracks: updatedTracks });
    }
  };

  // useEffect(() => {
  //   if (currentTrackUri) {
  //     handleSelectSong(currentTrackUri);
  //   }
  // }, [currentTrackUri, handleSelectSong]);

  return (
    <div className="flex flex-col space-y-2">
      <form>
        <input
          onChange={(e) => setPlaylistName(e.target.value)}
          value={playlistName}
          name="playlist"
          placeholder="Enter playlist name"
          className="p-2 border rounded"
        />
      </form>
      <button
        className="flex py-2 px-4 bg-green-600 rounded-xl text-white"
        type="button"
        onClick={handleSave}
      >
        Save Merged Playlist to LocalStorage
      </button>
      <div>
        <p className="text-xl font-bold">Playing queue</p>
        {spotifyPlaylist.map((track) => (
          <div className="flex items-center space-x-2" key={track.id}>
            <span>
              {track.title} by {track.artist.name}
            </span>
            <button
              onClick={() => removeFromPlaylist(track)}
              aria-label="Remove from Spotify Playlist"
            >
              <IoIosRemoveCircleOutline />
            </button>
            <button
              onClick={() => handlePlay(track)}
              aria-label="Play from Spotify Playlist"
            >
              <FaCirclePlay />
            </button>
          </div>
        ))}
      </div>

      <div>
        <p className="font-semibold text-lg">Saved Merged Playlist</p>
        {mergedPlaylist && (
          <div>
            <p className="font-bold text-xl">{mergedPlaylist.name}</p>
            <ul>
              {mergedPlaylist.tracks.map((track) => (
                <li key={track.id}>
                  {track.title} {track.artist ? `by ${track.artist}` : ""} (
                  {track.type})
                  <button
                    onClick={() => handlePlay(track)}
                    aria-label="Play from saved playlist"
                  >
                    <FaCirclePlay />
                  </button>
                  <button
                    onClick={() => handleRemoveFromMergedPlaylist(track)}
                    aria-label="Remove from saved playlist"
                  >
                    <IoIosRemoveCircleOutline />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex space-x-4">
        <SpotifyPlayer token={token} />
        <YtPlayer />
      </div>
    </div>
  );
};

export default MergedPlaylist;
