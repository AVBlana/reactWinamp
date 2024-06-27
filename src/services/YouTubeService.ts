import axios from "axios";

const API_KEY = "YOUR_YOUTUBE_API_KEY";

export const getYouTubeVideo = async (videoId: string) => {
  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet,contentDetails`
  );
  return response.data.items[0];
};
