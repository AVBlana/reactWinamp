import React, { useContext } from "react";
import { IoAdd, IoRemove } from "react-icons/io5";
import { Song } from "../types/playerTypes";
import { PlayingContext } from "../context/Playing";

interface TrackProps {
  data: Song;
  addToPlaylist?: (track: Song) => void;
  removeFromPlaylist?: (trackId: string) => void;
  origin: string;
  saveTrack?: (trackId: string) => void;
}

export const TrackItem: React.FC<TrackProps> = ({
  data,
  addToPlaylist,
  removeFromPlaylist,
  origin,
  saveTrack,
}) => {
  const { handleSelectSong } = useContext(PlayingContext);

  const clickHandler = () => {
    if (origin === "tracklist" && addToPlaylist) {
      addToPlaylist(data);
    } else if (origin === "playlist" && removeFromPlaylist) {
      removeFromPlaylist(data.id);
    }
  };

  const onSave = () => {
    if (saveTrack) {
      saveTrack(data.id);
    }
  };
  const handlePlay = () => {
    handleSelectSong(data);
  };

  return (
    <div key={data.id}>
      <div className="flex gap-2 items-center pt-2 pb-2 pr-2">
        <img src={data.artwork.small.url} alt={data.title} />
        <div>
          <h4>{data.title}</h4>
          <p>{data.artist.name}</p>
        </div>
      </div>
      <div className="flex pb-4">
        {origin === "tracklist" ? (
          <button className="flex pt-2 pb-2 pr-2" onClick={onSave}>
            Save Track
          </button>
        ) : null}
        <button onClick={clickHandler}>
          {origin === "tracklist" ? (
            <IoAdd className="p-1 border rounded-full" size={30} />
          ) : (
            <IoRemove size={20} />
          )}
        </button>
        <button onClick={handlePlay}>Play</button>
      </div>
    </div>
  );
};
