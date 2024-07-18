import { useEffect } from "react";
import Track, { TrackType } from "./Track";

interface PlaylistProps {
  playlist: TrackType[];
  removeFromPlaylist: (trackId: string) => void;
  setPlaylistName: (name: string) => void;
  playlistName: string;
  currentUser: (token: string) => Promise<{ id: string }>;
  createPlaylist: (
    userId: string,
    name: string,
    token: string
  ) => Promise<void>;
  token: string;
}

const Playlist = ({
  playlist,
  removeFromPlaylist,
  setPlaylistName,
  playlistName,
  currentUser,
  createPlaylist,
  token,
}: PlaylistProps) => {
  const clickHandler = async () => {
    try {
      const userData = await currentUser(token);
      const userId = userData.id;
      await createPlaylist(userId, playlistName, token);
    } catch (error) {
      console.error("Error creating playlist:", error);
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
      {playlist.map((song, index) => (
        <Track
          key={song.id}
          data={song}
          removeFromPlaylist={removeFromPlaylist}
          origin="playlist"
        />
      ))}
      <button type="submit" onClick={clickHandler}>
        Save to Spotify
      </button>
    </div>
  );
};

export default Playlist;
