import axios from "axios";

const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;

export interface YoutubeVideo {
  etag: string;
  id: { kind: string; videoId: string };
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    publishTime: Date;
    publishedAt: Date;
    thumbnails: {
      default: {
        height: number;
        url: string;
        width: number;
      };
      medium: {
        height: number;
        url: string;
        width: number;
      };
      high: {
        height: number;
        url: string;
        width: number;
      };
    }[];
    title: string;
  };
}

export const searchYtVideo = async (searchFor: string) => {
  try {
    const result: { data: { items: YoutubeVideo[] } } = await axios.get(
      "https://youtube.googleapis.com/youtube/v3/search",
      {
        params: {
          limit: 5,
          key: API_KEY,
          part: "snippet",
          q: searchFor,
          type: "video",
        },
      }
    );
    return result.data.items;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getYouTubeVideo = async (videoId: string) => {
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet,contentDetails`
  );
  return response.data.items[0];
};
