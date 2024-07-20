import React, {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useState,
} from "react";
import { searchYtVideo, YoutubeVideo } from "../services/YouTubeService";
import { PlayingContext, Song } from "../context/Playing";

interface SearchProps {
  ytPlaylist: Song[];
  setYtPlaylist: React.Dispatch<React.SetStateAction<Song[]>>;
}

export const Search: React.FC<SearchProps> = ({
  ytPlaylist,
  setYtPlaylist,
}) => {
  const [searchResults, setSearchResults] = useState<YoutubeVideo[]>([]);
  const [searchFor, setSearchFor] = useState("");

  const { changeSong } = useContext(PlayingContext);

  const onSearch: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const results = await searchYtVideo(searchFor);
      setSearchResults(results);
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeSearchFor: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchFor(e.target.value);
  };

  const isInPlaylist = (url: string) =>
    ytPlaylist.some((song) => song.url === url);

  const handleAddOrRemoveSong = (song: Song) => {
    const updatedPlaylist = isInPlaylist(song.url)
      ? ytPlaylist.filter((s) => s.url !== song.url)
      : [...ytPlaylist, song];

    setYtPlaylist(updatedPlaylist);
    localStorage.setItem("ytPlaylist", JSON.stringify(updatedPlaylist));
  };

  return (
    <div>
      <form onSubmit={onSearch}>
        <input
          type="text"
          value={searchFor}
          onChange={onChangeSearchFor}
          placeholder="Type to search on youtube"
          className="border-2 rounded-md p-2"
        />
      </form>
      <div>
        {searchResults.map((item) => {
          const song: Song = {
            title: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          };

          return (
            <div
              key={item.id.videoId}
              className="flex justify-between items-center"
            >
              <div onClick={() => changeSong(song)} className="cursor-pointer">
                {item.snippet.title}
              </div>
              <button
                onClick={() => handleAddOrRemoveSong(song)}
                className="ml-2 p-1 bg-blue-500 text-white rounded"
              >
                {isInPlaylist(song.url)
                  ? "Remove from Playlist"
                  : "Add to Playlist"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
