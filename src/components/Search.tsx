import {
  ChangeEventHandler,
  FormEventHandler,
  useContext,
  useState,
} from "react";
import { searchYtVideo, YoutubeVideo } from "../services/YouTubeService";
import { PlayingContext } from "../context/Playing";

export const Search = () => {
  const [searchResults, setSearchResults] = useState<YoutubeVideo[]>([]);
  const [searchFor, setSearchFor] = useState("");

  const { changeSong } = useContext(PlayingContext);

  const onSearch: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      const results = await searchYtVideo(searchFor);
      setSearchResults(results);
      console.log(results);
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeSearchFor: ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchFor(e.target.value);
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
        ></input>
      </form>
      <div>
        {searchResults.map((item) => {
          return (
            <div
              onClick={() => {
                changeSong(
                  `https://www.youtube.com/watch?v=${item.id.videoId}`
                );
              }}
            >
              {item.snippet.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};
