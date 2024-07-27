import { Song } from "../types/playerTypes";
import { TrackItem } from "./TrackItem";

const Tracklist = ({
  data,
  addToPlaylist,
  saveTrack,
}: {
  data: Song[];
  addToPlaylist: (track: Song) => void;
  saveTrack: (trackId: string) => void;
}) => {
  return (
    <div>
      <h2>Results</h2>
      {data !== undefined ? (
        data.map((track, index) => (
          <TrackItem
            key={track.id}
            data={data[index]}
            addToPlaylist={addToPlaylist}
            origin="tracklist"
            saveTrack={saveTrack}
          />
        ))
      ) : (
        <h3>No Tracks yet.</h3>
      )}
    </div>
  );
};

export default Tracklist;
