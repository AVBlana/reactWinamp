import React, { useState, useContext } from "react";
import { useLocalStorage } from "usehooks-ts";
import { TrackType } from "./SpotifyTrack";
import { Song, PlayingContext } from "../context/Playing";
import SpotifyPlayer from "./players/SpotifyPlayer";

interface MergedPlaylistProps {
  spotifyPlaylist: TrackType[];
  youtubePlaylist: Song[];
  removeFromPlaylist: (trackId: string, source: "spotify" | "youtube") => void;
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
  const { handleSelectSong } = useContext(PlayingContext);
  const [mergedPlaylist, setMergedPlaylist] = useLocalStorage<{
    name: string;
    tracks: {
      id: string;
      uri: string;
      title?: string;
      artist?: string;
      source: string;
    }[];
  } | null>("mergedPlaylist", null);

  const [currentTrackUri, setCurrentTrackUri] = useState<string>("");

  const handleSave = async () => {
    try {
      const merged = {
        name: playlistName,
        tracks: [
          ...spotifyPlaylist.map((track) => ({
            id: track.id,
            uri: track.uri,
            title: track.name,
            artist: track.artists.map((artist) => artist.name).join(", "),
            source: "spotify",
          })),
          ...youtubePlaylist.map((song) => ({
            id: song.url,
            uri: song.url,
            title: song.title,
            source: "youtube",
          })),
        ],
      };

      setMergedPlaylist(merged);
      alert(`Your merged playlist ${playlistName} was successfully saved!`);
    } catch (error) {
      console.error("Error saving playlist to localStorage:", error);
    }
  };

  const handlePlay = (track: {
    uri: string;
    title?: string;
    source: string;
  }) => {
    if (track.source === "spotify") {
      setCurrentTrackUri(track.uri);
      handleSelectSong({
        url: track.uri,
        title: track.title,
        source: "spotify",
      });
    } else if (track.source === "youtube") {
      handleSelectSong({
        url: track.uri,
        title: track.title,
        source: "youtube",
      });
    }
  };

  return (
    <div>
      <form>
        <input
          onChange={(e) => setPlaylistName(e.target.value)}
          value={playlistName}
          name="playlist"
          placeholder="Enter playlist name"
        />
      </form>
      <button type="button" onClick={handleSave}>
        Save Merged Playlist
      </button>
      <div>
        <h3>Spotify Playlist</h3>
        {spotifyPlaylist.map((track) => (
          <div key={track.id}>
            {track.name} by{" "}
            {track.artists.map((artist) => artist.name).join(", ")}
            <button onClick={() => removeFromPlaylist(track.id, "spotify")}>
              Remove
            </button>
            <button
              onClick={() =>
                handlePlay({
                  uri: track.uri,
                  title: track.name,
                  source: "spotify",
                })
              }
            >
              Play
            </button>
          </div>
        ))}
      </div>
      <div>
        <h3>YouTube Playlist</h3>
        {youtubePlaylist.map((song) => (
          <div key={song.url}>
            {song.title}
            <button onClick={() => removeFromPlaylist(song.url, "youtube")}>
              Remove
            </button>
            <button
              onClick={() =>
                handlePlay({
                  uri: song.url,
                  title: song.title,
                  source: "youtube",
                })
              }
            >
              Play
            </button>
          </div>
        ))}
      </div>
      <div>
        <h3>Saved Merged Playlist</h3>
        {mergedPlaylist && (
          <div>
            <h4>{mergedPlaylist.name}</h4>
            <ul>
              {mergedPlaylist.tracks.map((track) => (
                <li key={track.id}>
                  {track.title} {track.artist ? `by ${track.artist}` : ""} (
                  {track.source})
                  <button
                    onClick={() =>
                      handlePlay({
                        uri: track.uri,
                        title: track.title,
                        source: track.source,
                      })
                    }
                  >
                    Play
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {token && <SpotifyPlayer token={token} trackUri={currentTrackUri} />}
    </div>
  );
};

export default MergedPlaylist;
