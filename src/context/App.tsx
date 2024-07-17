import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { createContext, ReactNode, useState } from "react";
import { auth } from "../firebaseConfig";

interface User {
  uid: string;
  email: string | null;
}

export const AppContext = createContext(
  {} as {
    user: User | null;
    handleLogin: () => Promise<void>;
    handleLogout: () => Promise<void>;
  }
);

function useApp() {
  const [user, setUser] = useState<User | null>(null);
  const handleLogin = async () => {
    const googleProvider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser({
        uid: result.user.uid,
        email: result.user.email,
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return { user, handleLogin, handleLogout };
}

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const values = useApp();
  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
