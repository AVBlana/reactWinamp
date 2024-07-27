import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API_BASE_URL = "https://api.spotify.com/v1"; // Adjust if necessary

// Helper function to handle token refresh
const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post("/api/spotify/refresh", { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem("token", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Handle refresh token error (e.g., redirect to login)
    throw error;
  }
};

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Refresh the token
  const refreshToken = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const refreshToken = localStorage.getItem("refresh_token"); // Adjust if needed
      if (!refreshToken) throw new Error("No refresh token available");
      const newToken = await refreshAccessToken(refreshToken);
      setToken(newToken);
      return newToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      // Handle error (e.g., redirect to login)
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Check token validity and refresh if necessary
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (token) {
        try {
          await axios.get(`${API_BASE_URL}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 401) {
            // Token is expired, refresh it
            await refreshToken();
          }
        }
      }
    };

    checkTokenValidity();
  }, [token, refreshToken]);

  return {
    token,
    refreshToken,
    isRefreshing,
  };
};
