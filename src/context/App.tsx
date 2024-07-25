import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { createContext, ReactNode, useState } from "react";
import { auth } from "../firebaseConfig";

export interface UserGoogle {
  uid: string;
  email: string | null;
}

export const AppContext = createContext(
  {} as {
    userGoogle: UserGoogle | null;
    handleLogin: () => Promise<void>;
    handleLogout: () => Promise<void>;
    spotifyToken: string | null;
    setSpotifyToken: React.Dispatch<React.SetStateAction<string | null>>;
  }
);

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
    await signOut(auth);
    setUserGoogle(null);
  };

  return {
    userGoogle,
    handleLogin,
    handleLogout,
    spotifyToken,
    setSpotifyToken,
  };
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const values = useApp();
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
