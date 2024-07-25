// src/hooks/useRefreshToken.tsx

import { useState } from "react";

const useRefreshToken = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshToken = async (): Promise<string> => {
    const refreshToken = localStorage.getItem("refresh_token");
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID; // Fetch from environment variables

    if (!refreshToken || !CLIENT_ID) {
      throw new Error("No refresh token or client ID available");
    }

    const url = "https://accounts.spotify.com/api/token";

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
      }),
    };

    try {
      setIsRefreshing(true);
      const response = await fetch(url, payload);
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        return data.access_token;
      } else {
        throw new Error(data.error || "Failed to refresh token");
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  };

  return { refreshToken, isRefreshing };
};

export default useRefreshToken;
