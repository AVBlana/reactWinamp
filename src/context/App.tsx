import { createContext, ReactNode, useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import axios from "axios";

interface UserGoogle {
  uid: string;
  email: string | null;
}

interface AppContextProps {
  userGoogle: UserGoogle | null;
  spotifyToken: string | null;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  setSpotifyToken: React.Dispatch<React.SetStateAction<string | null>>;
  handleSpotifyLogout: () => Promise<void>;
  refreshSpotifyToken: () => Promise<void>;
}

export const AppContext = createContext({
  userGoogle: null,
  spotifyToken: null,
} as AppContextProps);

function useApp() {
  const [userGoogle, setUserGoogle] = useState<UserGoogle | null>(null);
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  const handleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUserGoogle({
        uid: result.user.uid,
        email: result.user.email,
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSpotifyLogout = async () => {
    localStorage.removeItem("token");
    setSpotifyToken(null);
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserGoogle(null);
      handleSpotifyLogout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshSpotifyToken = async () => {
    try {
      const refreshToken = localStorage.getItem("token");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post("/refresh", { refreshToken });
      const newToken = response.data.access_token;

      setSpotifyToken(newToken);
      localStorage.setItem("token", newToken);
    } catch (error) {
      console.error("Error refreshing Spotify token:", error);
      setSpotifyToken(null);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setSpotifyToken(storedToken);
    } else {
      refreshSpotifyToken(); // Refresh if token is not available
    }
  }, []);

  return {
    userGoogle,
    handleLogin,
    handleLogout,
    handleSpotifyLogout,
    spotifyToken,
    setSpotifyToken,
    refreshSpotifyToken,
  };
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const values = useApp();
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
