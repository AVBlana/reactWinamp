import { Song } from "../types/playerTypes";
import { TrackItem } from "./TrackItem";

interface PlaylistProps {
  playlist: Song[];
  removeFromPlaylist: (trackId: string) => void;
  setPlaylistName: (name: string) => void;
  playlistName: string;
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
}: PlaylistProps) => {
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
        <TrackItem
          key={song.id}
          data={song}
          removeFromPlaylist={removeFromPlaylist}
          origin="playlist"
        />
      ))}
    </div>
  );
};

export default Playlist;
