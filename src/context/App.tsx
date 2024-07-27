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
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
  spotifyToken: string | null;
  setSpotifyToken: React.Dispatch<React.SetStateAction<string | null>>;
  refreshSpotifyToken: () => Promise<void>;
}

export const AppContext = createContext<AppContextProps>({
  userGoogle: null,
  handleLogin: async () => {},
  handleLogout: async () => {},
  spotifyToken: null,
  setSpotifyToken: () => {},
  refreshSpotifyToken: async () => {},
});

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserGoogle(null);
      setSpotifyToken(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const refreshSpotifyToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post("/refresh", { refreshToken });
      const newToken = response.data.access_token;

      setSpotifyToken(newToken);
      localStorage.setItem("access_token", newToken);
    } catch (error) {
      console.error("Error refreshing Spotify token:", error);
      setSpotifyToken(null);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
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
    spotifyToken,
    setSpotifyToken,
    refreshSpotifyToken,
  };
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const values = useApp();
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
