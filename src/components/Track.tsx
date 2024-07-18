import React from "react";
import { IoAdd, IoRemove } from "react-icons/io5";

export interface TrackType {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
  uri: string;
}

interface TrackProps {
  data: TrackType;
  addToPlaylist?: (track: TrackType) => void;
  removeFromPlaylist?: (trackId: string) => void;
  origin: string;
  saveTrack?: (trackId: string) => void;
}

const Track: React.FC<TrackProps> = ({
  data,
  addToPlaylist,
  removeFromPlaylist,
  origin,
  saveTrack,
}) => {
  const artistArray = data?.artists?.map((artist) => artist.name) || [];
  const artists = artistArray.join(", ");

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

  const SaveIcon = () => {
    return (
      <div>
        <IoAdd size={20} />
      </div>
    );
  };

  const RemoveIcon = () => {
    return (
      <div>
        <IoRemove size={20} />
      </div>
    );
  };

  return (
    <div key={data.id}>
      <div className="flex gap-2 items-center pt-2 pb-2 pr-2">
        <img src={data.album.images[2].url} alt={data.name} />
        <div>
          <h4>{data.name}</h4>
          <p>{artists}</p>
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
      </div>
    </div>
  );
};

export default Track;
