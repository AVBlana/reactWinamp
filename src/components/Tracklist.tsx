import { Song } from "../types/playerTypes";
import { TrackItem } from "./TrackItem";

const Tracklist = ({
  data,
  saveTrack,
}: {
  data: Song[];
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
