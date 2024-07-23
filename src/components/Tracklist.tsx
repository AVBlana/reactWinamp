import Track, { TrackType } from "./SpotifyTrack";

const Tracklist = ({
  data,
  addToPlaylist,
  saveTrack,
}: {
  data: TrackType[];
  addToPlaylist: (track: TrackType) => void;
  saveTrack: (trackId: string) => void;
}) => {
  return (
    <div>
      <h2>Results</h2>
      {data !== undefined ? (
        data.map((track, index) => (
          <Track
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
